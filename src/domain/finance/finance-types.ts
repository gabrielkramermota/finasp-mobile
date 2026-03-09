export type MonthKey = `${number}-${number}`;

export type EntryKind = 'income' | 'expense';
export type EntryStatus = 'pending' | 'paid' | 'received';
export type AccountType = 'checking' | 'savings' | 'cash' | 'credit-card';

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  isArchived: boolean;
};

export type Category = {
  id: string;
  name: string;
  kind: EntryKind;
  colorToken: string;
  icon: string;
};

export type Entry = {
  id: string;
  description: string;
  amount: number;
  kind: EntryKind;
  status: EntryStatus;
  occurredOn: string;
  competenceMonth: MonthKey;
  accountId: string;
  categoryId: string;
  recurringEntryId?: string;
  notes?: string;
};

export type RecurringEntry = {
  id: string;
  description: string;
  amount: number;
  kind: EntryKind;
  dayOfMonth: number;
  accountId: string;
  categoryId: string;
  isActive: boolean;
  startsAt: string;
  endsAt?: string;
};

export type MonthlySnapshot = {
  month: MonthKey;
  openingBalance: number;
  currentBalance: number;
  projectedBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalReceivedIncome: number;
  totalPaidExpense: number;
  totalPendingExpense: number;
  totalPendingIncome: number;
  totalFixedExpense: number;
  pendingCount: number;
};

export type UpcomingRecurringEntry = RecurringEntry & {
  status: EntryStatus;
  matchedEntryId?: string;
  dueLabel: string;
};

export type FinanceDataSet = {
  selectedMonth: MonthKey;
  accounts: Account[];
  categories: Category[];
  entries: Entry[];
  recurringEntries: RecurringEntry[];
};

export type FinanceDashboardData = {
  selectedMonth: MonthKey;
  selectedMonthLabel: string;
  snapshot: MonthlySnapshot;
  accounts: Account[];
  categories: Category[];
  monthEntries: Entry[];
  activeRecurringEntries: RecurringEntry[];
  recentEntries: Entry[];
  upcomingRecurringEntries: UpcomingRecurringEntry[];
};

export type CreateEntryInput = {
  description: string;
  amount: number;
  kind: EntryKind;
  accountId: string;
  categoryId: string;
};
