import React from 'react';

import { cn } from '../../utils/cn';
import { Pressable, Text } from './NativePrimitives';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

export function PrimaryButton({ title, onPress, disabled = false, className }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'bg-brand items-center justify-center rounded-xl px-5 py-4',
        disabled && 'bg-surface-strong opacity-60',
        className
      )}
      disabled={disabled}
      onPress={onPress}>
      <Text className="text-brand-contrast text-[13px] font-black tracking-[1.1px] uppercase">
        {title}
      </Text>
    </Pressable>
  );
}
