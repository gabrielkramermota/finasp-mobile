import React from 'react';

import { TextField } from '../ui/TextField';
import { ModalBase } from '../ui/ModalBase';

type PersonPaymentModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  name: string;
  amount: string;
  dueDay: string;
  description: string;
  onNameChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onDueDayChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onSubmit: () => void;
};

export function PersonPaymentModal({
  isVisible,
  onClose,
  isLoading,
  name,
  amount,
  dueDay,
  description,
  onNameChange,
  onAmountChange,
  onDueDayChange,
  onDescriptionChange,
  onSubmit,
}: PersonPaymentModalProps) {
  return (
    <ModalBase
      isVisible={isVisible}
      title="Adicionar pessoa a pagar"
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Adicionar pessoa"
      isLoading={isLoading}>
      <TextField
        label="Pessoa"
        onChangeText={onNameChange}
        placeholder="Nome da pessoa"
        value={name}
      />
      <TextField
        keyboardType="numeric"
        label="Valor"
        onChangeText={onAmountChange}
        placeholder="250"
        prefix="R$"
        value={amount}
      />
      <TextField
        keyboardType="numeric"
        label="Dia de pagamento"
        onChangeText={onDueDayChange}
        placeholder="15"
        value={dueDay}
      />
      <TextField
        label="Descrição opcional"
        multiline
        onChangeText={onDescriptionChange}
        placeholder="Serviço, combinado ou observação"
        value={description}
      />
    </ModalBase>
  );
}
