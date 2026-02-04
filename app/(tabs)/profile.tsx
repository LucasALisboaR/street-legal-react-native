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
  ActivityIndicator,
  Alert,
  ImageBackground,
  RefreshControl,
  StyleSheet
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { BrandColors } from '@/constants/theme';
import {
  BadgesTab,
  GarageTab,
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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showImageSourceDialog, setShowImageSourceDialog] = useState(false);
  const [imageSourceMode, setImageSourceMode] = useState<'avatar' | 'banner'>('avatar');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [avatarKey, setAvatarKey] = useState(0);
  const [bannerKey, setBannerKey] = useState(0);
  const avatarUri = profile?.avatarUrl
    ? `${profile.avatarUrl}${profile.avatarUrl.includes('?') ? '&' : '?'}_t=${avatarKey}`
    : undefined;
  const bannerUri = profile?.bannerUrl
    ? `${profile.bannerUrl}${profile.bannerUrl.includes('?') ? '&' : '?'}_t=${bannerKey}`
    : undefined;
  const stats = profile?.stats ?? { totalCars: 0, totalEvents: 0, totalBadges: 0 };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false);
    try {
      await signOut();
      router.replace('/login');
    } catch {
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
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
      ? { cropperCircleOverlay: true, cropperToolbarTitle: 'Editar Foto' }
      : { cropperCircleOverlay: false, width: 1200, height: 500, cropperToolbarTitle: 'Editar Foto' };
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
    setImageSourceMode(mode);
    setShowImageSourceDialog(true);
  };

  const handleImageSource = async (source: 'camera' | 'library') => {
    setShowImageSourceDialog(false);
    
    // Define o estado de loading baseado no modo
    if (imageSourceMode === 'avatar') {
      setUploadingAvatar(true);
    } else {
      setUploadingBanner(true);
    }

    try {
      // Primeiro, tenta selecionar/tirar a foto
      let image;
      try {
        image = await pickImage(imageSourceMode, source);
      } catch (pickerErr: any) {
        console.error('Erro ao selecionar imagem:', pickerErr);
        
        // Verifica se o usuário cancelou
        if (pickerErr?.code === 'E_PICKER_CANCELLED') {
          return;
        }
        
        // Mensagens de erro específicas para o picker
        let errorMessage = `Não foi possível ${source === 'camera' ? 'abrir a câmera' : 'acessar a galeria'}.`;
        
        if (pickerErr?.code === 'E_NO_CAMERA_PERMISSION' || pickerErr?.message?.includes('camera') || pickerErr?.message?.includes('permission')) {
          errorMessage = 'Permissão de câmera negada. Por favor, permita o acesso à câmera nas configurações do dispositivo.';
        } else if (pickerErr?.code === 'E_NO_LIBRARY_PERMISSION' || pickerErr?.message?.includes('library') || pickerErr?.message?.includes('gallery')) {
          errorMessage = 'Permissão de galeria negada. Por favor, permita o acesso à galeria nas configurações do dispositivo.';
        } else if (pickerErr?.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR') {
          errorMessage = 'A câmera não está disponível no simulador. Use um dispositivo físico.';
        } else if (pickerErr?.message) {
          errorMessage = pickerErr.message;
        }
        
        Alert.alert('Erro', errorMessage);
        return;
      }
      
      // Se chegou aqui, a imagem foi selecionada com sucesso
      const data = buildFormData(image.path, image.mime, image.filename);
      
      // Agora tenta fazer o upload
      try {
        if (imageSourceMode === 'avatar') {
          await updateAvatar(data);
          // Força o reload da imagem adicionando um timestamp único
          setAvatarKey(Date.now());
        } else {
          await updateBanner(data);
          // Força o reload do banner adicionando um timestamp único
          setBannerKey(Date.now());
        }
      } catch (uploadErr: any) {
        console.error('Erro ao fazer upload:', uploadErr);
        Alert.alert('Erro', `Não foi possível fazer upload ${imageSourceMode === 'avatar' ? 'da foto' : 'do banner'}. Tente novamente.`);
      }
    } catch (err: any) {
      console.error('Erro geral ao processar imagem:', err);
      Alert.alert('Erro', `Não foi possível atualizar ${imageSourceMode === 'avatar' ? 'a foto' : 'o banner'}.`);
    } finally {
      // Remove o loading
      if (imageSourceMode === 'avatar') {
        setUploadingAvatar(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  const handleCancelImageSource = () => {
    setShowImageSourceDialog(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BrandColors.darkGray }} edges={['top']}>
      <Box flex={1} bg={BrandColors.darkGray}>
        <ProfileHeader onPressSettings={() => { }} onPressLogout={handleLogout} />
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
              {/* Banner com ImageBackground */}
              <Box position="relative" w="100%" h={140}>
                <Pressable onPress={() => promptImageSource('banner')} style={{ width: '100%', height: '100%' }}>
                  {bannerUri ? (
                    <ImageBackground
                      source={{ uri: bannerUri }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    >
                      {/* Botão de editar banner */}
                      <Box
                        position="absolute"
                        top={12}
                        right={12}
                        bg="rgba(0,0,0,0.5)"
                        borderRadius="$full"
                        p="$2"
                      >
                        <Ionicons name="camera" size={18} color={BrandColors.white} />
                      </Box>
                    </ImageBackground>
                  ) : (
                    <Box flex={1} bg={BrandColors.mediumGray} justifyContent="center" alignItems="center">
                      <Ionicons name="image-outline" size={32} color={BrandColors.lightGray} />
                      {/* Botão de editar banner */}
                      <Box
                        position="absolute"
                        top={12}
                        right={12}
                        bg="rgba(0,0,0,0.5)"
                        borderRadius="$full"
                        p="$2"
                      >
                        <Ionicons name="camera" size={18} color={BrandColors.white} />
                      </Box>
                    </Box>
                  )}
                </Pressable>

                {/* Avatar sobrepondo a parte inferior do banner */}
                <Box
                  position="absolute"
                  bottom={-40}
                  left="$6"
                  alignItems="flex-start"
                >
                  <Pressable onPress={() => promptImageSource('avatar')} disabled={uploadingAvatar}>
                    <Box position="relative" alignItems="center" justifyContent="center">
                      <Avatar size="2xl" borderRadius="$full" borderWidth={4} borderColor={BrandColors.darkGray}>
                        {avatarUri ? (
                          <AvatarImage source={{ uri: avatarUri }} />
                        ) : (
                          <AvatarFallbackText bg={BrandColors.mediumGray} fontSize="$2xl">
                            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallbackText>
                        )}
                      </Avatar>
                      
                      {/* Overlay de loading */}
                      {uploadingAvatar && (
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bg="rgba(0,0,0,0.6)"
                          borderRadius="$full"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <ActivityIndicator size="large" color={BrandColors.orange} />
                        </Box>
                      )}
                      
                      {!uploadingAvatar && (
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
                      )}
                    </Box>
                  </Pressable>
                </Box>
              </Box>

              {/* Nome e Bio abaixo do avatar */}
              <VStack alignItems="flex-start" mt={50} mb="$4" px="$6" gap="$2">
                <HStack alignItems="center" gap="$2">
                  <Text color={BrandColors.white} fontSize="$2xl" fontWeight="$bold">
                    {profile?.name ?? 'Sem nome'}
                  </Text>
                  <Pressable onPress={openEditModal} p="$1.5" borderRadius="$full" bg="rgba(255,69,0,0.15)">
                    <Ionicons name="pencil" size={16} color={BrandColors.orange} />
                  </Pressable>
                </HStack>

                {profile?.bio && (
                  <Text color={BrandColors.lightGray} fontSize="$sm" textAlign="left">
                    {profile.bio}
                  </Text>
                )}
              </VStack>

              {/* Estatísticas minimalistas em linha horizontal */}
              {/* <HStack
                justifyContent="center"
                alignItems="center"
                gap="$6"
                px="$6"
                py="$4"
                borderTopWidth={1}
                borderBottomWidth={1}
                borderColor="rgba(255,255,255,0.1)"
              >
                <VStack alignItems="center" gap="$1">
                  <Text color={BrandColors.orange} fontSize="$2xl" fontWeight="$bold">
                    {stats.totalCars}
                  </Text>
                  <Text color={BrandColors.lightGray} fontSize="$xs" textTransform="uppercase" letterSpacing={1}>
                    Carros
                  </Text>
                </VStack>
                <Box w={1} h={30} bg="rgba(255,255,255,0.1)" />
                <VStack alignItems="center" gap="$1">
                  <Text color={BrandColors.orange} fontSize="$2xl" fontWeight="$bold">
                    {stats.totalEvents}
                  </Text>
                  <Text color={BrandColors.lightGray} fontSize="$xs" textTransform="uppercase" letterSpacing={1}>
                    Eventos
                  </Text>
                </VStack>
                <Box w={1} h={30} bg="rgba(255,255,255,0.1)" />
                <VStack alignItems="center" gap="$1">
                  <Text color={BrandColors.orange} fontSize="$2xl" fontWeight="$bold">
                    {stats.totalBadges}
                  </Text>
                  <Text color={BrandColors.lightGray} fontSize="$xs" textTransform="uppercase" letterSpacing={1}>
                    Badges
                  </Text>
                </VStack>
              </HStack> */}

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
                <VStack gap="$2">
                  <Text color={BrandColors.lightGray} fontSize="$sm">
                    Nome
                  </Text>
                  <Input bg={BrandColors.mediumGray} borderRadius="$md">
                    <InputField
                      value={nameDraft}
                      onChangeText={setNameDraft}
                      placeholder="Nome"
                      placeholderTextColor={BrandColors.placeholderGray}
                      color={BrandColors.white}
                    />
                  </Input>
                </VStack>
                <VStack gap="$2">
                  <Text color={BrandColors.lightGray} fontSize="$sm">
                    Bio
                  </Text>
                  <Box bg={BrandColors.mediumGray} borderRadius="$md">
                    <Input bg={BrandColors.mediumGray} borderRadius="$md">
                      <InputField
                        value={bioDraft}
                        onChangeText={setBioDraft}
                        placeholder="Bio"
                        placeholderTextColor={BrandColors.placeholderGray}
                        color={BrandColors.white}
                        multiline
                        numberOfLines={3}
                        maxLength={100}
                      />
                    </Input>
                  </Box>
                </VStack>
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

        {/* Logout Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showLogoutDialog}
          onClose={handleCancelLogout}
          onConfirm={handleConfirmLogout}
          title="Confirmar Logout"
          bodyText="Tem certeza que deseja sair?"
          btnConfirm="Sair"
          btnCancel="Cancelar"
        />

        {/* Image Source Selection Dialog */}
        <Modal isOpen={showImageSourceDialog} onClose={handleCancelImageSource} size="md">
          <ModalBackdrop />
          <ModalContent bg={BrandColors.darkGray} borderRadius="$3xl">
            <ModalHeader>
              <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold">
                Selecionar imagem
              </Text>
              <ModalCloseButton>
                <Ionicons name="close" size={20} color={BrandColors.white} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text color={BrandColors.lightGray} fontSize="$md" mb="$4">
                Escolha a origem da imagem
              </Text>
            </ModalBody>
            <ModalFooter gap="$3">
              <Button
                variant="outline"
                borderColor={BrandColors.lightGray}
                borderRadius="$full"
                onPress={handleCancelImageSource}
                flex={1}
                minWidth={80}
              >
                <ButtonText color={BrandColors.lightGray} numberOfLines={1}>
                  Cancelar
                </ButtonText>
              </Button>
              <Button
                bg={BrandColors.orange}
                borderRadius="$full"
                onPress={() => handleImageSource('camera')}
                flex={1}
              >
                <Ionicons name="camera" size={20} color={BrandColors.white} />
              </Button>
              <Button
                bg={BrandColors.orange}
                borderRadius="$full"
                onPress={() => handleImageSource('library')}
                flex={1}
              >
                <Ionicons name="images" size={20} color={BrandColors.white} />
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    // paddingBottom: 120,
  },
});
