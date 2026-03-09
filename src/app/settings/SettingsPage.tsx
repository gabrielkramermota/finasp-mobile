import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';

import { BrandMark } from '../../components/branding/BrandMark';
import { AppInfoSection } from '../../components/settings/AppInfoSection';
import { BackupSettingsSection } from '../../components/settings/BackupSettingsSection';
import { DatabaseResetSection } from '../../components/settings/DatabaseResetSection';
import { ProfileSettingsSection } from '../../components/settings/ProfileSettingsSection';
import { SettingsCountsSection } from '../../components/settings/SettingsCountsSection';
import { ScrollView, Text, View } from '../../components/ui/NativePrimitives';
import { exportPlannerBackup } from '../../service/planner/planner-backup';
import { useToast } from '../../components/ui/ToastProvider';
import {
  resetPlannerDatabase,
  usePlannerSettingsData,
} from '../../service/planner/planner-repository';
import { saveUserProfile, useUserProfile } from '../../service/user/user-repository';
import { clearStoredProfilePhoto, storeProfilePhoto } from '../../storage/profile/profile-photo';

export function SettingsPage() {
  const { counts, error } = usePlannerSettingsData();
  const { profile } = useUserProfile();
  const { showToast } = useToast();
  const [draftName, setDraftName] = useState('');
  const [draftPhotoUri, setDraftPhotoUri] = useState<string | null>(null);
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setDraftName(profile?.name ?? '');
    setDraftPhotoUri(profile?.photoUri ?? null);
  }, [profile?.updatedAt, profile?.name, profile?.photoUri]);

  const hasProfileChanges =
    draftName.trim() !== (profile?.name ?? '') || draftPhotoUri !== (profile?.photoUri ?? null);

  async function handlePickPhoto() {
    setIsPickingPhoto(true);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showToast({
          message: 'Libere o acesso as fotos para trocar sua imagem.',
          tone: 'error',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setDraftPhotoUri(result.assets[0].uri);
      showToast({
        message: 'Foto escolhida. Toque em salvar para concluir.',
        tone: 'success',
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error ? caughtError.message : 'Nao foi possivel escolher a foto.',
        tone: 'error',
      });
    } finally {
      setIsPickingPhoto(false);
    }
  }

  async function handleSaveProfile() {
    const trimmedName = draftName.trim();

    if (!trimmedName) {
      showToast({
        message: 'Digite seu nome para salvar.',
        tone: 'error',
      });
      return;
    }

    if (!hasProfileChanges) {
      showToast({
        message: 'Nada mudou por aqui.',
      });
      return;
    }

    setIsSavingProfile(true);

    try {
      let photoUriToSave = profile?.photoUri ?? null;

      if (!draftPhotoUri) {
        clearStoredProfilePhoto();
        photoUriToSave = null;
      } else if (draftPhotoUri !== profile?.photoUri) {
        photoUriToSave = storeProfilePhoto(draftPhotoUri);
      } else {
        photoUriToSave = draftPhotoUri;
      }

      await saveUserProfile({
        name: trimmedName,
        photoUri: photoUriToSave,
      });

      showToast({
        message: 'Perfil salvo com sucesso.',
        tone: 'success',
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error ? caughtError.message : 'Nao foi possivel salvar o perfil.',
        tone: 'error',
      });
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleExportBackup() {
    setIsExportingBackup(true);

    try {
      const result = await exportPlannerBackup();

      showToast({
        message: result.shared
          ? 'Backup pronto. Escolha onde quer salvar ou compartilhar.'
          : `Backup salvo em ${result.fileName}.`,
        tone: 'success',
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error
            ? caughtError.message
            : 'Nao foi possivel exportar o backup.',
        tone: 'error',
      });
    } finally {
      setIsExportingBackup(false);
    }
  }

  async function handleResetDatabase() {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      showToast({
        duration: 4200,
        message: 'Toque de novo para confirmar a exclusao dos dados.',
      });
      return;
    }

    setIsResetting(true);

    try {
      await resetPlannerDatabase();
      setIsConfirmingReset(false);
      showToast({
        message: 'Seus dados foram apagados deste aparelho.',
        tone: 'success',
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error ? caughtError.message : 'Nao foi possivel apagar os dados.',
        tone: 'error',
      });
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-4 px-5 pt-6 pb-8">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-brand-200 text-[11px] font-semibold tracking-[1.6px] uppercase">
              Configuracoes
            </Text>
            <Text className="text-content-primary mt-3 text-[32px] font-black tracking-tight">
              Seu app
            </Text>
            <Text className="text-content-secondary mt-3 max-w-[240px] text-base leading-7">
              Aqui voce muda seu perfil, salva um backup e apaga os dados se precisar.
            </Text>
          </View>
          <BrandMark imageClassName="h-[72px] w-[72px] rounded-[16px]" />
        </View>

        <AppInfoSection />

        <ProfileSettingsSection
          draftName={draftName}
          draftPhotoUri={draftPhotoUri}
          hasProfileChanges={hasProfileChanges}
          isPickingPhoto={isPickingPhoto}
          isSavingProfile={isSavingProfile}
          onChangeDraftName={setDraftName}
          onPickPhoto={handlePickPhoto}
          onRemovePhoto={() => setDraftPhotoUri(null)}
          onSaveProfile={handleSaveProfile}
        />

        <SettingsCountsSection counts={counts} />

        <BackupSettingsSection
          isExporting={isExportingBackup}
          onExportBackup={handleExportBackup}
        />

        <DatabaseResetSection
          errorMessage={error?.message}
          isConfirmingReset={isConfirmingReset}
          isResetting={isResetting}
          onCancelReset={() => setIsConfirmingReset(false)}
          onResetDatabase={handleResetDatabase}
        />
      </View>
    </ScrollView>
  );
}
