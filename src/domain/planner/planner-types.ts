import type { MonthKey } from '../finance/finance-types';

export type PlannerSectionKey =
  | 'income'
  | 'fixed-expense'
  | 'installment'
  | 'investment'
  | 'person-payment';
export type IncomeSourceType = 'salary' | 'extra' | 'dividend' | 'other';
export type InvestmentType = 'reserve' | 'investment';

type PlannerBaseItem = {
  id: string;
  title: string;
  amount: number;
  competenceMonth: MonthKey;
  createdAt: string;
  updatedAt: string;
};

export type IncomeItem = PlannerBaseItem & {
  sourceType: IncomeSourceType;
};

export type FixedExpenseItem = PlannerBaseItem;

export type InstallmentItem = PlannerBaseItem & {
  dueDay: number;
  paidInstallments: number;
  referenceLabel?: string | null;
  totalInstallments: number;
};

export type InvestmentItem = PlannerBaseItem & {
  investmentType: InvestmentType;
};

export type PersonPaymentItem = PlannerBaseItem & {
  description?: string | null;
  dueDay: number;
  isPaid: boolean;
  notificationId?: string | null;
  personName: string;
};

export type MonthlyPlannerSummary = {
  committedExpenseTotal: number;
  incomeTotal: number;
  fixedExpenseTotal: number;
  installmentTotal: number;
  investmentTotal: number;
  personPaymentTotal: number;
  expenseTotal: number;
  spentPercentage: number;
  remainingPercentage: number;
  remainingTotal: number;
};

export type MonthlyPlannerData = {
  selectedMonth: MonthKey;
  selectedMonthLabel: string;
  incomeItems: IncomeItem[];
  fixedExpenseItems: FixedExpenseItem[];
  installmentItems: InstallmentItem[];
  investmentItems: InvestmentItem[];
  personPaymentItems: PersonPaymentItem[];
  summary: MonthlyPlannerSummary;
};

export type CreateIncomeItemInput = {
  competenceMonth: MonthKey;
  title: string;
  amount: number;
  sourceType: IncomeSourceType;
};

export type UpdateIncomeItemInput = {
  id: string;
  title: string;
  amount: number;
  sourceType: IncomeSourceType;
};

export type CreateFixedExpenseItemInput = {
  competenceMonth: MonthKey;
  title: string;
  amount: number;
};

export type UpdateFixedExpenseItemInput = {
  id: string;
  title: string;
  amount: number;
};

export type CreateInstallmentItemInput = {
  competenceMonth: MonthKey;
  title: string;
  amount: number;
  dueDay: number;
  referenceLabel?: string;
  totalInstallments: number;
};

export type UpdateInstallmentItemInput = {
  id: string;
  title: string;
  amount: number;
  dueDay: number;
  referenceLabel?: string;
  totalInstallments: number;
};

export type CreateInvestmentItemInput = {
  competenceMonth: MonthKey;
  title: string;
  amount: number;
  investmentType: InvestmentType;
};

export type UpdateInvestmentItemInput = {
  id: string;
  title: string;
  amount: number;
  investmentType: InvestmentType;
};

export type CreatePersonPaymentItemInput = {
  competenceMonth: MonthKey;
  personName: string;
  amount: number;
  dueDay: number;
  description?: string;
};

export type UpdatePersonPaymentItemInput = {
  id: string;
  personName: string;
  amount: number;
  dueDay: number;
  description?: string;
};
