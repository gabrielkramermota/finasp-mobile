import React from 'react';

import { View } from '../ui/NativePrimitives';
import { cn } from '../../utils/cn';

type ProgressBarProps = {
  className?: string;
  tone?: 'brand' | 'expense' | 'income';
  value: number;
};

export function ProgressBar({ className, tone = 'brand', value }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, 100));

  return (
    <View className={cn('bg-background h-2 overflow-hidden rounded-full', className)}>
      <View
        className={cn(
          'h-full rounded-full',
          tone === 'brand' && 'bg-brand',
          tone === 'expense' && 'bg-expense',
          tone === 'income' && 'bg-income'
        )}
        style={{ width: `${safeValue}%` }}
      />
    </View>
  );
}
