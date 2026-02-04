import { Ionicons } from '@expo/vector-icons';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonText,
  HStack,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  RefreshControl,
  StyleSheet
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';
import {
  BadgesTab,
  GarageTab,
  ProfileCard,
  ProfileHeader,
  ProfileTabKey,
  SegmentedTabs,
  TeamsTab,
} from '@/features/profile';
import { useSignOut as signOut } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function ProfileScreen() {
  const { profile, loading, error, refreshing, refreshProfile, updateAvatar, updateBanner, updateNameBio } =
    useUserProfile();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('garage');
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [bioDraft, setBioDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const [avatarKey, setAvatarKey] = useState(0);
  const avatarUri = profile?.avatarUrl 
    ? `${profile.avatarUrl}${profile.avatarUrl.includes('?') ? '&' : '?'}_t=${avatarKey}`
    : undefined;
  const stats = profile?.stats ?? { totalCars: 0, totalEvents: 0, totalBadges: 0 };

  const handleLogout = async () => {
    Alert.alert('Confirmar Logout', 'Tem certeza que deseja sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/login');
          } catch {
            Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
          }
        },
      },
    ]);
  };

  const openEditModal = () => {
    setNameDraft(profile?.name ?? '');
    setBioDraft(profile?.bio ?? '');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!nameDraft.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    setSaving(true);
    try {
      await updateNameBio({ name: nameDraft.trim(), bio: bioDraft.trim() });
      setEditing(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const buildFormData = (path: string, mime: string, filename?: string) => {
    const data = new FormData();
    data.append('file', {
      uri: path,
      type: mime,
      name: filename ?? `upload-${Date.now()}.jpg`,
    } as any);
    return data;
  };

  const pickImage = async (mode: 'avatar' | 'banner', source: 'camera' | 'library') => {
    const cropConfig = mode === 'avatar'
      ? { cropperCircleOverlay: true }
      : { cropperCircleOverlay: false, width: 1200, height: 500 };
    const image =
      source === 'camera'
        ? await ImageCropPicker.openCamera({
            cropping: true,
            compressImageQuality: 0.9,
            mediaType: 'photo',
            ...cropConfig,
          })
        : await ImageCropPicker.openPicker({
            cropping: true,
            compressImageQuality: 0.9,
            mediaType: 'photo',
            ...cropConfig,
          });
    return image;
  };

  const promptImageSource = (mode: 'avatar' | 'banner') => {
    Alert.alert('Selecionar imagem', 'Escolha a origem da imagem', [
      {
        text: 'Câmera',
        onPress: async () => {
          try {
            const image = await pickImage(mode, 'camera');
            const data = buildFormData(image.path, image.mime, image.filename);
            if (mode === 'avatar') {
              await updateAvatar(data);
              // Força o reload da imagem adicionando um timestamp único
              setAvatarKey(Date.now());
            } else {
              await updateBanner(data);
            }
          } catch (err) {
            if ((err as { code?: string })?.code !== 'E_PICKER_CANCELLED') {
              Alert.alert('Erro', `Não foi possível atualizar ${mode === 'avatar' ? 'a foto' : 'o banner'}.`);
            }
          }
        },
      },
      {
        text: 'Galeria',
        onPress: async () => {
          try {
            const image = await pickImage(mode, 'library');
            const data = buildFormData(image.path, image.mime, image.filename);
            if (mode === 'avatar') {
              await updateAvatar(data);
              // Força o reload da imagem adicionando um timestamp único
              setAvatarKey(Date.now());
            } else {
              await updateBanner(data);
            }
          } catch (err) {
            if ((err as { code?: string })?.code !== 'E_PICKER_CANCELLED') {
              Alert.alert('Erro', `Não foi possível atualizar ${mode === 'avatar' ? 'a foto' : 'o banner'}.`);
            }
          }
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrandColors.darkGray }} edges={['top']}>
      <Box flex={1} bg={BrandColors.darkGray}>
        <ProfileHeader onPressSettings={() => {}} onPressLogout={handleLogout} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshProfile} tintColor={BrandColors.orange} />}
      >
        {loading && !profile ? (
          <Box h={280} mx="$6" borderRadius="$3xl" bg={BrandColors.mediumGray} />
        ) : error && !profile ? (
          <VStack mx="$6" p="$6" bg={BrandColors.mediumGray} borderRadius="$3xl" alignItems="center" gap="$3">
            <Ionicons name="alert-circle" size={32} color={BrandColors.orange} />
            <Text color={BrandColors.lightGray}>Não foi possível carregar o perfil.</Text>
            <Button bg={BrandColors.orange} px="$5" py="$2.5" borderRadius="$full" onPress={refreshProfile} mt="$2">
              <ButtonText color={BrandColors.white} fontWeight="$semibold">Tentar novamente</ButtonText>
            </Button>
          </VStack>
        ) : (
          <>
            <ProfileCard>
              <VStack alignItems="center" mt="$4" gap="$3">
                {/* Avatar centralizado */}
                <Pressable onPress={() => promptImageSource('avatar')}>
                  <Box position="relative" alignItems="center" justifyContent="center">
                    <Avatar size="2xl" borderRadius="$full" borderWidth={3} borderColor={BrandColors.orange}>
                      {avatarUri ? (
                        <AvatarImage source={{ uri: avatarUri }} />
                      ) : (
                        <AvatarFallbackText bg={BrandColors.mediumGray} fontSize="$2xl">
                          {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallbackText>
                      )}
                    </Avatar>
                    <Box
                      position="absolute"
                      bottom={0}
                      right={0}
                      bg={BrandColors.orange}
                      borderWidth={2}
                      borderColor={BrandColors.darkGray}
                      w={32}
                      h={32}
                      borderRadius="$full"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Ionicons name="camera" size={16} color={BrandColors.white} />
                    </Box>
                  </Box>
                </Pressable>

                {/* Nome com ícone de edição */}
                <HStack alignItems="center" gap="$2" mt="$2">
                  <Text color={BrandColors.white} fontSize="$xl" fontWeight="$bold">
                    {profile?.name ?? 'Sem nome'}
                  </Text>
                  <Pressable onPress={openEditModal} p="$1.5" borderRadius="$full" bg="rgba(255,69,0,0.15)">
                    <Ionicons name="pencil" size={16} color={BrandColors.orange} />
                  </Pressable>
                </HStack>

                {/* Bio pill */}
                <Box bg="rgba(255,255,255,0.08)" py="$2" px="$4" borderRadius="$full" mt="$1">
                  <Text color={BrandColors.lightGray} fontSize="$xs">
                    {profile?.bio || 'Sem bio por enquanto.'}
                  </Text>
                </Box>

                {/* Cards de estatísticas */}
                <HStack gap="$3" mt="$5" w="100%">
                  <Pressable flex={1}>
                    <Box
                      bg={BrandColors.mediumGray}
                      borderRadius="$2xl"
                      py="$3"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth={1}
                      borderColor="rgba(255,69,0,0.2)"
                    >
                      <Text color={BrandColors.white} fontSize="$xl" fontWeight="$bold">
                        {stats.totalCars}
                      </Text>
                      <Text color={BrandColors.lightGray} fontSize="$xs" textTransform="uppercase" letterSpacing={0.6} mt="$1">
                        Carros
                      </Text>
                    </Box>
                  </Pressable>
                  <Pressable flex={1}>
                    <Box
                      bg={BrandColors.mediumGray}
                      borderRadius="$2xl"
                      py="$3"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth={1}
                      borderColor="rgba(255,69,0,0.2)"
                    >
                      <Text color={BrandColors.white} fontSize="$xl" fontWeight="$bold">
                        {stats.totalEvents}
                      </Text>
                      <Text color={BrandColors.lightGray} fontSize="$xs" textTransform="uppercase" letterSpacing={0.6} mt="$1">
                        Eventos
                      </Text>
                    </Box>
                  </Pressable>
                  <Pressable flex={1}>
                    <Box
                      bg={BrandColors.mediumGray}
                      borderRadius="$2xl"
                      py="$3"
                      alignItems="center"
                      justifyContent="center"
                      borderWidth={1}
                      borderColor="rgba(255,69,0,0.2)"
                    >
                      <Text color={BrandColors.white} fontSize="$xl" fontWeight="$bold">
                        {stats.totalBadges}
                      </Text>
                      <Text color={BrandColors.lightGray} fontSize="$xs" textTransform="uppercase" letterSpacing={0.6} mt="$1">
                        Badges
                      </Text>
                    </Box>
                  </Pressable>
                </HStack>
              </VStack>
            </ProfileCard>
            <SegmentedTabs activeTab={activeTab} onChange={setActiveTab} />
            {activeTab === 'garage' && <GarageTab garage={profile?.garage ?? []} />}
            {activeTab === 'teams' && <TeamsTab />}
            {activeTab === 'badges' && <BadgesTab />}
          </>
        )}
      </ScrollView>

      <Modal isOpen={editing} onClose={() => setEditing(false)} size="lg">
        <ModalBackdrop />
        <ModalContent bg={BrandColors.darkGray} borderRadius="$3xl">
          <ModalHeader>
            <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold">
              Editar perfil
            </Text>
            <ModalCloseButton>
              <Ionicons name="close" size={20} color={BrandColors.white} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody gap="$3">
            <VStack gap="$3">
              <Input bg={BrandColors.mediumGray} borderRadius="$md">
                <InputField
                  value={nameDraft}
                  onChangeText={setNameDraft}
                  placeholder="Nome"
                  placeholderTextColor={BrandColors.placeholderGray}
                  color={BrandColors.white}
                />
              </Input>
              <Box bg={BrandColors.mediumGray} borderRadius="$md" style={{ minHeight: 80 }}>
                <Input bg={BrandColors.mediumGray} borderRadius="$md">
                  <InputField
                    value={bioDraft}
                    onChangeText={setBioDraft}
                    placeholder="Bio"
                    placeholderTextColor={BrandColors.placeholderGray}
                    color={BrandColors.white}
                    multiline
                    textAlignVertical="top"
                    style={{ minHeight: 80 }}
                  />
                </Input>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack gap="$3" flex={1} justifyContent="space-between">
              <Button
                flex={1}
                variant="outline"
                borderColor={BrandColors.lightGray}
                borderRadius="$full"
                onPress={() => setEditing(false)}
              >
                <ButtonText color={BrandColors.lightGray}>Cancelar</ButtonText>
              </Button>
              <Button
                flex={1}
                bg={BrandColors.orange}
                borderRadius="$full"
                onPress={handleSave}
                isDisabled={saving}
              >
                <ButtonText color={BrandColors.white} fontWeight="$semibold">
                  {saving ? 'Salvando...' : 'Salvar'}
                </ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
});
