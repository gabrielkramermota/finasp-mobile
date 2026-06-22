import { sqlite } from './client';

const bootstrapStatements = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    initial_balance REAL NOT NULL DEFAULT 0,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL,
    color_token TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recurring_entries (
    id TEXT PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    kind TEXT NOT NULL,
    day_of_month INTEGER NOT NULL,
    account_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    starts_at TEXT NOT NULL,
    ends_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    kind TEXT NOT NULL,
    status TEXT NOT NULL,
    occurred_on TEXT NOT NULL,
    competence_month TEXT NOT NULL,
    account_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    recurring_entry_id TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (recurring_entry_id) REFERENCES recurring_entries(id)
  );

  CREATE TABLE IF NOT EXISTS income_items (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    competence_month TEXT NOT NULL,
    source_type TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fixed_expense_items (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    competence_month TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS installment_items (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    competence_month TEXT NOT NULL,
    due_day INTEGER NOT NULL DEFAULT 1,
    paid_installments INTEGER NOT NULL DEFAULT 0,
    reference_label TEXT,
    total_installments INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS investment_items (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    competence_month TEXT NOT NULL,
    investment_type TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS monthly_expense_items (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    competence_month TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS person_payment_items (
    id TEXT PRIMARY KEY NOT NULL,
    person_name TEXT NOT NULL,
    amount REAL NOT NULL,
    competence_month TEXT NOT NULL,
    due_day INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    is_paid INTEGER NOT NULL DEFAULT 0,
    notification_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_profile (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    photo_uri TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_income_items_month ON income_items(competence_month);
  CREATE INDEX IF NOT EXISTS idx_fixed_expense_items_month ON fixed_expense_items(competence_month);
  CREATE INDEX IF NOT EXISTS idx_installment_items_month ON installment_items(competence_month);
  CREATE INDEX IF NOT EXISTS idx_investment_items_month ON investment_items(competence_month);
  CREATE INDEX IF NOT EXISTS idx_monthly_expense_items_month ON monthly_expense_items(competence_month);
  CREATE INDEX IF NOT EXISTS idx_person_payment_items_month ON person_payment_items(competence_month);
`;

let hasBootstrapped = false;

export function bootstrapFinanceDatabase() {
  if (hasBootstrapped) {
    return;
  }

  sqlite.execSync(bootstrapStatements);
  hasBootstrapped = true;
}
