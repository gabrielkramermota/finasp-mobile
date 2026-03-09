import React, { useState } from 'react';

import type { MonthKey } from '../../domain/finance/finance-types';
import {
  getInstallmentProgressPercentage,
  getInstallmentRemainingCount,
} from '../../domain/planner/installment-progress';
import { PlannerSectionCard } from '../../components/planner/PlannerSectionCard';
import { ChoiceChip } from '../../components/ui/ChoiceChip';
import { ScrollView, Text, View } from '../../components/ui/NativePrimitives';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TextField } from '../../components/ui/TextField';
import { useToast } from '../../components/ui/ToastProvider';
import {
  createFixedExpenseItem,
  createIncomeItem,
  createInstallmentItem,
  createInvestmentItem,
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
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSourceType, setIncomeSourceType] = useState<IncomeSourceType>('salary');
  const [fixedTitle, setFixedTitle] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [installmentTitle, setInstallmentTitle] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [installmentDueDay, setInstallmentDueDay] = useState('');
  const [installmentReference, setInstallmentReference] = useState('');
  const [installmentTotalCount, setInstallmentTotalCount] = useState('');
  const [investmentTitle, setInvestmentTitle] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentType, setInvestmentType] = useState<InvestmentType>('reserve');
  const [personPaymentName, setPersonPaymentName] = useState('');
  const [personPaymentAmount, setPersonPaymentAmount] = useState('');
  const [personPaymentDueDay, setPersonPaymentDueDay] = useState('');
  const [personPaymentDescription, setPersonPaymentDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
            Escolha o bloco que quer preencher. Tudo entra direto no mes filtrado e recalcula o
            dashboard automaticamente.
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
            O mes e definido na aba Resumo e todo cadastro desta tela entra nesse periodo.
          </Text>
        </View>

        <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
          <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
            Visao rapida
          </Text>
          <Text className="text-content-primary mt-2 text-lg font-black tracking-tight">
            Renda: {formatCurrencyBRL(data.summary.incomeTotal)}
          </Text>
          <Text className="text-content-secondary mt-1 text-sm leading-6">
            Despesas e parcelas: {formatCurrencyBRL(data.summary.committedExpenseTotal)}
          </Text>
          <Text className="text-content-secondary mt-1 text-sm leading-6">
            Investimentos: {formatCurrencyBRL(data.summary.investmentTotal)}
          </Text>
        </View>

        <View className="border-border-subtle bg-surface rounded-[18px] border px-4 py-4">
          <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
            Tipo de cadastro
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
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

        {matchesPlannerTypeFilter('income', selectedType) ? (
          <PlannerSectionCard title="Adicionar renda">
            <View className="gap-4 py-2">
              <TextField
                label="Nome"
                onChangeText={setIncomeTitle}
                placeholder="Trabalho, extra, dividendos"
                value={incomeTitle}
              />
              <TextField
                keyboardType="numeric"
                label="Valor"
                onChangeText={setIncomeAmount}
                placeholder="3500"
                prefix="R$"
                value={incomeAmount}
              />
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
              <PrimaryButton
                disabled={isSaving}
                onPress={handleIncomeCreate}
                title={isSaving ? 'Salvando...' : 'Adicionar renda'}
              />
            </View>
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('fixed-expense', selectedType) ? (
          <PlannerSectionCard title="Adicionar despesa fixa">
            <View className="gap-4 py-2">
              <TextField
                label="Nome"
                onChangeText={setFixedTitle}
                placeholder="Internet, academia, aluguel"
                value={fixedTitle}
              />
              <TextField
                keyboardType="numeric"
                label="Valor"
                onChangeText={setFixedAmount}
                placeholder="120"
                prefix="R$"
                value={fixedAmount}
              />
              <PrimaryButton
                disabled={isSaving}
                onPress={handleFixedExpenseCreate}
                title={isSaving ? 'Salvando...' : 'Adicionar despesa fixa'}
              />
            </View>
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('installment', selectedType) ? (
          <PlannerSectionCard title="Adicionar parcela">
            <View className="gap-4 py-2">
              <TextField
                label="Nome"
                onChangeText={setInstallmentTitle}
                placeholder="Carro, iPhone, TV"
                value={installmentTitle}
              />
              <TextField
                keyboardType="numeric"
                label="Valor"
                onChangeText={setInstallmentAmount}
                placeholder="450"
                prefix="R$"
                value={installmentAmount}
              />
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
              {installmentAmount && installmentTotalCount ? (
                <View className="border-border-subtle bg-background rounded-[14px] border px-4 py-4">
                  <Text className="text-content-subtle text-[10px] font-semibold tracking-[1.2px] uppercase">
                    Projecao
                  </Text>
                  <Text className="text-content-primary mt-2 text-sm leading-6 font-semibold">
                    Valor total previsto:{' '}
                    {formatCurrencyBRL(
                      (parseAmount(installmentAmount) || 0) *
                        (parseInteger(installmentTotalCount) || 0)
                    )}
                  </Text>
                  <Text className="text-content-secondary mt-2 text-sm leading-6">
                    Restam{' '}
                    {String(
                      getInstallmentRemainingCount({
                        id: 'preview',
                        title: installmentTitle || 'Parcela',
                        amount: parseAmount(installmentAmount) || 0,
                        competenceMonth: data.selectedMonth,
                        createdAt: '',
                        dueDay: parseInteger(installmentDueDay) || 1,
                        paidInstallments: 0,
                        referenceLabel: installmentReference || null,
                        totalInstallments: parseInteger(installmentTotalCount) || 1,
                        updatedAt: '',
                      })
                    )}{' '}
                    parcelas e o progresso inicia em{' '}
                    {formatPercentage(
                      getInstallmentProgressPercentage({
                        id: 'preview',
                        title: installmentTitle || 'Parcela',
                        amount: parseAmount(installmentAmount) || 0,
                        competenceMonth: data.selectedMonth,
                        createdAt: '',
                        dueDay: parseInteger(installmentDueDay) || 1,
                        paidInstallments: 0,
                        referenceLabel: installmentReference || null,
                        totalInstallments: parseInteger(installmentTotalCount) || 1,
                        updatedAt: '',
                      })
                    )}
                    .
                  </Text>
                </View>
              ) : null}
              <PrimaryButton
                disabled={isSaving}
                onPress={handleInstallmentCreate}
                title={isSaving ? 'Salvando...' : 'Adicionar parcela'}
              />
            </View>
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('person-payment', selectedType) ? (
          <PlannerSectionCard title="Adicionar pessoa a pagar">
            <View className="gap-4 py-2">
              <TextField
                label="Pessoa"
                onChangeText={setPersonPaymentName}
                placeholder="Nome da pessoa"
                value={personPaymentName}
              />
              <TextField
                keyboardType="numeric"
                label="Valor"
                onChangeText={setPersonPaymentAmount}
                placeholder="250"
                prefix="R$"
                value={personPaymentAmount}
              />
              <TextField
                keyboardType="numeric"
                label="Dia de pagamento"
                onChangeText={setPersonPaymentDueDay}
                placeholder="15"
                value={personPaymentDueDay}
              />
              <TextField
                label="Descricao opcional"
                multiline
                onChangeText={setPersonPaymentDescription}
                placeholder="Servico, combinado ou observacao"
                value={personPaymentDescription}
              />
              <PrimaryButton
                disabled={isSaving}
                onPress={handlePersonPaymentCreate}
                title={isSaving ? 'Salvando...' : 'Adicionar pessoa'}
              />
            </View>
          </PlannerSectionCard>
        ) : null}

        {matchesPlannerTypeFilter('investment', selectedType) ? (
          <PlannerSectionCard title="Adicionar reserva ou investimento">
            <View className="gap-4 py-2">
              <TextField
                label="Nome"
                onChangeText={setInvestmentTitle}
                placeholder="Reserva, investimento"
                value={investmentTitle}
              />
              <TextField
                keyboardType="numeric"
                label="Valor"
                onChangeText={setInvestmentAmount}
                placeholder="300"
                prefix="R$"
                value={investmentAmount}
              />
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
              <PrimaryButton
                disabled={isSaving}
                onPress={handleInvestmentCreate}
                title={isSaving ? 'Salvando...' : 'Adicionar item'}
              />
            </View>
          </PlannerSectionCard>
        ) : null}

        {error ? (
          <View className="border-expense/20 bg-expense-soft rounded-[18px] border px-4 py-4">
            <Text className="text-expense text-sm leading-6">{error.message}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
