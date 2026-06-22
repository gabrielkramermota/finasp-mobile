import React from 'react';

import type { MonthKey } from '../../domain/finance/finance-types';
import type { IncomeSourceType } from '../../domain/planner/planner-types';
import { ChoiceChip } from '../ui/ChoiceChip';
import { TextField } from '../ui/TextField';
import { ModalBase } from '../ui/ModalBase';
import { Text, View } from '../ui/NativePrimitives';

type IncomeModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  title: string;
  amount: string;
  sourceType: IncomeSourceType;
  onTitleChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onSourceTypeChange: (type: IncomeSourceType) => void;
  onSubmit: () => void;
};

export function IncomeModal({
  isVisible,
  onClose,
  isLoading,
  title,
  amount,
  sourceType,
  onTitleChange,
  onAmountChange,
  onSourceTypeChange,
  onSubmit,
}: IncomeModalProps) {
  return (
    <ModalBase
      isVisible={isVisible}
      title="Adicionar renda"
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Adicionar renda"
      isLoading={isLoading}>
      <TextField
        label="Nome"
        onChangeText={onTitleChange}
        placeholder="Trabalho, extra, dividendos"
        value={title}
      />
      <TextField
        keyboardType="numeric"
        label="Valor"
        onChangeText={onAmountChange}
        placeholder="3500"
        prefix="R$"
        value={amount}
      />
      <View>
        <Text className="text-content-subtle mb-2 text-[11px] font-semibold tracking-[1.2px] uppercase">
          Tipo
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <ChoiceChip
            isSelected={sourceType === 'salary'}
            label="Salario"
            onPress={() => onSourceTypeChange('salary')}
          />
          <ChoiceChip
            isSelected={sourceType === 'extra'}
            label="Extra"
            onPress={() => onSourceTypeChange('extra')}
          />
          <ChoiceChip
            isSelected={sourceType === 'dividend'}
            label="Dividendos"
            onPress={() => onSourceTypeChange('dividend')}
          />
          <ChoiceChip
            isSelected={sourceType === 'other'}
            label="Outro"
            onPress={() => onSourceTypeChange('other')}
          />
        </View>
      </View>
    </ModalBase>
  );
}
