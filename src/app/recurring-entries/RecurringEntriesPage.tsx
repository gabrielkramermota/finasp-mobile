import React, { useState } from 'react';

import type { MonthKey } from '../../domain/finance/finance-types';
import {
  getInstallmentCurrentNumber,
  getInstallmentPaidAmount,
  getInstallmentProgressPercentage,
  getInstallmentRemainingAmount,
  getInstallmentRemainingCount,
} from '../../domain/planner/installment-progress';
import {
  type EditablePlannerItem,
  type PlannerItemEditorSavePayload,
  PlannerItemEditorCard,
} from '../../components/planner/PlannerItemEditorCard';
import { PlannerItemRow } from '../../components/planner/PlannerItemRow';
import { PlannerSectionCard } from '../../components/planner/PlannerSectionCard';
import { ChoiceChip } from '../../components/ui/ChoiceChip';
import { ScrollView, Text, View } from '../../components/ui/NativePrimitives';
import { useToast } from '../../components/ui/ToastProvider';
import {
  advanceInstallmentPayment,
  deletePlannerItem,
  togglePersonPaymentPaidStatus,
  updateFixedExpenseItem,
  updateIncomeItem,
  updateInstallmentItem,
  updateInvestmentItem,
  updateMonthlyExpenseItem,
  updatePersonPaymentItem,
  useMonthlyPlannerData,
} from '../../service/planner/planner-repository';
import {
  matchesPlannerTypeFilter,
  plannerSortOptions,
  plannerTypeFilterOptions,
  sortPlannerItems,
  type PlannerSortMode,
  type PlannerTypeFilter,
} from '../../service/planner/planner-view';
import { formatCurrencyBRL, formatDayOfMonth, formatPercentage } from '../../utils/formatters';
import type { PlannerSectionKey } from '../../domain/planner/planner-types';
import type { PersonPaymentReminderStatus } from '../../service/notifications/payment-reminders';

type RecurringEntriesPageProps = {
  selectedMonth: MonthKey;
};

const incomeSourceCopy = {
  salary: 'Salario',
  extra: 'Renda extra',
  dividend: 'Dividendos',
  other: 'Outro',
} as const;

const investmentTypeCopy = {
  reserve: 'Reserva',
  investment: 'Investimento',
} as const;

function EmptySection({ label }: { label: string }) {
  return <Text className="text-content-muted py-3 text-sm leading-6">Nenhum item em {label}.</Text>;
}

function getInstallmentSubtitle(
  dueDay: number,
  paidAmount: string,
  remainingAmount: string,
  paidPercentage: string,
  currentInstallment: number,
  totalInstallments: number,
  remainingCount: number,
  referenceLabel?: string | null
) {
  return [
    formatDayOfMonth(dueDay),
    `Parcela ${String(currentInstallment)}/${String(totalInstallments)}`,
    `${paidPercentage} pago`,
    `Pago ${paidAmount}`,
    `Falta ${remainingAmount}`,
    `Restam ${String(remainingCount)}`,
    referenceLabel ? `Ref. ${referenceLabel}` : null,
  ]
    .filter(Boolean)
    .join(' | ');
}

function getReminderStatusMessage(status: PersonPaymentReminderStatus) {
  if (status === 'scheduled') {
    return 'Pagamento reaberto e lembrete reativado.';
  }

  if (status === 'permission-denied') {
    return 'Pagamento reaberto, mas sem permissao para notificacao.';
  }

  if (status === 'date-in-past') {
    return 'Pagamento reaberto, mas o dia desse mes ja passou.';
  }

  return 'Pagamento reaberto, mas o lembrete nao foi agendado.';
}

function getUpdatedReminderStatusMessage(status: PersonPaymentReminderStatus) {
  if (status === 'scheduled') {
    return 'Pagamento atualizado e lembrete ajustado.';
  }

  if (status === 'permission-denied') {
    return 'Pagamento atualizado, mas sem permissao para notificacao.';
  }

  if (status === 'date-in-past') {
    return 'Pagamento atualizado, mas o dia desse mes ja passou.';
  }

  return 'Pagamento atualizado, mas o lembrete nao foi agendado.';
}

export function RecurringEntriesPage({ selectedMonth }: RecurringEntriesPageProps) {
  const { data, error } = useMonthlyPlannerData(selectedMonth);
  const { showToast } = useToast();
  const [isBusyId, setIsBusyId] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [selectedType, setSelectedType] = useState<PlannerTypeFilter>('all');
  const [selectedSort, setSelectedSort] = useState<PlannerSortMode>('alpha');
  const [editingItem, setEditingItem] = useState<EditablePlannerItem | null>(null);

  const sortedIncomeItems = sortPlannerItems(data.incomeItems, selectedSort);
  const sortedFixedExpenseItems = sortPlannerItems(data.fixedExpenseItems, selectedSort);
  const sortedInstallmentItems = sortPlannerItems(data.installmentItems, selectedSort);
  const sortedInvestmentItems = sortPlannerItems(data.investmentItems, selectedSort);
  const sortedMonthlyExpenseItems = sortPlannerItems(data.monthlyExpenseItems, selectedSort);
  const sortedPersonPaymentItems = sortPlannerItems(data.personPaymentItems, selectedSort);
  const isActionLocked = Boolean(isBusyId) || isSavingEdit;

  function handleStartEdit(nextEditingItem: EditablePlannerItem) {
    setEditingItem(nextEditingItem);
  }

  async function handleRemove(section: PlannerSectionKey, id: string) {
    setIsBusyId(id);

    try {
      await deletePlannerItem(section, id);

      if (editingItem?.item.id === id) {
        setEditingItem(null);
      }

      showToast({ message: 'Item removido com sucesso.', tone: 'success' });
    } catch (caughtError) {
      showToast({
        message: caughtError instanceof Error ? caughtError.message : 'Falha ao remover item.',
        tone: 'error',
      });
    } finally {
      setIsBusyId('');
    }
  }

  async function handleSaveEdit(payload: PlannerItemEditorSavePayload) {
    setIsSavingEdit(true);

    try {
      if (payload.section === 'income') {
        await updateIncomeItem(payload);
        showToast({ message: 'Renda atualizada com sucesso.', tone: 'success' });
      } else if (payload.section === 'fixed-expense') {
        await updateFixedExpenseItem(payload);
        showToast({ message: 'Despesa fixa atualizada com sucesso.', tone: 'success' });
      } else if (payload.section === 'installment') {
        await updateInstallmentItem(payload);
        showToast({ message: 'Parcela atualizada com sucesso.', tone: 'success' });
      } else if (payload.section === 'investment') {
        await updateInvestmentItem(payload);
        showToast({ message: 'Investimento atualizado com sucesso.', tone: 'success' });
      } else if (payload.section === 'monthly-expense') {
        await updateMonthlyExpenseItem(payload);
        showToast({ message: 'Gasto atualizado com sucesso.', tone: 'success' });
      } else {
        const reminderResult = await updatePersonPaymentItem(payload);

        showToast({
          message: reminderResult
            ? getUpdatedReminderStatusMessage(reminderResult.status)
            : 'Pagamento atualizado com sucesso.',
          tone: reminderResult ? 'info' : 'success',
        });
      }

      setEditingItem(null);
    } catch (caughtError) {
      showToast({
        message: caughtError instanceof Error ? caughtError.message : 'Falha ao atualizar item.',
        tone: 'error',
      });
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleAdvanceInstallment(id: string) {
    setIsBusyId(id);

    try {
      await advanceInstallmentPayment(id);
      showToast({ message: 'Parcela do mes registrada como paga.', tone: 'success' });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error
            ? caughtError.message
            : 'Falha ao registrar o pagamento da parcela.',
        tone: 'error',
      });
    } finally {
      setIsBusyId('');
    }
  }

  async function handleTogglePersonPayment(id: string) {
    setIsBusyId(id);

    try {
      const reminderResult = await togglePersonPaymentPaidStatus(id);

      showToast({
        message: reminderResult
          ? getReminderStatusMessage(reminderResult.status)
          : 'Pagamento marcado como concluido.',
        tone: reminderResult ? 'info' : 'success',
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error
            ? caughtError.message
            : 'Falha ao atualizar o pagamento da pessoa.',
        tone: 'error',
      });
    } finally {
      setIsBusyId('');
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-4 px-5 pt-6 pb-8">
        <View>
          <Text className="text-brand-200 text-[11px] font-semibold tracking-[1.6px] uppercase">
            {data.selectedMonthLabel}
          </Text>
          <Text className="text-content-primary mt-3 text-[32px] font-black tracking-tight">
            Itens do mes
          </Text>
          <Text className="text-content-secondary mt-3 max-w-[300px] text-base leading-7">
            Revise o que foi cadastrado, ordene os cards como preferir, marque pagamentos concluidos
            e remova o que entrou por engano.
          </Text>
        </View>

        <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
          <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
            Mes ativo
          </Text>
          <Text className="text-content-primary mt-2 text-lg font-black tracking-tight">
            {data.selectedMonthLabel}
          </Text>
          <Text className="text-content-secondary mt-2 text-sm leading-6">
            Para trocar de periodo, altere o mes na aba Resumo. Esta lista acompanha o mesmo filtro.
          </Text>
        </View>

        {error ? (
          <View className="border-expense/20 bg-expense-soft rounded-[18px] border px-4 py-4">
            <Text className="text-expense text-sm leading-6">{error.message}</Text>
          </View>
        ) : null}

        <PlannerSectionCard title="Filtros da lista">
          <View className="gap-4 py-2">
            <View>
              <Text className="text-content-subtle mb-2 text-[10px] font-semibold tracking-[1.2px] uppercase">
                Tipo
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {plannerTypeFilterOptions.map((option) => (
                  <ChoiceChip
                    key={option.key}
                    isSelected={selectedType === option.key}
                    label={option.label}
                    onPress={() => setSelectedType(option.key)}
                  />
                ))}
              </View>
            </View>

            <View>
              <Text className="text-content-subtle mb-2 text-[10px] font-semibold tracking-[1.2px] uppercase">
                Ordem
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {plannerSortOptions.map((option) => (
                  <ChoiceChip
                    key={option.key}
                    isSelected={selectedSort === option.key}
                    label={option.label}
                    onPress={() => setSelectedSort(option.key)}
                  />
                ))}
              </View>
            </View>
          </View>
        </PlannerSectionCard>

        {editingItem ? (
          <PlannerItemEditorCard
            editingItem={editingItem}
            isSaving={isSavingEdit}
            onCancel={() => setEditingItem(null)}
            onSave={handleSaveEdit}
            onValidationError={(message) => {
              showToast({
                message,
                tone: 'error',
              });
            }}
          />
        ) : null}

        {matchesPlannerTypeFilter('income', selectedType) ? (
          <PlannerSectionCard
            title="Renda"
            totalLabel="Total"
            totalValue={formatCurrencyBRL(data.summary.incomeTotal)}>
            {sortedIncomeItems.length ? (
              sortedIncomeItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
                  actions={[
                    {
                      label: 'Editar',
                      onPress: () => handleStartEdit({ section: 'income', item }),
                      disabled: isActionLocked,
                    },
                    {
                      label: isBusyId === item.id ? 'Excluindo...' : 'Excluir',
                      onPress: () => handleRemove('income', item.id),
                      tone: 'danger',
                      disabled: isActionLocked,
                    },
                  ]}
                  showBorder={index < sortedIncomeItems.length - 1}
                  subtitle={incomeSourceCopy[item.sourceType]}
                  title={item.title}
                  tone="income"
                />
              ))
            ) : (
              <EmptySection label="renda" />
            )}
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('fixed-expense', selectedType) ? (
          <PlannerSectionCard
            title="Despesas fixas"
            totalLabel="Total"
            totalValue={formatCurrencyBRL(data.summary.fixedExpenseTotal)}>
            {sortedFixedExpenseItems.length ? (
              sortedFixedExpenseItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
                  actions={[
                    {
                      label: 'Editar',
                      onPress: () => handleStartEdit({ section: 'fixed-expense', item }),
                      disabled: isActionLocked,
                    },
                    {
                      label: isBusyId === item.id ? 'Excluindo...' : 'Excluir',
                      onPress: () => handleRemove('fixed-expense', item.id),
                      tone: 'danger',
                      disabled: isActionLocked,
                    },
                  ]}
                  showBorder={index < sortedFixedExpenseItems.length - 1}
                  title={item.title}
                  tone="expense"
                />
              ))
            ) : (
              <EmptySection label="despesas fixas" />
            )}
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('installment', selectedType) ? (
          <PlannerSectionCard
            title="Parcelas"
            totalLabel="Valor do mes"
            totalValue={formatCurrencyBRL(data.summary.installmentTotal)}>
            {sortedInstallmentItems.length ? (
              sortedInstallmentItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
                  actions={[
                    {
                      label: 'Editar',
                      onPress: () => handleStartEdit({ section: 'installment', item }),
                      disabled: isActionLocked,
                    },
                    {
                      label: isBusyId === item.id ? 'Processando...' : 'Pagar mes',
                      onPress: () => handleAdvanceInstallment(item.id),
                      tone: 'success',
                      disabled: isActionLocked,
                    },
                    {
                      label: 'Excluir',
                      onPress: () => handleRemove('installment', item.id),
                      tone: 'danger',
                      disabled: isActionLocked,
                    },
                  ]}
                  progressPercentage={getInstallmentProgressPercentage(item)}
                  progressTone="brand"
                  showBorder={index < sortedInstallmentItems.length - 1}
                  subtitle={getInstallmentSubtitle(
                    item.dueDay,
                    formatCurrencyBRL(getInstallmentPaidAmount(item)),
                    formatCurrencyBRL(getInstallmentRemainingAmount(item)),
                    formatPercentage(getInstallmentProgressPercentage(item)),
                    getInstallmentCurrentNumber(item),
                    item.totalInstallments,
                    getInstallmentRemainingCount(item),
                    item.referenceLabel
                  )}
                  title={item.title}
                  tone="expense"
                />
              ))
            ) : (
              <EmptySection label="parcelas" />
            )}
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('monthly-expense', selectedType) ? (
          <PlannerSectionCard
            title="Gastos do mes"
            totalLabel="Total"
            totalValue={formatCurrencyBRL(data.summary.monthlyExpenseTotal)}>
            {sortedMonthlyExpenseItems.length ? (
              sortedMonthlyExpenseItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
                  actions={[
                    {
                      label: 'Editar',
                      onPress: () => handleStartEdit({ section: 'monthly-expense', item }),
                      disabled: isActionLocked,
                    },
                    {
                      label: isBusyId === item.id ? 'Excluindo...' : 'Excluir',
                      onPress: () => handleRemove('monthly-expense', item.id),
                      tone: 'danger',
                      disabled: isActionLocked,
                    },
                  ]}
                  showBorder={index < sortedMonthlyExpenseItems.length - 1}
                  title={item.title}
                  tone="expense"
                />
              ))
            ) : (
              <EmptySection label="gastos do mes" />
            )}
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('person-payment', selectedType) ? (
          <PlannerSectionCard
            title="Pessoas a pagar"
            totalLabel="Total"
            totalValue={formatCurrencyBRL(data.summary.personPaymentTotal)}>
            {sortedPersonPaymentItems.length ? (
              sortedPersonPaymentItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
                  actions={[
                    {
                      label: 'Editar',
                      onPress: () => handleStartEdit({ section: 'person-payment', item }),
                      disabled: isActionLocked,
                    },
                    {
                      label:
                        isBusyId === item.id
                          ? 'Processando...'
                          : item.isPaid
                            ? 'Reabrir'
                            : 'Marcar pago',
                      onPress: () => handleTogglePersonPayment(item.id),
                      tone: item.isPaid ? 'default' : 'success',
                      disabled: isActionLocked,
                    },
                    {
                      label: 'Excluir',
                      onPress: () => handleRemove('person-payment', item.id),
                      tone: 'danger',
                      disabled: isActionLocked,
                    },
                  ]}
                  badgeLabel={item.isPaid ? 'Pago' : 'Aberto'}
                  showBorder={index < sortedPersonPaymentItems.length - 1}
                  subtitle={[
                    formatDayOfMonth(item.dueDay),
                    item.description ? item.description : null,
                  ]
                    .filter(Boolean)
                    .join(' | ')}
                  title={item.personName}
                  tone="expense"
                />
              ))
            ) : (
              <EmptySection label="pessoas a pagar" />
            )}
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('investment', selectedType) ? (
          <PlannerSectionCard
            title="Reserva e investimentos"
            totalLabel="Total"
            totalValue={formatCurrencyBRL(data.summary.investmentTotal)}>
            {sortedInvestmentItems.length ? (
              sortedInvestmentItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
                  actions={[
                    {
                      label: 'Editar',
                      onPress: () => handleStartEdit({ section: 'investment', item }),
                      disabled: isActionLocked,
                    },
                    {
                      label: isBusyId === item.id ? 'Excluindo...' : 'Excluir',
                      onPress: () => handleRemove('investment', item.id),
                      tone: 'danger',
                      disabled: isActionLocked,
                    },
                  ]}
                  showBorder={index < sortedInvestmentItems.length - 1}
                  subtitle={investmentTypeCopy[item.investmentType]}
                  title={item.title}
                />
              ))
            ) : (
              <EmptySection label="reserva e investimentos" />
            )}
          </PlannerSectionCard>
        ) : null}
      </View>
    </ScrollView>
  );
}
