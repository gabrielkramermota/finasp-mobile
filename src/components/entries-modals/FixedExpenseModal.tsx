import React from 'react';

import { TextField } from '../ui/TextField';
import { ModalBase } from '../ui/ModalBase';

type FixedExpenseModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  title: string;
  amount: string;
  onTitleChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onSubmit: () => void;
};

export function FixedExpenseModal({
  isVisible,
  onClose,
  isLoading,
  title,
  amount,
  onTitleChange,
  onAmountChange,
  onSubmit,
}: FixedExpenseModalProps) {
  return (
    <ModalBase
      isVisible={isVisible}
      title="Adicionar despesa fixa"
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Adicionar despesa fixa"
      isLoading={isLoading}>
      <TextField
        label="Nome"
        onChangeText={onTitleChange}
        placeholder="Internet, academia, aluguel"
        value={title}
      />
      <TextField
        keyboardType="numeric"
        label="Valor"
        onChangeText={onAmountChange}
        placeholder="120"
        prefix="R$"
        value={amount}
      />
    </ModalBase>
  );
}
