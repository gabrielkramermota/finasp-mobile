# Gastos Do Mes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one-off monthly expenses with month history so daily spending reduces only the selected month's remaining value.

**Architecture:** Add a `monthly_expense_items` SQLite table and thread it through the existing planner repository/selectors/pages. Monthly expenses are scoped to `competenceMonth === selectedMonth`, unlike recurring income/fixed expenses/investments that remain active from their start month.

**Tech Stack:** Expo React Native, TypeScript, Drizzle SQLite schema, Vitest.

---

### Task 1: Monthly Expense Calculation

**Files:**

- Modify: `src/domain/planner/planner-types.ts`
- Modify: `src/service/planner/planner-selectors.ts`
- Test: `src/service/planner/planner-selectors.test.ts`

- [ ] Add `MonthlyExpenseItem` and `monthlyExpenseTotal` to planner types.
- [ ] Write a failing Vitest case where a June monthly expense reduces June remaining total.
- [ ] Write a failing Vitest case where the same June expense does not affect July.
- [ ] Update `createMonthlyPlannerData` and `buildSummary` to include only selected-month monthly expenses.
- [ ] Run `npx.cmd vitest run src/service/planner/planner-selectors.test.ts`.

### Task 2: SQLite And Repository

**Files:**

- Modify: `src/storage/sqlite/schema/finance-schema.ts`
- Modify: `src/storage/sqlite/bootstrap-finance-database.ts`
- Modify: `src/storage/sqlite/seed/seed-finance-database.ts`
- Modify: `src/service/planner/planner-repository.ts`

- [ ] Add `monthlyExpenseItemsTable` with id, title, amount, competence month, created/updated timestamps.
- [ ] Add bootstrap create table and month index statements.
- [ ] Include the table in reset/backup-relevant table lists through existing schema exports.
- [ ] Add live query, create/update/delete handling, and counts support for monthly expenses.

### Task 3: UI Integration

**Files:**

- Modify: `src/service/planner/planner-view.ts`
- Modify: `src/app/entries/EntriesPage.tsx`
- Modify: `src/app/dashboard/DashboardPage.tsx`
- Modify: `src/app/recurring-entries/RecurringEntriesPage.tsx`
- Modify: `src/components/planner/PlannerItemEditorCard.tsx`

- [ ] Add filter option `Gastos`.
- [ ] Add "Adicionar gasto do mes" form with name and amount.
- [ ] Show monthly expense total in quick summary and dashboard cards.
- [ ] Include monthly expenses in biggest expenses and list sections.
- [ ] Support edit and delete for monthly expenses.

### Task 4: Verification

**Files:**

- Project-wide verification.

- [ ] Run `npx.cmd vitest run src/service/planner/planner-selectors.test.ts`.
- [ ] Run `npx.cmd tsc --noEmit`.
- [ ] Run `npm.cmd run lint`.
- [ ] Report any warnings separately from failures.
