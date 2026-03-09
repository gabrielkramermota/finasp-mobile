import type { PlannerSectionKey } from '../../domain/planner/planner-types';

export type PlannerTypeFilter = 'all' | PlannerSectionKey;
export type PlannerSortMode = 'recent' | 'alpha' | 'amount-desc' | 'due-day';

type SortablePlannerItem = {
  amount: number;
  createdAt: string;
  dueDay?: number;
  personName?: string;
  title?: string;
};

export const plannerTypeFilterOptions: {
  key: PlannerTypeFilter;
  label: string;
}[] = [
  { key: 'all', label: 'Todos' },
  { key: 'income', label: 'Renda' },
  { key: 'fixed-expense', label: 'Fixas' },
  { key: 'installment', label: 'Parcelas' },
  { key: 'person-payment', label: 'Pessoas' },
  { key: 'investment', label: 'Invest.' },
];

export const plannerSortOptions: {
  key: PlannerSortMode;
  label: string;
}[] = [
  { key: 'alpha', label: 'A-Z' },
  { key: 'amount-desc', label: 'Maior valor' },
  { key: 'due-day', label: 'Vencimento' },
  { key: 'recent', label: 'Recentes' },
];

function getPlannerItemLabel(item: SortablePlannerItem) {
  return (item.personName ?? item.title ?? '').trim().toLocaleLowerCase('pt-BR');
}

export function matchesPlannerTypeFilter(
  section: PlannerSectionKey,
  selectedType: PlannerTypeFilter
) {
  return selectedType === 'all' || selectedType === section;
}

export function sortPlannerItems<T extends SortablePlannerItem>(
  items: T[],
  sortMode: PlannerSortMode
) {
  return [...items].sort((leftItem, rightItem) => {
    if (sortMode === 'alpha') {
      return getPlannerItemLabel(leftItem).localeCompare(getPlannerItemLabel(rightItem), 'pt-BR');
    }

    if (sortMode === 'amount-desc') {
      if (rightItem.amount !== leftItem.amount) {
        return rightItem.amount - leftItem.amount;
      }

      return getPlannerItemLabel(leftItem).localeCompare(getPlannerItemLabel(rightItem), 'pt-BR');
    }

    if (sortMode === 'due-day') {
      const leftDueDay = leftItem.dueDay ?? 99;
      const rightDueDay = rightItem.dueDay ?? 99;

      if (leftDueDay !== rightDueDay) {
        return leftDueDay - rightDueDay;
      }

      return getPlannerItemLabel(leftItem).localeCompare(getPlannerItemLabel(rightItem), 'pt-BR');
    }

    return rightItem.createdAt.localeCompare(leftItem.createdAt);
  });
}
