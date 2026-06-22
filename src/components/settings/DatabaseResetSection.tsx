import React from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react-native';

import { ActivityIndicator, Pressable, Text, View } from '../ui/NativePrimitives';
import { cn } from '../../utils/cn';

type DatabaseResetSectionProps = {
  errorMessage?: string;
  isConfirmingReset: boolean;
  isResetting: boolean;
  onCancelReset: () => void;
  onResetDatabase: () => void;
};

export function DatabaseResetSection({
  errorMessage,
  isConfirmingReset,
  isResetting,
  onCancelReset,
  onResetDatabase,
}: DatabaseResetSectionProps) {
  return (
    <View className="border-expense/25 bg-expense-soft rounded-[18px] border px-4 py-4">
      <View className="mb-4 flex-row items-center gap-3">
        <View className="bg-expense/20 h-10 w-10 items-center justify-center rounded-[14px]">
          <AlertTriangle color="#fb7185" size={21} strokeWidth={2.5} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-content-primary text-lg font-black tracking-tight">
            Zona de cuidado
          </Text>
          <Text className="text-content-muted mt-1 text-sm">Acoes que alteram seus dados.</Text>
        </View>
      </View>

      <View className="gap-4">
        <View className="border-expense/25 bg-background rounded-[14px] border px-4 py-4">
          <Text className="text-expense text-[10px] font-semibold tracking-[1.2px] uppercase">
            Apagar dados
          </Text>
          <Text className="text-content-secondary mt-2 text-sm leading-6">
            Isso apaga seus lancamentos deste aparelho. Seu perfil continua salvo.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className={cn(
            'flex-row items-center justify-center gap-2 rounded-[14px] px-5 py-4',
            isConfirmingReset ? 'bg-expense' : 'bg-brand',
            isResetting && 'bg-surface-strong opacity-60'
          )}
          disabled={isResetting}
          onPress={onResetDatabase}>
          {isResetting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Trash2 color="#ffffff" size={18} strokeWidth={2.5} />
              <Text className="text-brand-contrast text-sm font-black tracking-[1.2px] uppercase">
                {isConfirmingReset ? 'Confirmar exclusao' : 'Apagar dados do app'}
              </Text>
            </>
          )}
        </Pressable>

        {isConfirmingReset ? (
          <Pressable
            accessibilityRole="button"
            className="border-border-subtle bg-background items-center justify-center rounded-[14px] border px-5 py-4"
            disabled={isResetting}
            onPress={onCancelReset}>
            <View className="flex-row items-center gap-2">
              <RotateCcw color="#d4d4d8" size={17} strokeWidth={2.4} />
              <Text className="text-content-secondary text-sm font-semibold tracking-[1.2px] uppercase">
                Cancelar
              </Text>
            </View>
          </Pressable>
        ) : null}

        {errorMessage ? (
          <Text className="text-expense text-sm leading-6">{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
}
