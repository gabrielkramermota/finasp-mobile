import React from 'react';

import { Text, View } from '../ui/NativePrimitives';
import { cn } from '../../utils/cn';

type SummaryMetricCardProps = {
  description: string;
  title: string;
  tone?: 'brand' | 'expense' | 'income' | 'neutral';
  value: string;
};

export function SummaryMetricCard({
  description,
  title,
  tone = 'neutral',
  value,
}: SummaryMetricCardProps) {
  return (
    <View className="border-border-subtle bg-surface w-full rounded-[16px] border px-4 py-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
            {title}
          </Text>
          <Text className="text-content-secondary mt-2 text-sm leading-6">{description}</Text>
        </View>
        <Text
          className={cn(
            'max-w-[150px] text-right text-xl font-black tracking-tight',
            tone === 'brand' && 'text-brand-200',
            tone === 'expense' && 'text-expense',
            tone === 'income' && 'text-income',
            tone === 'neutral' && 'text-content-primary'
          )}>
          {value}
        </Text>
      </View>
    </View>
  );
}
