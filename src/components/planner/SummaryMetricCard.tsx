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
    <View className="border-border-subtle bg-surface min-w-[148px] flex-1 rounded-[18px] border px-4 py-4">
      <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
        {title}
      </Text>
      <Text
        className={cn(
          'mt-2 text-xl font-black tracking-tight',
          tone === 'brand' && 'text-brand-200',
          tone === 'expense' && 'text-expense',
          tone === 'income' && 'text-income',
          tone === 'neutral' && 'text-content-primary'
        )}>
        {value}
      </Text>
      <Text className="text-content-secondary mt-2 text-sm leading-6">{description}</Text>
    </View>
  );
}
