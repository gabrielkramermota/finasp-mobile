import React from 'react';

import { Pressable, Text, View } from '../ui/NativePrimitives';
import { cn } from '../../utils/cn';
import { ProgressBar } from './ProgressBar';

type PlannerItemRowProps = {
  title: string;
  amount: string;
  subtitle?: string;
  showBorder?: boolean;
  tone?: 'income' | 'expense' | 'neutral';
  badgeLabel?: string;
  progressPercentage?: number;
  progressTone?: 'brand' | 'expense' | 'income';
  actions?: {
    disabled?: boolean;
    label: string;
    onPress: () => void;
    tone?: 'default' | 'success' | 'danger';
  }[];
};

export function PlannerItemRow({
  title,
  amount,
  subtitle,
  showBorder = true,
  tone = 'neutral',
  badgeLabel,
  progressPercentage,
  progressTone = 'brand',
  actions,
}: PlannerItemRowProps) {
  return (
    <View className={cn('py-3', showBorder && 'border-border-subtle border-b')}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-content-primary flex-1 text-base font-semibold">{title}</Text>
            {badgeLabel ? (
              <View className="bg-background rounded-full px-2 py-1">
                <Text className="text-content-subtle text-[10px] font-semibold tracking-[1px] uppercase">
                  {badgeLabel}
                </Text>
              </View>
            ) : null}
          </View>
          {subtitle ? (
            <Text className="text-content-muted mt-1 text-sm leading-6">{subtitle}</Text>
          ) : null}
        </View>
        <Text
          className={cn(
            'text-base font-black tracking-tight',
            tone === 'income' && 'text-income',
            tone === 'expense' && 'text-expense',
            tone === 'neutral' && 'text-content-primary'
          )}>
          {amount}
        </Text>
      </View>
      {typeof progressPercentage === 'number' ? (
        <View className="pt-3">
          <ProgressBar tone={progressTone} value={progressPercentage} />
        </View>
      ) : null}
      {actions?.length ? (
        <View className="flex-row flex-wrap gap-4 pt-2">
          {actions.map((action) => (
            <Pressable
              key={`${action.label}-${action.tone ?? 'default'}`}
              accessibilityRole="button"
              className={cn(
                'border-border-subtle bg-background self-start rounded-[10px] border px-3 py-2',
                action.tone === 'success' && 'border-income/30 bg-income-soft',
                action.tone === 'danger' && 'border-expense/30 bg-expense-soft',
                action.disabled && 'opacity-60'
              )}
              disabled={action.disabled}
              onPress={action.onPress}>
              <Text
                className={cn(
                  'text-[11px] font-semibold tracking-[1.2px] uppercase',
                  action.tone === 'default' && 'text-content-subtle',
                  action.tone === 'success' && 'text-income',
                  action.tone === 'danger' && 'text-expense'
                )}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
