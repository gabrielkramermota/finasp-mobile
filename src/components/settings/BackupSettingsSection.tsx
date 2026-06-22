import React from 'react';
import { Download, FileJson } from 'lucide-react-native';

import { Text, View } from '../ui/NativePrimitives';
import { PrimaryButton } from '../ui/PrimaryButton';

type BackupSettingsSectionProps = {
  isExporting: boolean;
  onExportBackup: () => void;
};

export function BackupSettingsSection({ isExporting, onExportBackup }: BackupSettingsSectionProps) {
  return (
    <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
      <View className="mb-4 flex-row items-center gap-3">
        <View className="bg-brand-soft h-10 w-10 items-center justify-center rounded-[14px]">
          <Download color="#60a5fa" size={20} strokeWidth={2.5} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-content-primary text-lg font-black tracking-tight">Backup</Text>
          <Text className="text-content-muted mt-1 text-sm">Exporte uma copia dos dados.</Text>
        </View>
      </View>

      <View className="gap-4">
        <View className="border-border-subtle bg-background flex-row items-center gap-3 rounded-[14px] border px-4 py-4">
          <FileJson color="#a1a1aa" size={20} strokeWidth={2.4} />
          <Text className="text-content-secondary flex-1 text-sm leading-6">
            Salve um arquivo JSON para guardar ou compartilhar.
          </Text>
        </View>

        <PrimaryButton
          disabled={isExporting}
          onPress={onExportBackup}
          title={isExporting ? 'Preparando backup...' : 'Exportar backup'}
        />
      </View>
    </View>
  );
}
