import React from 'react';

import {
  getInstallmentProgressPercentage,
  getInstallmentRemainingCount,
} from '../../domain/planner/installment-progress';
import type { MonthKey } from '../../domain/finance/finance-types';
import { TextField } from '../ui/TextField';
import { ModalBase } from '../ui/ModalBase';
import { Text, View } from '../ui/NativePrimitives';
import { formatCurrencyBRL, formatPercentage } from '../../utils/formatters';

type InstallmentModalProps = {
  isVisible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  title: string;
  amount: string;
  dueDay: string;
  reference: string;
  totalCount: string;
  selectedMonth: MonthKey;
  onTitleChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onDueDayChange: (text: string) => void;
  onReferenceChange: (text: string) => void;
  onTotalCountChange: (text: string) => void;
  onSubmit: () => void;
};

function parseAmount(value: string) {
  return Number(value.replace(',', '.'));
}

function parseInteger(value: string) {
  return Number.parseInt(value, 10);
}

export function InstallmentModal({
  isVisible,
  onClose,
  isLoading,
  title,
  amount,
  dueDay,
  reference,
  totalCount,
  selectedMonth,
  onTitleChange,
  onAmountChange,
  onDueDayChange,
  onReferenceChange,
  onTotalCountChange,
  onSubmit,
}: InstallmentModalProps) {
  return (
    <ModalBase
      isVisible={isVisible}
      title="Adicionar parcela"
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel="Adicionar parcela"
      isLoading={isLoading}>
      <TextField
        label="Nome"
        onChangeText={onTitleChange}
        placeholder="Carro, iPhone, TV"
        value={title}
      />
      <TextField
        keyboardType="numeric"
        label="Valor"
        onChangeText={onAmountChange}
        placeholder="450"
        prefix="R$"
        value={amount}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <TextField
            keyboardType="numeric"
            label="Vencimento"
            onChangeText={onDueDayChange}
            placeholder="10"
            value={dueDay}
          />
        </View>
        <View className="flex-1">
          <TextField
            keyboardType="numeric"
            label="Parcelas"
            onChangeText={onTotalCountChange}
            placeholder="12"
            value={totalCount}
          />
        </View>
      </View>
      <TextField
        label="Referência"
        onChangeText={onReferenceChange}
        placeholder="Cartão ou contrato"
        value={reference}
      />
      {amount && totalCount ? (
        <View className="border-border-subtle bg-background rounded-[14px] border px-4 py-4">
          <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
            Projeção
          </Text>
          <Text className="text-content-primary mt-2 text-sm leading-6 font-semibold">
            Valor total previsto:{' '}
            {formatCurrencyBRL((parseAmount(amount) || 0) * (parseInteger(totalCount) || 0))}
          </Text>
          <Text className="text-content-secondary mt-2 text-sm leading-6">
            Restam{' '}
            {String(
              getInstallmentRemainingCount({
                id: 'preview',
                title: title || 'Parcela',
                amount: parseAmount(amount) || 0,
                competenceMonth: selectedMonth,
                createdAt: '',
                dueDay: parseInteger(dueDay) || 1,
                paidInstallments: 0,
                referenceLabel: reference || null,
                totalInstallments: parseInteger(totalCount) || 1,
                updatedAt: '',
              })
            )}{' '}
            parcelas e o progresso inicia em{' '}
            {formatPercentage(
              getInstallmentProgressPercentage({
                id: 'preview',
                title: title || 'Parcela',
                amount: parseAmount(amount) || 0,
                competenceMonth: selectedMonth,
                createdAt: '',
                dueDay: parseInteger(dueDay) || 1,
                paidInstallments: 0,
                referenceLabel: reference || null,
                totalInstallments: parseInteger(totalCount) || 1,
                updatedAt: '',
              })
            )}
            .
          </Text>
        </View>
      ) : null}
    </ModalBase>
  );
}
