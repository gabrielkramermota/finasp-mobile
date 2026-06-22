import { describe, expect, it } from 'vitest';

import type {
  FixedExpenseItem,
  IncomeItem,
  InstallmentItem,
  InvestmentItem,
  MonthlyExpenseItem,
  PersonPaymentItem,
} from '../../domain/planner/planner-types';
import { createMonthlyPlannerData } from './planner-selectors';

const baseTimestamps = {
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function createIncomeItem(overrides: Partial<IncomeItem> = {}): IncomeItem {
  return {
    ...baseTimestamps,
    id: 'income-1',
    title: 'Salario',
    amount: 5000,
    competenceMonth: '2026-5',
    sourceType: 'salary',
    ...overrides,
  };
}

function createFixedExpenseItem(overrides: Partial<FixedExpenseItem> = {}): FixedExpenseItem {
  return {
    ...baseTimestamps,
    id: 'fixed-1',
    title: 'Internet',
    amount: 120,
    competenceMonth: '2026-5',
    ...overrides,
  };
}

function createInvestmentItem(overrides: Partial<InvestmentItem> = {}): InvestmentItem {
  return {
    ...baseTimestamps,
    id: 'investment-1',
    title: 'Reserva',
    amount: 400,
    competenceMonth: '2026-5',
    investmentType: 'reserve',
    ...overrides,
  };
}

function createMonthlyExpenseItem(overrides: Partial<MonthlyExpenseItem> = {}): MonthlyExpenseItem {
  return {
    ...baseTimestamps,
    id: 'monthly-expense-1',
    title: 'Hamburguer',
    amount: 20,
    competenceMonth: '2026-6',
    ...overrides,
  };
}

function createPersonPaymentItem(overrides: Partial<PersonPaymentItem> = {}): PersonPaymentItem {
  return {
    ...baseTimestamps,
    id: 'person-payment-1',
    title: 'Maria',
    personName: 'Maria',
    amount: 250,
    competenceMonth: '2026-5',
    description: null,
    dueDay: 10,
    isPaid: false,
    notificationId: null,
    ...overrides,
  };
}

function createInstallmentItem(overrides: Partial<InstallmentItem> = {}): InstallmentItem {
  return {
    ...baseTimestamps,
    id: 'installment-1',
    title: 'Notebook',
    amount: 300,
    competenceMonth: '2026-5',
    dueDay: 15,
    paidInstallments: 0,
    referenceLabel: null,
    totalInstallments: 10,
    ...overrides,
  };
}

describe('createMonthlyPlannerData', () => {
  it('keeps monthly planning items active after the month they were created', () => {
    const data = createMonthlyPlannerData(
      {
        incomeItems: [createIncomeItem()],
        fixedExpenseItems: [createFixedExpenseItem()],
        installmentItems: [createInstallmentItem()],
        investmentItems: [createInvestmentItem()],
        monthlyExpenseItems: [],
        personPaymentItems: [createPersonPaymentItem()],
      },
      '2026-6'
    );

    expect(data.incomeItems).toHaveLength(1);
    expect(data.fixedExpenseItems).toHaveLength(1);
    expect(data.installmentItems).toHaveLength(1);
    expect(data.investmentItems).toHaveLength(1);
    expect(data.personPaymentItems).toHaveLength(0);
    expect(data.summary.incomeTotal).toBe(5000);
    expect(data.summary.fixedExpenseTotal).toBe(120);
    expect(data.summary.investmentTotal).toBe(400);
    expect(data.summary.remainingTotal).toBe(4180);
  });

  it('does not show monthly planning items before their start month', () => {
    const data = createMonthlyPlannerData(
      {
        incomeItems: [createIncomeItem({ competenceMonth: '2026-7' })],
        fixedExpenseItems: [createFixedExpenseItem({ competenceMonth: '2026-7' })],
        installmentItems: [createInstallmentItem({ competenceMonth: '2026-7' })],
        investmentItems: [createInvestmentItem({ competenceMonth: '2026-7' })],
        monthlyExpenseItems: [],
        personPaymentItems: [],
      },
      '2026-6'
    );

    expect(data.incomeItems).toHaveLength(0);
    expect(data.fixedExpenseItems).toHaveLength(0);
    expect(data.installmentItems).toHaveLength(0);
    expect(data.investmentItems).toHaveLength(0);
  });

  it('subtracts monthly expenses from the selected month remaining total', () => {
    const data = createMonthlyPlannerData(
      {
        incomeItems: [createIncomeItem({ competenceMonth: '2026-6' })],
        fixedExpenseItems: [],
        installmentItems: [],
        investmentItems: [],
        monthlyExpenseItems: [createMonthlyExpenseItem()],
        personPaymentItems: [],
      },
      '2026-6'
    );

    expect(data.monthlyExpenseItems).toHaveLength(1);
    expect(data.summary.monthlyExpenseTotal).toBe(20);
    expect(data.summary.remainingTotal).toBe(4980);
  });

  it('keeps monthly expenses in history without subtracting them from later months', () => {
    const data = createMonthlyPlannerData(
      {
        incomeItems: [createIncomeItem({ competenceMonth: '2026-6' })],
        fixedExpenseItems: [],
        installmentItems: [],
        investmentItems: [],
        monthlyExpenseItems: [createMonthlyExpenseItem({ competenceMonth: '2026-6' })],
        personPaymentItems: [],
      },
      '2026-7'
    );

    expect(data.monthlyExpenseItems).toHaveLength(0);
    expect(data.summary.monthlyExpenseTotal).toBe(0);
    expect(data.summary.remainingTotal).toBe(5000);
  });
});
