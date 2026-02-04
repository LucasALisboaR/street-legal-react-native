import { Ionicons } from '@expo/vector-icons';
import { Button, ButtonText } from '@gluestack-ui/themed';
import ImageCropPicker from 'react-native-image-crop-picker';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  AvatarWithEdit,
  ProfileCard,
  ProfileHeader,
  ProfileTabKey,
  SegmentedTabs,
  StatMiniCard,
} from '@/components/profile';
import { BrandColors } from '@/constants/theme';
import { useSignOut as signOut } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';

const EMPTY_AVATAR =
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop';

export default function ProfileScreen() {
  const { profile, loading, error, refreshing, refreshProfile, updateAvatar, updateBanner, updateNameBio } =
    useUserProfile();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('garage');
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [bioDraft, setBioDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const avatarUri = profile?.avatarUrl || EMPTY_AVATAR;
  const stats = profile?.stats ?? { totalCars: 0, totalEvents: 0, totalBadges: 0 };

  const joinedAt = useMemo(() => {
    if (!profile?.joinedAt) {
      return '';
    }
    const date = new Date(profile.joinedAt);
    return date.toLocaleDateString('pt-BR');
  }, [profile?.joinedAt]);

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
    <View style={styles.container}>
      <ProfileHeader onPressSettings={() => {}} onPressLogout={handleLogout} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshProfile} tintColor={BrandColors.orange} />}
      >
        {loading && !profile ? (
          <View style={styles.skeletonCard} />
        ) : error && !profile ? (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle" size={32} color={BrandColors.orange} />
            <Text style={styles.errorText}>Não foi possível carregar o perfil.</Text>
            <Button style={styles.retryButton} onPress={refreshProfile}>
              <ButtonText style={styles.retryText}>Tentar novamente</ButtonText>
            </Button>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.banner} onPress={() => promptImageSource('banner')}>
              {profile?.bannerUrl ? (
                <Image source={{ uri: profile.bannerUrl }} style={styles.bannerImage} />
              ) : null}
              <View style={styles.bannerOverlay}>
                <Ionicons name="image" size={18} color={BrandColors.white} />
                <Text style={styles.bannerText}>Editar banner</Text>
              </View>
            </TouchableOpacity>
            <ProfileCard>
              <View style={styles.cardHeader}>
                <AvatarWithEdit uri={avatarUri} onPress={() => promptImageSource('avatar')} />
                <View style={styles.nameSection}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText}>{profile?.name ?? 'Sem nome'}</Text>
                    <TouchableOpacity onPress={openEditModal} style={styles.editIcon}>
                      <Ionicons name="pencil" size={16} color={BrandColors.orange} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bioPill}>
                    <Text style={styles.bioText}>{profile?.bio || 'Sem bio por enquanto.'}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.statsRow}>
                <StatMiniCard label="Carros" value={stats.totalCars} />
                <StatMiniCard label="Eventos" value={stats.totalEvents} />
                <StatMiniCard label="Badges" value={stats.totalBadges} />
              </View>
              <View style={styles.footerRow}>
                <Text style={styles.idText}>ID: {profile?.id}</Text>
                {joinedAt ? <Text style={styles.idText}>Desde {joinedAt}</Text> : null}
              </View>
            </ProfileCard>
            <SegmentedTabs activeTab={activeTab} onChange={setActiveTab} />
            <View style={styles.tabContent}>
              <Ionicons name="construct" size={28} color={BrandColors.orange} />
              <Text style={styles.tabContentText}>Conteúdo em breve</Text>
            </View>
          </>
        )}
      </ScrollView>

      <Modal animationType="slide" transparent visible={editing} onRequestClose={() => setEditing(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar perfil</Text>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              placeholder="Nome"
              placeholderTextColor={BrandColors.placeholderGray}
              style={styles.input}
            />
            <TextInput
              value={bioDraft}
              onChangeText={setBioDraft}
              placeholder="Bio"
              placeholderTextColor={BrandColors.placeholderGray}
              style={[styles.input, styles.inputBio]}
              multiline
            />
            <View style={styles.modalActions}>
              <Button style={styles.cancelButton} onPress={() => setEditing(false)}>
                <ButtonText style={styles.cancelText}>Cancelar</ButtonText>
              </Button>
              <Button style={styles.saveButton} onPress={handleSave} disabled={saving}>
                <ButtonText style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar'}</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.darkGray,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  banner: {
    height: 140,
    marginHorizontal: 24,
    marginBottom: -40,
    borderRadius: 24,
    backgroundColor: BrandColors.mediumGray,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerOverlay: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bannerText: {
    color: BrandColors.white,
    fontSize: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  nameSection: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    color: BrandColors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  editIcon: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,69,0,0.15)',
  },
  bioPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  bioText: {
    color: BrandColors.lightGray,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idText: {
    color: BrandColors.lightGray,
    fontSize: 11,
  },
  tabContent: {
    marginHorizontal: 24,
    padding: 32,
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
  },
  tabContentText: {
    color: BrandColors.lightGray,
  },
  skeletonCard: {
    height: 280,
    marginHorizontal: 24,
    borderRadius: 24,
    backgroundColor: BrandColors.mediumGray,
  },
  errorState: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 24,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: BrandColors.lightGray,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: BrandColors.orange,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  retryText: {
    color: BrandColors.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: BrandColors.darkGray,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    color: BrandColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: BrandColors.white,
  },
  inputBio: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BrandColors.lightGray,
  },
  cancelText: {
    color: BrandColors.lightGray,
  },
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: BrandColors.orange,
  },
  saveText: {
    color: BrandColors.white,
    fontWeight: '600',
  },
});
