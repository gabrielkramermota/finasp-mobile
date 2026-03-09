import React from 'react';

import { PlannerSectionCard } from '../planner/PlannerSectionCard';
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
    <PlannerSectionCard title="Seu perfil">
      <View className="gap-4 py-2">
        <View className="items-center">
          <ProfileAvatar name={draftName || 'Finasp'} photoUri={draftPhotoUri} size="lg" />
        </View>

        <TextField
          label="Nome"
          onChangeText={onChangeDraftName}
          placeholder="Seu nome"
          value={draftName}
        />

        <Text className="text-content-secondary text-sm leading-6">
          Seu nome e sua foto ficam salvos neste aparelho. Voce pode trocar quando quiser.
        </Text>

        <View className="gap-3">
          <Pressable
            accessibilityRole="button"
            className={cn(
              'border-border-subtle bg-background items-center justify-center rounded-[12px] border px-5 py-4',
              (isPickingPhoto || isSavingProfile) && 'opacity-60'
            )}
            disabled={isPickingPhoto || isSavingProfile}
            onPress={onPickPhoto}>
            <Text className="text-content-secondary text-sm font-semibold tracking-[1.2px] uppercase">
              {isPickingPhoto ? 'Selecionando foto...' : 'Trocar foto'}
            </Text>
          </Pressable>

          {draftPhotoUri ? (
            <Pressable
              accessibilityRole="button"
              className="items-center justify-center rounded-[12px] px-5 py-3"
              disabled={isSavingProfile}
              onPress={onRemovePhoto}>
              <Text className="text-content-muted text-sm font-semibold">Remover foto</Text>
            </Pressable>
          ) : null}
        </View>

        <PrimaryButton
          className={cn(!hasProfileChanges && 'opacity-80')}
          disabled={isSavingProfile}
          onPress={onSaveProfile}
          title={isSavingProfile ? 'Salvando...' : 'Salvar perfil'}
        />
      </View>
    </PlannerSectionCard>
  );
}
