import React from 'react';

import { TextField } from '../ui/TextField';
import { ModalBase } from '../ui/ModalBase';

type MonthlyExpenseModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  title: string;
  amount: string;
  onTitleChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onSubmit: () => void;
};

export function MonthlyExpenseModal({
  isVisible,
  onClose,
  isLoading,
  title,
  amount,
  onTitleChange,
  onAmountChange,
  onSubmit,
}: MonthlyExpenseModalProps) {
  return (
    <ModalBase
      isVisible={isVisible}
      title="Adicionar gasto do mês"
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Adicionar gasto"
      isLoading={isLoading}>
      <TextField
        label="Nome"
        onChangeText={onTitleChange}
        placeholder="Hamburguer, sorvete, mercado"
        value={title}
      />
      <TextField
        keyboardType="numeric"
        label="Valor"
        onChangeText={onAmountChange}
        placeholder="20"
        prefix="R$"
        value={amount}
      />
    </ModalBase>
  );
}
