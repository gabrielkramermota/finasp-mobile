import React, { useState } from 'react';

import type { MonthKey } from '../../domain/finance/finance-types';
import {
  getInstallmentProgressPercentage,
  getInstallmentRemainingCount,
} from '../../domain/planner/installment-progress';
import { IncomeModal } from '../../components/entries-modals/IncomeModal';
import { FixedExpenseModal } from '../../components/entries-modals/FixedExpenseModal';
import { MonthlyExpenseModal } from '../../components/entries-modals/MonthlyExpenseModal';
import { InstallmentModal } from '../../components/entries-modals/InstallmentModal';
import { InvestmentModal } from '../../components/entries-modals/InvestmentModal';
import { PersonPaymentModal } from '../../components/entries-modals/PersonPaymentModal';
import { ScrollView, Text, View } from '../../components/ui/NativePrimitives';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { SelectFilter } from '../../components/ui/SelectFilter';
import { useToast } from '../../components/ui/ToastProvider';
import {
  createFixedExpenseItem,
  createIncomeItem,
  createInstallmentItem,
  createInvestmentItem,
  createMonthlyExpenseItem,
  createPersonPaymentItem,
  useMonthlyPlannerData,
} from '../../service/planner/planner-repository';
import {
  matchesPlannerTypeFilter,
  plannerTypeFilterOptions,
  type PlannerTypeFilter,
} from '../../service/planner/planner-view';
import { formatCurrencyBRL, formatPercentage } from '../../utils/formatters';
import type { IncomeSourceType, InvestmentType } from '../../domain/planner/planner-types';
import type { PersonPaymentReminderStatus } from '../../service/notifications/payment-reminders';

type EntriesPageProps = {
  selectedMonth: MonthKey;
};

function parseAmount(value: string) {
  return Number(value.replace(',', '.'));
}

function parseInteger(value: string) {
  return Number.parseInt(value, 10);
}

async function runCreateAction({
  title,
  amount,
  onSuccess,
  action,
  emptyTitleMessage,
  emptyAmountMessage,
}: {
  title: string;
  amount: string;
  onSuccess: () => void;
  action: (parsedAmount: number) => Promise<void>;
  emptyTitleMessage: string;
  emptyAmountMessage: string;
}) {
  const parsedAmount = parseAmount(amount);

  if (!title.trim()) {
    throw new Error(emptyTitleMessage);
  }

  if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error(emptyAmountMessage);
  }

  await action(parsedAmount);
  onSuccess();
}

function getReminderMessage(status: PersonPaymentReminderStatus) {
  if (status === 'scheduled') {
    return 'Pagamento cadastrado e lembrete agendado no aparelho.';
  }

  if (status === 'permission-denied') {
    return 'Pagamento cadastrado, mas sem permissao para notificacao.';
  }

  if (status === 'date-in-past') {
    return 'Pagamento cadastrado. O vencimento desse mes ja passou e nao houve lembrete.';
  }

  return 'Pagamento cadastrado, mas o lembrete nao foi agendado.';
}

export function EntriesPage({ selectedMonth }: EntriesPageProps) {
  const { data, error } = useMonthlyPlannerData(selectedMonth);
  const { showToast } = useToast();
  const [selectedType, setSelectedType] = useState<PlannerTypeFilter>('all');
  const [isSaving, setIsSaving] = useState(false);

  // Modal visibility states
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isFixedExpenseModalOpen, setIsFixedExpenseModalOpen] = useState(false);
  const [isMonthlyExpenseModalOpen, setIsMonthlyExpenseModalOpen] = useState(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isPersonPaymentModalOpen, setIsPersonPaymentModalOpen] = useState(false);

  // Income form state
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSourceType, setIncomeSourceType] = useState<IncomeSourceType>('salary');

  // Fixed expense form state
  const [fixedTitle, setFixedTitle] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');

  // Monthly expense form state
  const [monthlyExpenseTitle, setMonthlyExpenseTitle] = useState('');
  const [monthlyExpenseAmount, setMonthlyExpenseAmount] = useState('');

  // Installment form state
  const [installmentTitle, setInstallmentTitle] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [installmentDueDay, setInstallmentDueDay] = useState('');
  const [installmentReference, setInstallmentReference] = useState('');
  const [installmentTotalCount, setInstallmentTotalCount] = useState('');

  // Investment form state
  const [investmentTitle, setInvestmentTitle] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentType, setInvestmentType] = useState<InvestmentType>('reserve');

  // Person payment form state
  const [personPaymentName, setPersonPaymentName] = useState('');
  const [personPaymentAmount, setPersonPaymentAmount] = useState('');
  const [personPaymentDueDay, setPersonPaymentDueDay] = useState('');
  const [personPaymentDescription, setPersonPaymentDescription] = useState('');

  async function handleIncomeCreate() {
    setIsSaving(true);

    try {
      await runCreateAction({
        title: incomeTitle,
        amount: incomeAmount,
        emptyTitleMessage: 'Informe o nome da renda.',
        emptyAmountMessage: 'Informe um valor valido para a renda.',
        action: async (parsedAmount) =>
          createIncomeItem({
            competenceMonth: selectedMonth,
            title: incomeTitle.trim(),
            amount: parsedAmount,
            sourceType: incomeSourceType,
          }),
        onSuccess: () => {
          setIncomeTitle('');
          setIncomeAmount('');
          setIsIncomeModalOpen(false);
          showToast({ message: 'Renda cadastrada com sucesso.', playSound: true, tone: 'success' });
        },
      });
    } catch (caughtError) {
      showToast({
        message: caughtError instanceof Error ? caughtError.message : 'Falha ao cadastrar renda.',
        tone: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleFixedExpenseCreate() {
    setIsSaving(true);

    try {
      await runCreateAction({
        title: fixedTitle,
        amount: fixedAmount,
        emptyTitleMessage: 'Informe o nome da despesa fixa.',
        emptyAmountMessage: 'Informe um valor valido para a despesa fixa.',
        action: async (parsedAmount) =>
          createFixedExpenseItem({
            competenceMonth: selectedMonth,
            title: fixedTitle.trim(),
            amount: parsedAmount,
          }),
        onSuccess: () => {
          setFixedTitle('');
          setFixedAmount('');
          setIsFixedExpenseModalOpen(false);
          showToast({
            message: 'Despesa fixa cadastrada com sucesso.',
            playSound: true,
            tone: 'success',
          });
        },
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error ? caughtError.message : 'Falha ao cadastrar despesa fixa.',
        tone: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleInstallmentCreate() {
    const parsedAmount = parseAmount(installmentAmount);
    const parsedDueDay = parseInteger(installmentDueDay);
    const parsedTotalCount = parseInteger(installmentTotalCount);

    setIsSaving(true);

    try {
      if (!installmentTitle.trim()) {
        throw new Error('Informe o nome da parcela.');
      }

      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Informe um valor valido para a parcela.');
      }

      if (!parsedDueDay || Number.isNaN(parsedDueDay) || parsedDueDay < 1 || parsedDueDay > 31) {
        throw new Error('Informe um dia de vencimento entre 1 e 31.');
      }

      if (!parsedTotalCount || Number.isNaN(parsedTotalCount) || parsedTotalCount < 1) {
        throw new Error('Informe a quantidade total de parcelas.');
      }

      await createInstallmentItem({
        competenceMonth: selectedMonth,
        title: installmentTitle.trim(),
        amount: parsedAmount,
        dueDay: parsedDueDay,
        referenceLabel: installmentReference.trim(),
        totalInstallments: parsedTotalCount,
      });

      setInstallmentTitle('');
      setInstallmentAmount('');
      setInstallmentDueDay('');
      setInstallmentReference('');
      setInstallmentTotalCount('');
      setIsInstallmentModalOpen(false);
      showToast({ message: 'Parcela cadastrada com sucesso.', playSound: true, tone: 'success' });
    } catch (caughtError) {
      showToast({
        message: caughtError instanceof Error ? caughtError.message : 'Falha ao cadastrar parcela.',
        tone: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleInvestmentCreate() {
    setIsSaving(true);

    try {
      await runCreateAction({
        title: investmentTitle,
        amount: investmentAmount,
        emptyTitleMessage: 'Informe o nome do item de investimento.',
        emptyAmountMessage: 'Informe um valor valido para o investimento.',
        action: async (parsedAmount) =>
          createInvestmentItem({
            competenceMonth: selectedMonth,
            title: investmentTitle.trim(),
            amount: parsedAmount,
            investmentType,
          }),
        onSuccess: () => {
          setInvestmentTitle('');
          setInvestmentAmount('');
          setIsInvestmentModalOpen(false);
          showToast({ message: 'Item cadastrado com sucesso.', playSound: true, tone: 'success' });
        },
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error ? caughtError.message : 'Falha ao cadastrar investimento.',
        tone: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMonthlyExpenseCreate() {
    setIsSaving(true);

    try {
      await runCreateAction({
        title: monthlyExpenseTitle,
        amount: monthlyExpenseAmount,
        emptyTitleMessage: 'Informe o nome do gasto.',
        emptyAmountMessage: 'Informe um valor valido para o gasto.',
        action: async (parsedAmount) =>
          createMonthlyExpenseItem({
            competenceMonth: selectedMonth,
            title: monthlyExpenseTitle.trim(),
            amount: parsedAmount,
          }),
        onSuccess: () => {
          setMonthlyExpenseTitle('');
          setMonthlyExpenseAmount('');
          setIsMonthlyExpenseModalOpen(false);
          showToast({ message: 'Gasto cadastrado com sucesso.', playSound: true, tone: 'success' });
        },
      });
    } catch (caughtError) {
      showToast({
        message: caughtError instanceof Error ? caughtError.message : 'Falha ao cadastrar gasto.',
        tone: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePersonPaymentCreate() {
    const parsedAmount = parseAmount(personPaymentAmount);
    const parsedDueDay = parseInteger(personPaymentDueDay);

    setIsSaving(true);

    try {
      if (!personPaymentName.trim()) {
        throw new Error('Informe o nome da pessoa.');
      }

      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Informe um valor valido para esse pagamento.');
      }

      if (!parsedDueDay || Number.isNaN(parsedDueDay) || parsedDueDay < 1 || parsedDueDay > 31) {
        throw new Error('Informe um dia de pagamento entre 1 e 31.');
      }

      const reminderResult = await createPersonPaymentItem({
        competenceMonth: selectedMonth,
        personName: personPaymentName.trim(),
        amount: parsedAmount,
        dueDay: parsedDueDay,
        description: personPaymentDescription.trim(),
      });

      setPersonPaymentName('');
      setPersonPaymentAmount('');
      setPersonPaymentDueDay('');
      setPersonPaymentDescription('');
      setIsPersonPaymentModalOpen(false);
      showToast({
        message: getReminderMessage(reminderResult.status),
        playSound: true,
        tone: reminderResult.status === 'scheduled' ? 'success' : 'info',
      });
    } catch (caughtError) {
      showToast({
        message:
          caughtError instanceof Error
            ? caughtError.message
            : 'Falha ao cadastrar pagamento para pessoa.',
        tone: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4 px-5 pt-6 pb-8">
          <View>
            <Text className="text-brand-200 text-[11px] font-semibold tracking-[1.6px] uppercase">
              {data.selectedMonthLabel}
            </Text>
            <Text className="text-content-primary mt-3 text-[32px] font-black tracking-tight">
              Cadastro mensal
            </Text>
            <Text className="text-content-secondary mt-3 max-w-[300px] text-base leading-7">
              Clique nos botões abaixo para cadastrar seus dados. O mês é definido na aba Resumo.
            </Text>
          </View>

          <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
            <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
              Mês ativo
            </Text>
            <Text className="text-content-primary mt-2 text-lg font-black tracking-tight">
              {data.selectedMonthLabel}
            </Text>
            <Text className="text-content-secondary mt-2 text-sm leading-6">
              O mês é definido na aba Resumo e todo cadastro desta tela entra nesse período.
            </Text>
          </View>

          <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
            <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
              Visão rápida
            </Text>
            <Text className="text-content-primary mt-2 text-lg font-black tracking-tight">
              Renda: {formatCurrencyBRL(data.summary.incomeTotal)}
            </Text>
            <Text className="text-content-secondary mt-1 text-sm leading-6">
              Despesas e parcelas: {formatCurrencyBRL(data.summary.committedExpenseTotal)}
            </Text>
            <Text className="text-content-secondary mt-1 text-sm leading-6">
              Gastos do mês: {formatCurrencyBRL(data.summary.monthlyExpenseTotal)}
            </Text>
            <Text className="text-content-secondary mt-1 text-sm leading-6">
              Investimentos: {formatCurrencyBRL(data.summary.investmentTotal)}
            </Text>
          </View>

          <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
            <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
              Tipo de cadastro
            </Text>
            <View className="mt-3">
              <SelectFilter
                options={plannerTypeFilterOptions}
                selectedKey={selectedType}
                onSelect={setSelectedType}
                label="Filtro de cadastro"
              />
            </View>
          </View>

          {/* Action Buttons Grid */}
          <View className="gap-3">
            {matchesPlannerTypeFilter('income', selectedType) ? (
              <PrimaryButton onPress={() => setIsIncomeModalOpen(true)} title="+ Adicionar renda" />
            ) : null}

            {matchesPlannerTypeFilter('fixed-expense', selectedType) ? (
              <PrimaryButton
                onPress={() => setIsFixedExpenseModalOpen(true)}
                title="+ Adicionar despesa fixa"
              />
            ) : null}

            {matchesPlannerTypeFilter('monthly-expense', selectedType) ? (
              <PrimaryButton
                onPress={() => setIsMonthlyExpenseModalOpen(true)}
                title="+ Adicionar gasto"
              />
            ) : null}

            {matchesPlannerTypeFilter('installment', selectedType) ? (
              <PrimaryButton
                onPress={() => setIsInstallmentModalOpen(true)}
                title="+ Adicionar parcela"
              />
            ) : null}

            {matchesPlannerTypeFilter('person-payment', selectedType) ? (
              <PrimaryButton
                onPress={() => setIsPersonPaymentModalOpen(true)}
                title="+ Adicionar pessoa a pagar"
              />
            ) : null}

            {matchesPlannerTypeFilter('investment', selectedType) ? (
              <PrimaryButton
                onPress={() => setIsInvestmentModalOpen(true)}
                title="+ Adicionar reserva ou investimento"
              />
            ) : null}
          </View>

          {error ? (
            <View className="border-expense/20 bg-expense-soft rounded-[18px] border px-4 py-4">
              <Text className="text-expense text-sm leading-6">{error.message}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Modals */}
      <IncomeModal
        isVisible={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        isLoading={isSaving}
        title={incomeTitle}
        amount={incomeAmount}
        sourceType={incomeSourceType}
        onTitleChange={setIncomeTitle}
        onAmountChange={setIncomeAmount}
        onSourceTypeChange={setIncomeSourceType}
        onSubmit={handleIncomeCreate}
      />

      <FixedExpenseModal
        isVisible={isFixedExpenseModalOpen}
        onClose={() => setIsFixedExpenseModalOpen(false)}
        isLoading={isSaving}
        title={fixedTitle}
        amount={fixedAmount}
        onTitleChange={setFixedTitle}
        onAmountChange={setFixedAmount}
        onSubmit={handleFixedExpenseCreate}
      />

      <MonthlyExpenseModal
        isVisible={isMonthlyExpenseModalOpen}
        onClose={() => setIsMonthlyExpenseModalOpen(false)}
        isLoading={isSaving}
        title={monthlyExpenseTitle}
        amount={monthlyExpenseAmount}
        onTitleChange={setMonthlyExpenseTitle}
        onAmountChange={setMonthlyExpenseAmount}
        onSubmit={handleMonthlyExpenseCreate}
      />

      <InstallmentModal
        isVisible={isInstallmentModalOpen}
        onClose={() => setIsInstallmentModalOpen(false)}
        isLoading={isSaving}
        title={installmentTitle}
        amount={installmentAmount}
        dueDay={installmentDueDay}
        reference={installmentReference}
        totalCount={installmentTotalCount}
        selectedMonth={selectedMonth}
        onTitleChange={setInstallmentTitle}
        onAmountChange={setInstallmentAmount}
        onDueDayChange={setInstallmentDueDay}
        onReferenceChange={setInstallmentReference}
        onTotalCountChange={setInstallmentTotalCount}
        onSubmit={handleInstallmentCreate}
      />

      <InvestmentModal
        isVisible={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        isLoading={isSaving}
        title={investmentTitle}
        amount={investmentAmount}
        investmentType={investmentType}
        onTitleChange={setInvestmentTitle}
        onAmountChange={setInvestmentAmount}
        onInvestmentTypeChange={setInvestmentType}
        onSubmit={handleInvestmentCreate}
      />

      <PersonPaymentModal
        isVisible={isPersonPaymentModalOpen}
        onClose={() => setIsPersonPaymentModalOpen(false)}
        isLoading={isSaving}
        name={personPaymentName}
        amount={personPaymentAmount}
        dueDay={personPaymentDueDay}
        description={personPaymentDescription}
        onNameChange={setPersonPaymentName}
        onAmountChange={setPersonPaymentAmount}
        onDueDayChange={setPersonPaymentDueDay}
        onDescriptionChange={setPersonPaymentDescription}
        onSubmit={handlePersonPaymentCreate}
      />
    </>
  );
}
