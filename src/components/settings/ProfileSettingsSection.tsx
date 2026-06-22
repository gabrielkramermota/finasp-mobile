import React from 'react';
import { Camera, Save, UserRound, X } from 'lucide-react-native';

import { ProfileAvatar } from '../profile/ProfileAvatar';
import { Pressable, Text, View } from '../ui/NativePrimitives';
import { PrimaryButton } from '../ui/PrimaryButton';
import { TextField } from '../ui/TextField';
import { cn } from '../../utils/cn';

type ProfileSettingsSectionProps = {
  draftName: string;
  draftPhotoUri: string | null;
  hasProfileChanges: boolean;
  isPickingPhoto: boolean;
  isSavingProfile: boolean;
  onChangeDraftName: (value: string) => void;
  onPickPhoto: () => void;
  onRemovePhoto: () => void;
  onSaveProfile: () => void;
};

export function ProfileSettingsSection({
  draftName,
  draftPhotoUri,
  hasProfileChanges,
  isPickingPhoto,
  isSavingProfile,
  onChangeDraftName,
  onPickPhoto,
  onRemovePhoto,
  onSaveProfile,
}: ProfileSettingsSectionProps) {
  return (
    <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
      <View className="mb-4 flex-row items-center gap-3">
        <View className="bg-brand-soft h-10 w-10 items-center justify-center rounded-[14px]">
          <UserRound color="#60a5fa" size={20} strokeWidth={2.5} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-content-primary text-lg font-black tracking-tight">Perfil</Text>
          <Text className="text-content-muted mt-1 text-sm">Nome e foto do usuario local.</Text>
        </View>
      </View>

      <View className="gap-4">
        <View className="border-border-subtle bg-background flex-row items-center gap-4 rounded-[16px] border px-4 py-4">
          <ProfileAvatar name={draftName || 'Finasp'} photoUri={draftPhotoUri} size="lg" />
          <View className="min-w-0 flex-1 gap-3">
            <TextField
              label="Nome"
              onChangeText={onChangeDraftName}
              placeholder="Seu nome"
              value={draftName}
            />
          </View>
        </View>

        <Text className="text-content-secondary text-sm leading-6">
          Seu nome e sua foto ficam salvos neste aparelho. Voce pode trocar quando quiser.
        </Text>

        <View className="gap-3">
          <Pressable
            accessibilityRole="button"
            className={cn(
              'border-border-subtle bg-background flex-row items-center justify-center gap-2 rounded-[12px] border px-5 py-4',
              (isPickingPhoto || isSavingProfile) && 'opacity-60'
            )}
            disabled={isPickingPhoto || isSavingProfile}
            onPress={onPickPhoto}>
            <Camera color="#d4d4d8" size={18} strokeWidth={2.4} />
            <Text className="text-content-secondary text-sm font-semibold tracking-[1.2px] uppercase">
              {isPickingPhoto ? 'Selecionando foto...' : 'Trocar foto'}
            </Text>
          </Pressable>

          {draftPhotoUri ? (
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center justify-center gap-2 rounded-[12px] px-5 py-3"
              disabled={isSavingProfile}
              onPress={onRemovePhoto}>
              <X color="#a1a1aa" size={17} strokeWidth={2.4} />
              <Text className="text-content-muted text-sm font-semibold">Remover foto</Text>
            </Pressable>
          ) : null}
        </View>

        <View className="relative">
          <PrimaryButton
            className={cn(!hasProfileChanges && 'opacity-80')}
            disabled={isSavingProfile}
            onPress={onSaveProfile}
            title={isSavingProfile ? 'Salvando...' : 'Salvar perfil'}
          />
          <View className="pointer-events-none absolute top-0 left-5 h-full justify-center">
            <Save color="#ffffff" size={18} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </View>
  );
}
