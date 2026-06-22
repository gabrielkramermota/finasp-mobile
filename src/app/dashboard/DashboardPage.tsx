import React, { useState } from 'react';

import type { MonthKey } from '../../domain/finance/finance-types';
import {
  getInstallmentCurrentNumber,
  getInstallmentPaidAmount,
  getInstallmentProgressPercentage,
  getInstallmentRemainingAmount,
  getInstallmentRemainingCount,
} from '../../domain/planner/installment-progress';
import { MonthNavigator } from '../../components/planner/MonthNavigator';
import { PlannerBarChart } from '../../components/planner/PlannerBarChart';
import { PlannerItemRow } from '../../components/planner/PlannerItemRow';
import { PlannerSectionCard } from '../../components/planner/PlannerSectionCard';
import { ProfileAvatar } from '../../components/profile/ProfileAvatar';
import { SummaryMetricCard } from '../../components/planner/SummaryMetricCard';
import { ScrollView, Text, View } from '../../components/ui/NativePrimitives';
import { SelectFilter } from '../../components/ui/SelectFilter';
import { useMonthlyPlannerData } from '../../service/planner/planner-repository';
import { useUserProfile } from '../../service/user/user-repository';
import {
  matchesPlannerTypeFilter,
  plannerSortOptions,
  plannerTypeFilterOptions,
  sortPlannerItems,
  type PlannerSortMode,
  type PlannerTypeFilter,
} from '../../service/planner/planner-view';
import { formatCurrencyBRL, formatDayOfMonth, formatPercentage } from '../../utils/formatters';

type DashboardPageProps = {
  selectedMonth: MonthKey;
  onChangeMonth: (month: MonthKey) => void;
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

function buildFilterAccessory(
  selectedType: PlannerTypeFilter,
  setSelectedType: (value: PlannerTypeFilter) => void,
  selectedSort: PlannerSortMode,
  setSelectedSort: (value: PlannerSortMode) => void
) {
  return (
    <View className="gap-3">
      <SelectFilter
        options={plannerTypeFilterOptions}
        selectedKey={selectedType}
        onSelect={setSelectedType}
        label="Tipo"
      />

      <SelectFilter
        options={plannerSortOptions}
        selectedKey={selectedSort}
        onSelect={setSelectedSort}
        label="Ordem"
      />
    </View>
  );
}

export function DashboardPage({ selectedMonth, onChangeMonth }: DashboardPageProps) {
  const { data, error } = useMonthlyPlannerData(selectedMonth);
  const { profile } = useUserProfile();
  const [selectedType, setSelectedType] = useState<PlannerTypeFilter>('all');
  const [selectedSort, setSelectedSort] = useState<PlannerSortMode>('alpha');

  const sortedIncomeItems = sortPlannerItems(data.incomeItems, selectedSort);
  const sortedFixedExpenseItems = sortPlannerItems(data.fixedExpenseItems, selectedSort);
  const sortedInstallmentItems = sortPlannerItems(data.installmentItems, selectedSort);
  const sortedInvestmentItems = sortPlannerItems(data.investmentItems, selectedSort);
  const sortedMonthlyExpenseItems = sortPlannerItems(data.monthlyExpenseItems, selectedSort);
  const sortedPersonPaymentItems = sortPlannerItems(data.personPaymentItems, selectedSort);

  const expenseBase = Math.max(data.summary.expenseTotal, 1);
  const chartItems = [
    {
      amount: data.summary.fixedExpenseTotal,
      colorClassName: 'bg-expense',
      label: 'Despesas fixas',
      percentageLabel: formatPercentage((data.summary.fixedExpenseTotal / expenseBase) * 100),
      value: formatCurrencyBRL(data.summary.fixedExpenseTotal),
      widthPercentage: data.summary.expenseTotal
        ? (data.summary.fixedExpenseTotal / expenseBase) * 100
        : 0,
    },
    {
      amount: data.summary.installmentTotal,
      colorClassName: 'bg-brand',
      label: 'Parcelas',
      percentageLabel: formatPercentage((data.summary.installmentTotal / expenseBase) * 100),
      value: formatCurrencyBRL(data.summary.installmentTotal),
      widthPercentage: data.summary.expenseTotal
        ? (data.summary.installmentTotal / expenseBase) * 100
        : 0,
    },
    {
      amount: data.summary.monthlyExpenseTotal,
      colorClassName: 'bg-expense',
      label: 'Gastos do mes',
      percentageLabel: formatPercentage((data.summary.monthlyExpenseTotal / expenseBase) * 100),
      value: formatCurrencyBRL(data.summary.monthlyExpenseTotal),
      widthPercentage: data.summary.expenseTotal
        ? (data.summary.monthlyExpenseTotal / expenseBase) * 100
        : 0,
    },
    {
      amount: data.summary.personPaymentTotal,
      colorClassName: 'bg-brand-300',
      label: 'Pessoas a pagar',
      percentageLabel: formatPercentage((data.summary.personPaymentTotal / expenseBase) * 100),
      value: formatCurrencyBRL(data.summary.personPaymentTotal),
      widthPercentage: data.summary.expenseTotal
        ? (data.summary.personPaymentTotal / expenseBase) * 100
        : 0,
    },
    {
      amount: data.summary.investmentTotal,
      colorClassName: 'bg-income',
      label: 'Investimentos',
      percentageLabel: formatPercentage((data.summary.investmentTotal / expenseBase) * 100),
      value: formatCurrencyBRL(data.summary.investmentTotal),
      widthPercentage: data.summary.expenseTotal
        ? (data.summary.investmentTotal / expenseBase) * 100
        : 0,
    },
  ].filter((item) => item.amount > 0);

  const biggestExpenses = [
    ...data.fixedExpenseItems.map((item) => ({
      id: item.id,
      amount: item.amount,
      amountLabel: formatCurrencyBRL(item.amount),
      subtitle: 'Despesa fixa',
      title: item.title,
    })),
    ...data.installmentItems.map((item) => ({
      id: item.id,
      amount: item.amount,
      amountLabel: formatCurrencyBRL(item.amount),
      subtitle: `${formatDayOfMonth(item.dueDay)} | Parcela ${String(
        getInstallmentCurrentNumber(item)
      )}/${String(item.totalInstallments)}`,
      title: item.title,
    })),
    ...data.monthlyExpenseItems.map((item) => ({
      id: item.id,
      amount: item.amount,
      amountLabel: formatCurrencyBRL(item.amount),
      subtitle: 'Gasto do mes',
      title: item.title,
    })),
    ...data.personPaymentItems.map((item) => ({
      id: item.id,
      amount: item.amount,
      amountLabel: formatCurrencyBRL(item.amount),
      subtitle: `${formatDayOfMonth(item.dueDay)} | ${item.isPaid ? 'Pago' : 'Em aberto'}`,
      title: item.personName,
    })),
    ...data.investmentItems.map((item) => ({
      id: item.id,
      amount: item.amount,
      amountLabel: formatCurrencyBRL(item.amount),
      subtitle: investmentTypeCopy[item.investmentType],
      title: item.title,
    })),
  ]
    .sort((leftItem, rightItem) => rightItem.amount - leftItem.amount)
    .slice(0, 5);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-4 px-5 pt-6 pb-8">
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1">
            <Text className="text-brand-200 text-[11px] font-semibold tracking-[1.6px] uppercase">
              Bem-vindo
            </Text>
            <Text className="text-content-primary mt-2 text-xl font-black tracking-tight">
              {profile?.name ?? 'Usuario local'}
            </Text>
          </View>

          <ProfileAvatar
            className="border border-white/10"
            name={profile?.name ?? 'Finasp'}
            photoUri={profile?.photoUri}
            size="md"
          />
        </View>

        <MonthNavigator selectedMonth={selectedMonth} onChangeMonth={onChangeMonth} />

        <View>
          <Text className="text-content-primary mt-3 text-[32px] font-black tracking-tight">
            Resumo mensal
          </Text>
        </View>

        {error ? (
          <View className="border-expense/20 bg-expense-soft rounded-[18px] border px-4 py-4">
            <Text className="text-expense text-sm font-semibold">{error.message}</Text>
          </View>
        ) : null}

        <View className="gap-3">
          <SummaryMetricCard
            description="Tudo que entrou no mes selecionado."
            title="Renda"
            tone="income"
            value={formatCurrencyBRL(data.summary.incomeTotal)}
          />
          <SummaryMetricCard
            description="Fixas, gastos, parcelas e pessoas a pagar."
            title="Despesas e parcelas"
            tone="expense"
            value={formatCurrencyBRL(data.summary.committedExpenseTotal)}
          />
          <SummaryMetricCard
            description="Compras avulsas lancadas neste mes."
            title="Gastos do mes"
            tone="expense"
            value={formatCurrencyBRL(data.summary.monthlyExpenseTotal)}
          />
          <SummaryMetricCard
            description="Reserva e aportes cadastrados."
            title="Investimentos"
            tone="brand"
            value={formatCurrencyBRL(data.summary.investmentTotal)}
          />
          <SummaryMetricCard
            description="Quanto deve sobrar no fim do mes."
            title="Sobra"
            tone={data.summary.remainingTotal >= 0 ? 'income' : 'expense'}
            value={formatCurrencyBRL(data.summary.remainingTotal)}
          />
        </View>

        <PlannerSectionCard
          title="Distribuicao do mes"
          totalLabel="Base"
          totalValue={formatCurrencyBRL(data.summary.expenseTotal)}>
          {chartItems.length ? (
            <View className="py-2">
              <PlannerBarChart items={chartItems} />
            </View>
          ) : (
            <EmptySection label="distribuicao" />
          )}
        </PlannerSectionCard>

        <PlannerSectionCard
          title="Maiores gastos"
          totalLabel="Top"
          totalValue={String(biggestExpenses.length)}>
          {biggestExpenses.length ? (
            biggestExpenses.map((item, index) => (
              <PlannerItemRow
                key={item.id}
                amount={item.amountLabel}
                showBorder={index < biggestExpenses.length - 1}
                subtitle={item.subtitle}
                title={item.title}
                tone="expense"
              />
            ))
          ) : (
            <EmptySection label="maiores gastos" />
          )}
        </PlannerSectionCard>

        <PlannerSectionCard
          title="Filtros da visao"
          headerAccessory={buildFilterAccessory(
            selectedType,
            setSelectedType,
            selectedSort,
            setSelectedSort
          )}>
          <Text className="text-content-muted py-2 text-sm leading-6">
            Filtre por bloco e altere a ordem alfabetica, por valor, vencimento ou data de criacao.
          </Text>
        </PlannerSectionCard>

        {matchesPlannerTypeFilter('income', selectedType) ? (
          <PlannerSectionCard
            title="Renda"
            totalLabel="Renda total"
            totalValue={formatCurrencyBRL(data.summary.incomeTotal)}>
            {sortedIncomeItems.length ? (
              sortedIncomeItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
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
            totalLabel="Valor total"
            totalValue={formatCurrencyBRL(data.summary.fixedExpenseTotal)}>
            {sortedFixedExpenseItems.length ? (
              sortedFixedExpenseItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
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
            totalLabel="Valor total"
            totalValue={formatCurrencyBRL(data.summary.installmentTotal)}>
            {sortedInstallmentItems.length ? (
              sortedInstallmentItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
                  progressPercentage={getInstallmentProgressPercentage(item)}
                  progressTone="brand"
                  showBorder={index < sortedInstallmentItems.length - 1}
                  subtitle={[
                    formatDayOfMonth(item.dueDay),
                    `Parcela ${String(getInstallmentCurrentNumber(item))}/${String(
                      item.totalInstallments
                    )}`,
                    `${formatPercentage(getInstallmentProgressPercentage(item))} pago`,
                    `Pago ${formatCurrencyBRL(getInstallmentPaidAmount(item))}`,
                    `Restam ${String(getInstallmentRemainingCount(item))}`,
                    `Falta ${formatCurrencyBRL(getInstallmentRemainingAmount(item))}`,
                    item.referenceLabel ? `Ref. ${item.referenceLabel}` : null,
                  ]
                    .filter(Boolean)
                    .join(' | ')}
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
            totalLabel="Valor total"
            totalValue={formatCurrencyBRL(data.summary.monthlyExpenseTotal)}>
            {sortedMonthlyExpenseItems.length ? (
              sortedMonthlyExpenseItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
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
            totalLabel="Valor total"
            totalValue={formatCurrencyBRL(data.summary.personPaymentTotal)}>
            {sortedPersonPaymentItems.length ? (
              sortedPersonPaymentItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
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
            totalLabel="Valor total"
            totalValue={formatCurrencyBRL(data.summary.investmentTotal)}>
            {sortedInvestmentItems.length ? (
              sortedInvestmentItems.map((item, index) => (
                <PlannerItemRow
                  key={item.id}
                  amount={formatCurrencyBRL(item.amount)}
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

        <PlannerSectionCard
          title="Resumo"
          totalLabel="Sobra total"
          totalValue={formatCurrencyBRL(data.summary.remainingTotal)}>
          <PlannerItemRow
            amount={formatCurrencyBRL(data.summary.incomeTotal)}
            showBorder
            title="Renda total"
          />
          <PlannerItemRow
            amount={formatCurrencyBRL(data.summary.committedExpenseTotal)}
            showBorder
            title="Despesas e parcelas"
            tone="expense"
          />
          <PlannerItemRow
            amount={formatCurrencyBRL(data.summary.monthlyExpenseTotal)}
            showBorder
            title="Gastos do mes"
            tone="expense"
          />
          <PlannerItemRow
            amount={formatCurrencyBRL(data.summary.investmentTotal)}
            showBorder
            title="Investimentos"
            tone="expense"
          />
          <PlannerItemRow
            amount={formatPercentage(data.summary.spentPercentage)}
            showBorder
            title="Percentual gasto"
            tone="expense"
          />
          <PlannerItemRow
            amount={formatCurrencyBRL(data.summary.remainingTotal)}
            showBorder={false}
            title="Sobra total"
            tone={data.summary.remainingTotal >= 0 ? 'income' : 'expense'}
          />
        </PlannerSectionCard>
      </View>
    </ScrollView>
  );
}
