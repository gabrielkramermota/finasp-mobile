import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accountsTable = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', {
    enum: ['checking', 'savings', 'cash', 'credit-card'],
  }).notNull(),
  initialBalance: real('initial_balance').notNull().default(0),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const categoriesTable = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  kind: text('kind', { enum: ['income', 'expense'] }).notNull(),
  colorToken: text('color_token').notNull(),
  icon: text('icon').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const recurringEntriesTable = sqliteTable('recurring_entries', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  kind: text('kind', { enum: ['income', 'expense'] }).notNull(),
  dayOfMonth: integer('day_of_month').notNull(),
  accountId: text('account_id')
    .notNull()
    .references(() => accountsTable.id),
  categoryId: text('category_id')
    .notNull()
    .references(() => categoriesTable.id),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  startsAt: text('starts_at').notNull(),
  endsAt: text('ends_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const entriesTable = sqliteTable('entries', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  kind: text('kind', { enum: ['income', 'expense'] }).notNull(),
  status: text('status', { enum: ['pending', 'paid', 'received'] }).notNull(),
  occurredOn: text('occurred_on').notNull(),
  competenceMonth: text('competence_month').notNull(),
  accountId: text('account_id')
    .notNull()
    .references(() => accountsTable.id),
  categoryId: text('category_id')
    .notNull()
    .references(() => categoriesTable.id),
  recurringEntryId: text('recurring_entry_id').references(() => recurringEntriesTable.id),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const incomeItemsTable = sqliteTable('income_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  competenceMonth: text('competence_month').notNull(),
  sourceType: text('source_type', {
    enum: ['salary', 'extra', 'dividend', 'other'],
  }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const fixedExpenseItemsTable = sqliteTable('fixed_expense_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  competenceMonth: text('competence_month').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const installmentItemsTable = sqliteTable('installment_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  competenceMonth: text('competence_month').notNull(),
  dueDay: integer('due_day').notNull().default(1),
  paidInstallments: integer('paid_installments').notNull().default(0),
  referenceLabel: text('reference_label'),
  totalInstallments: integer('total_installments').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const investmentItemsTable = sqliteTable('investment_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  competenceMonth: text('competence_month').notNull(),
  investmentType: text('investment_type', {
    enum: ['reserve', 'investment'],
  }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const monthlyExpenseItemsTable = sqliteTable('monthly_expense_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  competenceMonth: text('competence_month').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const personPaymentItemsTable = sqliteTable('person_payment_items', {
  id: text('id').primaryKey(),
  personName: text('person_name').notNull(),
  amount: real('amount').notNull(),
  competenceMonth: text('competence_month').notNull(),
  dueDay: integer('due_day').notNull().default(1),
  description: text('description'),
  isPaid: integer('is_paid', { mode: 'boolean' }).notNull().default(false),
  notificationId: text('notification_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const userProfileTable = sqliteTable('user_profile', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  photoUri: text('photo_uri'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const accountRelations = relations(accountsTable, ({ many }) => ({
  entries: many(entriesTable),
  recurringEntries: many(recurringEntriesTable),
}));

export const categoryRelations = relations(categoriesTable, ({ many }) => ({
  entries: many(entriesTable),
  recurringEntries: many(recurringEntriesTable),
}));

export const recurringEntryRelations = relations(recurringEntriesTable, ({ one, many }) => ({
  account: one(accountsTable, {
    fields: [recurringEntriesTable.accountId],
    references: [accountsTable.id],
  }),
  category: one(categoriesTable, {
    fields: [recurringEntriesTable.categoryId],
    references: [categoriesTable.id],
  }),
  entries: many(entriesTable),
}));

export const entryRelations = relations(entriesTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [entriesTable.accountId],
    references: [accountsTable.id],
  }),
  category: one(categoriesTable, {
    fields: [entriesTable.categoryId],
    references: [categoriesTable.id],
  }),
  recurringEntry: one(recurringEntriesTable, {
    fields: [entriesTable.recurringEntryId],
    references: [recurringEntriesTable.id],
  }),
}));

export const financeSchema = {
  accountsTable,
  categoriesTable,
  entriesTable,
  recurringEntriesTable,
  incomeItemsTable,
  fixedExpenseItemsTable,
  installmentItemsTable,
  investmentItemsTable,
  monthlyExpenseItemsTable,
  personPaymentItemsTable,
  userProfileTable,
};
