import React from 'react';

import { PlannerSectionCard } from '../planner/PlannerSectionCard';
import { ActivityIndicator, Pressable, Text, View } from '../ui/NativePrimitives';
import { cn } from '../../utils/cn';

type DatabaseResetSectionProps = {
  errorMessage?: string;
  isConfirmingReset: boolean;
  isResetting: boolean;
  onCancelReset: () => void;
  onResetDatabase: () => void;
};

export function DatabaseResetSection({
  errorMessage,
  isConfirmingReset,
  isResetting,
  onCancelReset,
  onResetDatabase,
}: DatabaseResetSectionProps) {
  return (
    <PlannerSectionCard title="Apagar dados">
      <View className="gap-4 py-2">
        <Text className="text-content-muted text-sm leading-6">
          Isso apaga seus lancamentos deste aparelho. Seu perfil continua salvo.
        </Text>

        <Pressable
          accessibilityRole="button"
          className={cn(
            'items-center justify-center rounded-[14px] px-5 py-4',
            isConfirmingReset ? 'bg-expense' : 'bg-brand',
            isResetting && 'bg-surface-strong opacity-60'
          )}
          disabled={isResetting}
          onPress={onResetDatabase}>
          {isResetting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-brand-contrast text-sm font-black tracking-[1.2px] uppercase">
              {isConfirmingReset ? 'Confirmar exclusao' : 'Apagar dados do app'}
            </Text>
          )}
        </Pressable>

        {isConfirmingReset ? (
          <Pressable
            accessibilityRole="button"
            className="border-border-subtle bg-background items-center justify-center rounded-[14px] border px-5 py-4"
            disabled={isResetting}
            onPress={onCancelReset}>
            <Text className="text-content-secondary text-sm font-semibold tracking-[1.2px] uppercase">
              Cancelar
            </Text>
          </Pressable>
        ) : null}

        {errorMessage ? (
          <Text className="text-expense text-sm leading-6">{errorMessage}</Text>
        ) : null}
      </View>
    </PlannerSectionCard>
  );
}
