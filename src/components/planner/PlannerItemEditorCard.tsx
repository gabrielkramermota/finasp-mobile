import React, { useEffect, useState } from 'react';

import type {
  FixedExpenseItem,
  IncomeItem,
  IncomeSourceType,
  InstallmentItem,
  InvestmentItem,
  InvestmentType,
  MonthlyExpenseItem,
  PersonPaymentItem,
} from '../../domain/planner/planner-types';
import { cn } from '../../utils/cn';
import { ChoiceChip } from '../ui/ChoiceChip';
import { Pressable, Text, View } from '../ui/NativePrimitives';
import { PrimaryButton } from '../ui/PrimaryButton';
import { TextField } from '../ui/TextField';
import { PlannerSectionCard } from './PlannerSectionCard';

export type EditablePlannerItem =
  | { section: 'income'; item: IncomeItem }
  | { section: 'fixed-expense'; item: FixedExpenseItem }
  | { section: 'installment'; item: InstallmentItem }
  | { section: 'investment'; item: InvestmentItem }
  | { section: 'monthly-expense'; item: MonthlyExpenseItem }
  | { section: 'person-payment'; item: PersonPaymentItem };

export type PlannerItemEditorSavePayload =
  | {
      section: 'income';
      id: string;
      title: string;
      amount: number;
      sourceType: IncomeSourceType;
    }
  | {
      section: 'fixed-expense';
      id: string;
      title: string;
      amount: number;
    }
  | {
      section: 'installment';
      id: string;
      title: string;
      amount: number;
      dueDay: number;
      referenceLabel?: string;
      totalInstallments: number;
    }
  | {
      section: 'investment';
      id: string;
      title: string;
      amount: number;
      investmentType: InvestmentType;
    }
  | {
      section: 'monthly-expense';
      id: string;
      title: string;
      amount: number;
    }
  | {
      section: 'person-payment';
      id: string;
      personName: string;
      amount: number;
      dueDay: number;
      description?: string;
    };

type PlannerItemEditorCardProps = {
  editingItem: EditablePlannerItem;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (payload: PlannerItemEditorSavePayload) => void;
  onValidationError: (message: string) => void;
};

function parseAmount(value: string) {
  return Number(value.replace(',', '.'));
}

function parseInteger(value: string) {
  return Number.parseInt(value, 10);
}

function formatAmount(value: number) {
  return Number.isInteger(value) ? String(value) : String(value).replace('.', ',');
}

function getEditorTitle(section: EditablePlannerItem['section']) {
  if (section === 'income') {
    return 'Editar renda';
  }

  if (section === 'fixed-expense') {
    return 'Editar despesa fixa';
  }

  if (section === 'installment') {
    return 'Editar parcela';
  }

  if (section === 'investment') {
    return 'Editar investimento';
  }

  if (section === 'monthly-expense') {
    return 'Editar gasto do mes';
  }

  return 'Editar pessoa a pagar';
}

export function PlannerItemEditorCard({
  editingItem,
  isSaving,
  onCancel,
  onSave,
  onValidationError,
}: PlannerItemEditorCardProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [incomeSourceType, setIncomeSourceType] = useState<IncomeSourceType>('salary');
  const [installmentDueDay, setInstallmentDueDay] = useState('');
  const [installmentReference, setInstallmentReference] = useState('');
  const [installmentTotalCount, setInstallmentTotalCount] = useState('');
  const [investmentType, setInvestmentType] = useState<InvestmentType>('reserve');
  const [personName, setPersonName] = useState('');
  const [personPaymentDueDay, setPersonPaymentDueDay] = useState('');
  const [personDescription, setPersonDescription] = useState('');

  useEffect(() => {
    if (editingItem.section === 'income') {
      setTitle(editingItem.item.title);
      setAmount(formatAmount(editingItem.item.amount));
      setIncomeSourceType(editingItem.item.sourceType);
      return;
    }

    if (editingItem.section === 'fixed-expense') {
      setTitle(editingItem.item.title);
      setAmount(formatAmount(editingItem.item.amount));
      return;
    }

    if (editingItem.section === 'installment') {
      setTitle(editingItem.item.title);
      setAmount(formatAmount(editingItem.item.amount));
      setInstallmentDueDay(String(editingItem.item.dueDay));
      setInstallmentReference(editingItem.item.referenceLabel ?? '');
      setInstallmentTotalCount(String(editingItem.item.totalInstallments));
      return;
    }

    if (editingItem.section === 'investment') {
      setTitle(editingItem.item.title);
      setAmount(formatAmount(editingItem.item.amount));
      setInvestmentType(editingItem.item.investmentType);
      return;
    }

    if (editingItem.section === 'monthly-expense') {
      setTitle(editingItem.item.title);
      setAmount(formatAmount(editingItem.item.amount));
      return;
    }

    setPersonName(editingItem.item.personName);
    setAmount(formatAmount(editingItem.item.amount));
    setPersonPaymentDueDay(String(editingItem.item.dueDay));
    setPersonDescription(editingItem.item.description ?? '');
  }, [editingItem]);

  function handleSavePress() {
    const parsedAmount = parseAmount(amount);

    if (editingItem.section === 'income') {
      if (!title.trim()) {
        onValidationError('Informe o nome da renda.');
        return;
      }

      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        onValidationError('Informe um valor valido para a renda.');
        return;
      }

      onSave({
        section: 'income',
        id: editingItem.item.id,
        title: title.trim(),
        amount: parsedAmount,
        sourceType: incomeSourceType,
      });
      return;
    }

    if (editingItem.section === 'fixed-expense') {
      if (!title.trim()) {
        onValidationError('Informe o nome da despesa fixa.');
        return;
      }

      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        onValidationError('Informe um valor valido para a despesa fixa.');
        return;
      }

      onSave({
        section: 'fixed-expense',
        id: editingItem.item.id,
        title: title.trim(),
        amount: parsedAmount,
      });
      return;
    }

    if (editingItem.section === 'installment') {
      const parsedDueDay = parseInteger(installmentDueDay);
      const parsedTotalCount = parseInteger(installmentTotalCount);

      if (!title.trim()) {
        onValidationError('Informe o nome da parcela.');
        return;
      }

      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        onValidationError('Informe um valor valido para a parcela.');
        return;
      }

      if (!parsedDueDay || Number.isNaN(parsedDueDay) || parsedDueDay < 1 || parsedDueDay > 31) {
        onValidationError('Informe um vencimento entre 1 e 31.');
        return;
      }

      if (!parsedTotalCount || Number.isNaN(parsedTotalCount) || parsedTotalCount < 1) {
        onValidationError('Informe a quantidade total de parcelas.');
        return;
      }

      if (parsedTotalCount < editingItem.item.paidInstallments) {
        onValidationError('O total nao pode ser menor que a quantidade ja paga.');
        return;
      }

      onSave({
        section: 'installment',
        id: editingItem.item.id,
        title: title.trim(),
        amount: parsedAmount,
        dueDay: parsedDueDay,
        referenceLabel: installmentReference.trim(),
        totalInstallments: parsedTotalCount,
      });
      return;
    }

    if (editingItem.section === 'investment') {
      if (!title.trim()) {
        onValidationError('Informe o nome do investimento.');
        return;
      }

      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        onValidationError('Informe um valor valido para o investimento.');
        return;
      }

      onSave({
        section: 'investment',
        id: editingItem.item.id,
        title: title.trim(),
        amount: parsedAmount,
        investmentType,
      });
      return;
    }

    if (editingItem.section === 'monthly-expense') {
      if (!title.trim()) {
        onValidationError('Informe o nome do gasto.');
        return;
      }

      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        onValidationError('Informe um valor valido para o gasto.');
        return;
      }

      onSave({
        section: 'monthly-expense',
        id: editingItem.item.id,
        title: title.trim(),
        amount: parsedAmount,
      });
      return;
    }

    const parsedDueDay = parseInteger(personPaymentDueDay);

    if (!personName.trim()) {
      onValidationError('Informe o nome da pessoa.');
      return;
    }

    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      onValidationError('Informe um valor valido para esse pagamento.');
      return;
    }

    if (!parsedDueDay || Number.isNaN(parsedDueDay) || parsedDueDay < 1 || parsedDueDay > 31) {
      onValidationError('Informe um dia entre 1 e 31.');
      return;
    }

    onSave({
      section: 'person-payment',
      id: editingItem.item.id,
      personName: personName.trim(),
      amount: parsedAmount,
      dueDay: parsedDueDay,
      description: personDescription.trim(),
    });
  }

  return (
    <PlannerSectionCard title={getEditorTitle(editingItem.section)}>
      <View className="gap-4 py-2">
        <Text className="text-content-secondary text-sm leading-6">
          Ajuste os dados e salve sem sair da lista.
        </Text>

        {editingItem.section === 'person-payment' ? (
          <>
            <TextField
              label="Pessoa"
              onChangeText={setPersonName}
              placeholder="Nome da pessoa"
              value={personName}
            />
            <TextField
              keyboardType="numeric"
              label="Valor"
              onChangeText={setAmount}
              placeholder="250"
              prefix="R$"
              value={amount}
            />
            <TextField
              keyboardType="numeric"
              label="Dia de pagamento"
              onChangeText={setPersonPaymentDueDay}
              placeholder="15"
              value={personPaymentDueDay}
            />
            <TextField
              label="Descricao"
              multiline
              onChangeText={setPersonDescription}
              placeholder="Observacao opcional"
              value={personDescription}
            />
          </>
        ) : (
          <>
            <TextField
              label="Nome"
              onChangeText={setTitle}
              placeholder="Nome do item"
              value={title}
            />
            <TextField
              keyboardType="numeric"
              label="Valor"
              onChangeText={setAmount}
              placeholder="0"
              prefix="R$"
              value={amount}
            />
          </>
        )}

        {editingItem.section === 'income' ? (
          <View>
            <Text className="text-content-subtle mb-2 text-[11px] font-semibold tracking-[1.2px] uppercase">
              Tipo
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <ChoiceChip
                isSelected={incomeSourceType === 'salary'}
                label="Salario"
                onPress={() => setIncomeSourceType('salary')}
              />
              <ChoiceChip
                isSelected={incomeSourceType === 'extra'}
                label="Extra"
                onPress={() => setIncomeSourceType('extra')}
              />
              <ChoiceChip
                isSelected={incomeSourceType === 'dividend'}
                label="Dividendos"
                onPress={() => setIncomeSourceType('dividend')}
              />
              <ChoiceChip
                isSelected={incomeSourceType === 'other'}
                label="Outro"
                onPress={() => setIncomeSourceType('other')}
              />
            </View>
          </View>
        ) : null}

        {editingItem.section === 'installment' ? (
          <>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextField
                  keyboardType="numeric"
                  label="Vencimento"
                  onChangeText={setInstallmentDueDay}
                  placeholder="10"
                  value={installmentDueDay}
                />
              </View>
              <View className="flex-1">
                <TextField
                  keyboardType="numeric"
                  label="Parcelas"
                  onChangeText={setInstallmentTotalCount}
                  placeholder="12"
                  value={installmentTotalCount}
                />
              </View>
            </View>
            <TextField
              label="Referencia"
              onChangeText={setInstallmentReference}
              placeholder="Cartao ou contrato"
              value={installmentReference}
            />
            <View className="border-border-subtle bg-background rounded-[14px] border px-4 py-4">
              <Text className="text-content-secondary text-sm leading-6">
                Ja foram pagas {String(editingItem.item.paidInstallments)} parcelas desse item.
              </Text>
            </View>
          </>
        ) : null}

        {editingItem.section === 'investment' ? (
          <View>
            <Text className="text-content-subtle mb-2 text-[11px] font-semibold tracking-[1.2px] uppercase">
              Tipo
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <ChoiceChip
                isSelected={investmentType === 'reserve'}
                label="Reserva"
                onPress={() => setInvestmentType('reserve')}
              />
              <ChoiceChip
                isSelected={investmentType === 'investment'}
                label="Investimento"
                onPress={() => setInvestmentType('investment')}
              />
            </View>
          </View>
        ) : null}

        <View className="flex-row gap-3">
          <PrimaryButton
            className="flex-1"
            disabled={isSaving}
            onPress={handleSavePress}
            title={isSaving ? 'Salvando...' : 'Salvar alteracoes'}
          />
          <Pressable
            accessibilityRole="button"
            className={cn(
              'border-border-subtle bg-background flex-1 items-center justify-center rounded-[12px] border px-5 py-4',
              isSaving && 'opacity-60'
            )}
            disabled={isSaving}
            onPress={onCancel}>
            <Text className="text-content-secondary text-sm font-semibold tracking-[1.2px] uppercase">
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    </PlannerSectionCard>
  );
}
