import React from 'react';

import type { MonthKey } from '../../domain/finance/finance-types';
import { Pressable, Text, View } from '../ui/NativePrimitives';
import { ChoiceChip } from '../ui/ChoiceChip';
import { cn } from '../../utils/cn';
import {
  formatMonthKeyLabel,
  getMonthKey,
  isCurrentMonthKey,
  shiftMonthKey,
} from '../../utils/formatters';

type MonthNavigatorProps = {
  selectedMonth: MonthKey;
  onChangeMonth: (month: MonthKey) => void;
};

function MonthStepButton({
  direction,
  onPress,
}: {
  direction: 'next' | 'previous';
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="border-border-subtle bg-surface items-center justify-center rounded-[12px] border px-4 py-3"
      onPress={onPress}>
      <Text className="text-content-primary text-sm font-black">
        {direction === 'previous' ? '<' : '>'}
      </Text>
    </Pressable>
  );
}

export function MonthNavigator({ selectedMonth, onChangeMonth }: MonthNavigatorProps) {
  const isCurrentMonth = isCurrentMonthKey(selectedMonth);

  return (
    <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
      <View className="flex-row items-center justify-between gap-3">
        <MonthStepButton
          direction="previous"
          onPress={() => onChangeMonth(shiftMonthKey(selectedMonth, -1))}
        />

        <View className="flex-1 items-center px-2">
          <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
            Mes selecionado
          </Text>
          <Text className="text-content-primary mt-2 text-lg font-black tracking-tight">
            {formatMonthKeyLabel(selectedMonth)}
          </Text>
        </View>

        <MonthStepButton
          direction="next"
          onPress={() => onChangeMonth(shiftMonthKey(selectedMonth, 1))}
        />
      </View>

      <View className={cn('mt-4 flex-row justify-center', isCurrentMonth ? 'opacity-60' : '')}>
        <ChoiceChip
          isSelected={isCurrentMonth}
          label="Mes atual"
          onPress={() => onChangeMonth(getMonthKey())}
        />
      </View>
    </View>
  );
}
