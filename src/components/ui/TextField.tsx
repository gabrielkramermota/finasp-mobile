import React from 'react';

import { cn } from '../../utils/cn';
import { Text, TextInput, View } from './NativePrimitives';

type TextFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  prefix?: string;
};

export function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  prefix,
}: TextFieldProps) {
  return (
    <View>
      <Text className="text-content-subtle mb-2 text-[11px] font-semibold tracking-[1.4px] uppercase">
        {label}
      </Text>
      <View
        className={cn(
          'border-border-subtle bg-background flex-row items-center gap-3 rounded-[12px] border px-4',
          multiline ? 'py-3' : 'py-1'
        )}>
        {prefix ? (
          <Text className="text-content-muted text-sm font-semibold tracking-[0.2px]">
            {prefix}
          </Text>
        ) : null}
        <TextInput
          className={cn(
            'text-content-primary flex-1 text-[15px]',
            multiline ? 'text-top min-h-[92px] py-2' : 'py-3'
          )}
          keyboardType={keyboardType}
          multiline={multiline}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#71717a"
          textAlignVertical={multiline ? 'top' : 'center'}
          value={value}
        />
      </View>
    </View>
  );
}
