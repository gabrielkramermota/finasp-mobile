import React from 'react';
import { Keyboard } from 'react-native';

import { cn } from '../../utils/cn';
import { Modal, Pressable, ScrollView, Text, View } from './NativePrimitives';
import { PrimaryButton } from './PrimaryButton';

type ModalBaseProps = {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  children: React.ReactNode;
};

export function ModalBase({
  isVisible,
  title,
  onClose,
  onSubmit,
  submitLabel = 'Confirmar',
  isLoading = false,
  children,
}: ModalBaseProps) {
  const handleBackdropPress = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    onSubmit?.();
  };

  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        {/* Backdrop */}
        <Pressable className="absolute inset-0" onPress={handleBackdropPress} />

        {/* Modal Content */}
        <View className="bg-background max-h-[90%] rounded-t-[28px]">
          {/* Header */}
          <View className="border-border-subtle flex-row items-center justify-between border-b px-6 py-5">
            <Text className="text-content-primary flex-1 text-xl font-black tracking-tight">
              {title}
            </Text>
            <Pressable
              className="active:opacity-60"
              onPress={handleBackdropPress}
              accessibilityRole="button">
              <Text className="text-brand text-3xl">×</Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={false} className="px-6">
            <View className="gap-4 py-4">{children}</View>
          </ScrollView>

          {/* Footer */}
          {onSubmit && (
            <View className="border-border-subtle gap-3 border-t px-6 py-4">
              <PrimaryButton
                disabled={isLoading}
                onPress={handleSubmit}
                title={isLoading ? 'Salvando...' : submitLabel}
              />
              <Pressable
                className={cn(
                  'items-center justify-center rounded-xl px-5 py-4',
                  isLoading && 'opacity-60'
                )}
                disabled={isLoading}
                onPress={onClose}
                accessibilityRole="button">
                <Text className="text-content-secondary text-[13px] font-black tracking-[1.1px] uppercase">
                  Cancelar
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
