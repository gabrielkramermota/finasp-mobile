import React from 'react';

import { cn } from '../../utils/cn';
import { Pressable, Text } from './NativePrimitives';

type ChoiceChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export function ChoiceChip({ label, isSelected, onPress }: ChoiceChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'rounded-[12px] border px-4 py-2.5',
        isSelected ? 'border-brand bg-brand-soft' : 'border-border-subtle bg-background'
      )}
      onPress={onPress}>
      <Text
        className={cn(
          'text-[12px] font-semibold tracking-[1.2px] uppercase',
          isSelected ? 'text-brand-200' : 'text-content-muted'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}
