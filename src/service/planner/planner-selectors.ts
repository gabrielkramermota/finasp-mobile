import type { MonthKey } from '../../domain/finance/finance-types';
import { isInstallmentCompleted } from '../../domain/planner/installment-progress';
import type {
  FixedExpenseItem,
  IncomeItem,
  InstallmentItem,
  InvestmentItem,
  MonthlyExpenseItem,
  MonthlyPlannerData,
  MonthlyPlannerSummary,
  PersonPaymentItem,
} from '../../domain/planner/planner-types';
import { compareMonthKeys, formatMonthKeyLabel } from '../../utils/formatters';

type PlannerDataSet = {
  incomeItems: IncomeItem[];
  fixedExpenseItems: FixedExpenseItem[];
  installmentItems: InstallmentItem[];
  investmentItems: InvestmentItem[];
  monthlyExpenseItems: MonthlyExpenseItem[];
  personPaymentItems: PersonPaymentItem[];
};

function isActiveFromMonth(itemMonth: MonthKey, selectedMonth: MonthKey) {
  return compareMonthKeys(itemMonth, selectedMonth) <= 0;
}

function buildSummary({
  incomeItems,
  fixedExpenseItems,
  installmentItems,
  investmentItems,
  monthlyExpenseItems,
  personPaymentItems,
}: {
  incomeItems: IncomeItem[];
  fixedExpenseItems: FixedExpenseItem[];
  installmentItems: InstallmentItem[];
  investmentItems: InvestmentItem[];
  monthlyExpenseItems: MonthlyExpenseItem[];
  personPaymentItems: PersonPaymentItem[];
}): MonthlyPlannerSummary {
  const incomeTotal = incomeItems.reduce((total, item) => total + item.amount, 0);
  const fixedExpenseTotal = fixedExpenseItems.reduce((total, item) => total + item.amount, 0);
  const installmentTotal = installmentItems.reduce((total, item) => total + item.amount, 0);
  const investmentTotal = investmentItems.reduce((total, item) => total + item.amount, 0);
  const monthlyExpenseTotal = monthlyExpenseItems.reduce((total, item) => total + item.amount, 0);
  const personPaymentTotal = personPaymentItems.reduce((total, item) => total + item.amount, 0);
  const committedExpenseTotal =
    fixedExpenseTotal + installmentTotal + monthlyExpenseTotal + personPaymentTotal;
  const expenseTotal = committedExpenseTotal + investmentTotal;
  const remainingTotal = incomeTotal - expenseTotal;

  if (incomeTotal <= 0) {
    return {
      committedExpenseTotal,
      incomeTotal,
      fixedExpenseTotal,
      installmentTotal,
      investmentTotal,
      monthlyExpenseTotal,
      personPaymentTotal,
      expenseTotal,
      spentPercentage: 0,
      remainingPercentage: 0,
      remainingTotal,
    };
  }

  return {
    committedExpenseTotal,
    incomeTotal,
    fixedExpenseTotal,
    installmentTotal,
    investmentTotal,
    monthlyExpenseTotal,
    personPaymentTotal,
    expenseTotal,
    spentPercentage: (expenseTotal / incomeTotal) * 100,
    remainingPercentage: (remainingTotal / incomeTotal) * 100,
    remainingTotal,
  };
}

export function createMonthlyPlannerData(
  data: PlannerDataSet,
  selectedMonth: MonthKey
): MonthlyPlannerData {
  const monthData = {
    incomeItems: data.incomeItems.filter((item) =>
      isActiveFromMonth(item.competenceMonth, selectedMonth)
    ),
    fixedExpenseItems: data.fixedExpenseItems.filter((item) =>
      isActiveFromMonth(item.competenceMonth, selectedMonth)
    ),
    installmentItems: data.installmentItems.filter(
      (item) =>
        isActiveFromMonth(item.competenceMonth, selectedMonth) && !isInstallmentCompleted(item)
    ),
    investmentItems: data.investmentItems.filter((item) =>
      isActiveFromMonth(item.competenceMonth, selectedMonth)
    ),
    monthlyExpenseItems: data.monthlyExpenseItems.filter(
      (item) => item.competenceMonth === selectedMonth
    ),
    personPaymentItems: data.personPaymentItems.filter(
      (item) => item.competenceMonth === selectedMonth
    ),
  };

  return {
    selectedMonth,
    selectedMonthLabel: formatMonthKeyLabel(selectedMonth),
    ...monthData,
    summary: buildSummary(monthData),
  };
}
