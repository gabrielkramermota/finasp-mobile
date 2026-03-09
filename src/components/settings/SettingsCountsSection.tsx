import React from 'react';

import { PlannerSectionCard } from '../planner/PlannerSectionCard';
import { View } from '../ui/NativePrimitives';
import { SettingsCountCard } from './SettingsCountCard';

type SettingsCountsSectionProps = {
  counts: {
    incomeItems: number;
    fixedExpenseItems: number;
    installmentItems: number;
    investmentItems: number;
    personPaymentItems: number;
  };
};

export function SettingsCountsSection({ counts }: SettingsCountsSectionProps) {
  return (
    <PlannerSectionCard title="Seus dados">
      <View className="flex-row flex-wrap gap-3 py-2">
        <SettingsCountCard label="Entradas" value={counts.incomeItems} />
        <SettingsCountCard label="Fixas" value={counts.fixedExpenseItems} />
        <SettingsCountCard label="Parcelas" value={counts.installmentItems} />
        <SettingsCountCard label="Pessoas" value={counts.personPaymentItems} />
        <SettingsCountCard label="Invest." value={counts.investmentItems} />
      </View>
    </PlannerSectionCard>
  );
}
