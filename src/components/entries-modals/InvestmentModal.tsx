import React from 'react';

import type { InvestmentType } from '../../domain/planner/planner-types';
import { ChoiceChip } from '../ui/ChoiceChip';
import { TextField } from '../ui/TextField';
import { ModalBase } from '../ui/ModalBase';
import { Text, View } from '../ui/NativePrimitives';

type InvestmentModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  title: string;
  amount: string;
  investmentType: InvestmentType;
  onTitleChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onInvestmentTypeChange: (type: InvestmentType) => void;
  onSubmit: () => void;
};

export function InvestmentModal({
  isVisible,
  onClose,
  isLoading,
  title,
  amount,
  investmentType,
  onTitleChange,
  onAmountChange,
  onInvestmentTypeChange,
  onSubmit,
}: InvestmentModalProps) {
  return (
    <ModalBase
      isVisible={isVisible}
      title="Adicionar reserva ou investimento"
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Adicionar item"
      isLoading={isLoading}>
      <TextField
        label="Nome"
        onChangeText={onTitleChange}
        placeholder="Reserva, investimento"
        value={title}
      />
      <TextField
        keyboardType="numeric"
        label="Valor"
        onChangeText={onAmountChange}
        placeholder="300"
        prefix="R$"
        value={amount}
      />
      <View>
        <Text className="text-content-subtle mb-2 text-[11px] font-semibold tracking-[1.2px] uppercase">
          Tipo
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <ChoiceChip
            isSelected={investmentType === 'reserve'}
            label="Reserva"
            onPress={() => onInvestmentTypeChange('reserve')}
          />
          <ChoiceChip
            isSelected={investmentType === 'investment'}
            label="Investimento"
            onPress={() => onInvestmentTypeChange('investment')}
          />
        </View>
      </View>
    </ModalBase>
  );
}
