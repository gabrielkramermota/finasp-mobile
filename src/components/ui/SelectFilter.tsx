import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from './NativePrimitives';
import { cn } from '../../utils/cn';

export type SelectFilterOption<Key extends string = string> = {
  key: Key;
  label: string;
};

type SelectFilterProps<Key extends string> = {
  options: SelectFilterOption<Key>[];
  selectedKey: Key;
  onSelect: (key: Key) => void;
  label?: string;
};

export function SelectFilter<Key extends string>({
  options,
  selectedKey,
  onSelect,
  label = 'Filtro',
}: SelectFilterProps<Key>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.key === selectedKey);

  const handleSelect = (key: Key) => {
    onSelect(key);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        className="border-border-subtle bg-surface active:bg-surface-strong flex-row items-center justify-between rounded-[14px] border px-4 py-3">
        <View>
          <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
            {label}
          </Text>
          <Text className="text-content-primary mt-1 text-base font-black tracking-tight">
            {selectedOption?.label || 'Selecione'}
          </Text>
        </View>
        <Text className="text-brand text-lg font-black">›</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setIsOpen(false)} />
        <View className="bg-background max-h-[60%] rounded-t-3xl px-6 py-6">
          <Text className="text-content-primary mb-4 text-xl font-black tracking-tight">
            Selecione o filtro
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
            <View className="gap-2">
              {options.map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => handleSelect(option.key)}
                  className={cn(
                    'flex-row items-center rounded-xl border-2 px-4 py-3.5',
                    selectedKey === option.key
                      ? 'border-brand bg-brand/10'
                      : 'border-border-subtle bg-surface'
                  )}>
                  <View className="flex-1">
                    <Text
                      className={cn(
                        'text-sm font-black tracking-tight',
                        selectedKey === option.key ? 'text-brand' : 'text-content-primary'
                      )}>
                      {option.label}
                    </Text>
                  </View>
                  {selectedKey === option.key && (
                    <Text className="text-brand text-lg font-black">✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Pressable
            onPress={() => setIsOpen(false)}
            className="bg-brand items-center justify-center rounded-xl px-5 py-4">
            <Text className="text-brand-contrast text-[13px] font-black tracking-[1.1px] uppercase">
              Fechar
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}
