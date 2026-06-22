import React from 'react';
import { Database } from 'lucide-react-native';

import { Text, View } from '../ui/NativePrimitives';
import { SettingsCountCard } from './SettingsCountCard';

type SettingsCountsSectionProps = {
  counts: {
    incomeItems: number;
    fixedExpenseItems: number;
    installmentItems: number;
    investmentItems: number;
    monthlyExpenseItems: number;
    personPaymentItems: number;
  };
};

export function SettingsCountsSection({ counts }: SettingsCountsSectionProps) {
  return (
    <View className="border-border-subtle bg-surface rounded-[16px] border px-4 py-4">
      <View className="mb-3 flex-row items-center gap-3">
        <View className="bg-brand-soft h-9 w-9 items-center justify-center rounded-[12px]">
          <Database color="#5eead4" size={18} strokeWidth={2.5} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-content-primary text-base font-black tracking-tight">
            Dados salvos
          </Text>
          <Text className="text-content-muted mt-1 text-xs">Registros neste aparelho.</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2">
        <SettingsCountCard label="Entradas" value={counts.incomeItems} />
        <SettingsCountCard label="Fixas" value={counts.fixedExpenseItems} />
        <SettingsCountCard label="Gastos" value={counts.monthlyExpenseItems} />
        <SettingsCountCard label="Parcelas" value={counts.installmentItems} />
        <SettingsCountCard label="Pessoas" value={counts.personPaymentItems} />
        <SettingsCountCard label="Invest." value={counts.investmentItems} />
      </View>
    </View>
  );
}
