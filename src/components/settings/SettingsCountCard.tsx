import React from 'react';

import { Text, View } from '../ui/NativePrimitives';

type SettingsCountCardProps = {
  label: string;
  value: number;
};

export function SettingsCountCard({ label, value }: SettingsCountCardProps) {
  return (
    <View className="border-border-subtle bg-background min-w-[140px] flex-1 rounded-[14px] border px-4 py-4">
      <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
        {label}
      </Text>
      <Text className="text-content-primary mt-2 text-xl font-black tracking-tight">
        {String(value)}
      </Text>
    </View>
  );
}
