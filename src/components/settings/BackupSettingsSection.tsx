import React from 'react';

import { PlannerSectionCard } from '../planner/PlannerSectionCard';
import { Text, View } from '../ui/NativePrimitives';
import { PrimaryButton } from '../ui/PrimaryButton';

type BackupSettingsSectionProps = {
  isExporting: boolean;
  onExportBackup: () => void;
};

export function BackupSettingsSection({ isExporting, onExportBackup }: BackupSettingsSectionProps) {
  return (
    <PlannerSectionCard title="Backup">
      <View className="gap-4 py-2">
        <Text className="text-content-secondary text-sm leading-6">
          Salve uma copia dos seus dados para guardar ou compartilhar.
        </Text>

        <PrimaryButton
          disabled={isExporting}
          onPress={onExportBackup}
          title={isExporting ? 'Preparando backup...' : 'Exportar backup'}
        />
      </View>
    </PlannerSectionCard>
  );
}
