import { asc, desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '../../storage/sqlite/client';
import {
  fixedExpenseItemsTable,
  incomeItemsTable,
  installmentItemsTable,
  investmentItemsTable,
  monthlyExpenseItemsTable,
  personPaymentItemsTable,
} from '../../storage/sqlite/schema/finance-schema';
import { resetFinanceDatabase as resetDatabaseTables } from '../../storage/sqlite/seed/seed-finance-database';
import type { MonthKey } from '../../domain/finance/finance-types';
import type {
  CreateFixedExpenseItemInput,
  CreateIncomeItemInput,
  CreateInstallmentItemInput,
  CreateInvestmentItemInput,
  CreateMonthlyExpenseItemInput,
  CreatePersonPaymentItemInput,
  FixedExpenseItem,
  IncomeItem,
  InstallmentItem,
  InvestmentItem,
  MonthlyExpenseItem,
  MonthlyPlannerData,
  PlannerSectionKey,
  PersonPaymentItem,
  UpdateFixedExpenseItemInput,
  UpdateIncomeItemInput,
  UpdateInstallmentItemInput,
  UpdateInvestmentItemInput,
  UpdateMonthlyExpenseItemInput,
  UpdatePersonPaymentItemInput,
} from '../../domain/planner/planner-types';
import {
  cancelPersonPaymentReminder,
  schedulePersonPaymentReminder,
} from '../notifications/payment-reminders';
import { createMonthlyPlannerData } from './planner-selectors';

function getPlannerError(errors: (Error | undefined)[]) {
  return errors.find(Boolean);
}

function createTimestamp() {
  return new Date().toISOString();
}

function createRecordId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

export function useMonthlyPlannerData(selectedMonth: MonthKey) {
  const incomeItemsQuery = useLiveQuery(
    db.select().from(incomeItemsTable).orderBy(desc(incomeItemsTable.createdAt))
  );
  const fixedExpenseItemsQuery = useLiveQuery(
    db.select().from(fixedExpenseItemsTable).orderBy(desc(fixedExpenseItemsTable.createdAt))
  );
  const installmentItemsQuery = useLiveQuery(
    db
      .select()
      .from(installmentItemsTable)
      .orderBy(asc(installmentItemsTable.dueDay), desc(installmentItemsTable.createdAt))
  );
  const investmentItemsQuery = useLiveQuery(
    db.select().from(investmentItemsTable).orderBy(desc(investmentItemsTable.createdAt))
  );
  const monthlyExpenseItemsQuery = useLiveQuery(
    db.select().from(monthlyExpenseItemsTable).orderBy(desc(monthlyExpenseItemsTable.createdAt))
  );
  const personPaymentItemsQuery = useLiveQuery(
    db
      .select()
      .from(personPaymentItemsTable)
      .orderBy(
        asc(personPaymentItemsTable.dueDay),
        asc(personPaymentItemsTable.personName),
        desc(personPaymentItemsTable.createdAt)
      )
  );

  const data: MonthlyPlannerData = createMonthlyPlannerData(
    {
      incomeItems: (incomeItemsQuery.data ?? []) as IncomeItem[],
      fixedExpenseItems: (fixedExpenseItemsQuery.data ?? []) as FixedExpenseItem[],
      installmentItems: (installmentItemsQuery.data ?? []) as InstallmentItem[],
      investmentItems: (investmentItemsQuery.data ?? []) as InvestmentItem[],
      monthlyExpenseItems: (monthlyExpenseItemsQuery.data ?? []) as MonthlyExpenseItem[],
      personPaymentItems: (personPaymentItemsQuery.data ?? []) as PersonPaymentItem[],
    },
    selectedMonth
  );

  return {
    data,
    error: getPlannerError([
      incomeItemsQuery.error,
      fixedExpenseItemsQuery.error,
      installmentItemsQuery.error,
      investmentItemsQuery.error,
      monthlyExpenseItemsQuery.error,
      personPaymentItemsQuery.error,
    ]),
  };
}

export function usePlannerSettingsData() {
  const incomeItemsQuery = useLiveQuery(db.select().from(incomeItemsTable));
  const fixedExpenseItemsQuery = useLiveQuery(db.select().from(fixedExpenseItemsTable));
  const installmentItemsQuery = useLiveQuery(db.select().from(installmentItemsTable));
  const investmentItemsQuery = useLiveQuery(db.select().from(investmentItemsTable));
  const monthlyExpenseItemsQuery = useLiveQuery(db.select().from(monthlyExpenseItemsTable));
  const personPaymentItemsQuery = useLiveQuery(db.select().from(personPaymentItemsTable));

  return {
    counts: {
      incomeItems: incomeItemsQuery.data?.length ?? 0,
      fixedExpenseItems: fixedExpenseItemsQuery.data?.length ?? 0,
      installmentItems: installmentItemsQuery.data?.length ?? 0,
      investmentItems: investmentItemsQuery.data?.length ?? 0,
      monthlyExpenseItems: monthlyExpenseItemsQuery.data?.length ?? 0,
      personPaymentItems: personPaymentItemsQuery.data?.length ?? 0,
    },
    error: getPlannerError([
      incomeItemsQuery.error,
      fixedExpenseItemsQuery.error,
      installmentItemsQuery.error,
      investmentItemsQuery.error,
      monthlyExpenseItemsQuery.error,
      personPaymentItemsQuery.error,
    ]),
  };
}

export async function createIncomeItem({
  competenceMonth,
  title,
  amount,
  sourceType,
}: CreateIncomeItemInput) {
  const timestamp = createTimestamp();

  await db.insert(incomeItemsTable).values({
    id: createRecordId('income'),
    title,
    amount,
    competenceMonth,
    sourceType,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function updateIncomeItem({ id, title, amount, sourceType }: UpdateIncomeItemInput) {
  await db
    .update(incomeItemsTable)
    .set({
      amount,
      sourceType,
      title,
      updatedAt: createTimestamp(),
    })
    .where(eq(incomeItemsTable.id, id));
}

export async function createFixedExpenseItem({
  competenceMonth,
  title,
  amount,
}: CreateFixedExpenseItemInput) {
  const timestamp = createTimestamp();

  await db.insert(fixedExpenseItemsTable).values({
    id: createRecordId('fixed-expense'),
    title,
    amount,
    competenceMonth,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function updateFixedExpenseItem({ id, title, amount }: UpdateFixedExpenseItemInput) {
  await db
    .update(fixedExpenseItemsTable)
    .set({
      amount,
      title,
      updatedAt: createTimestamp(),
    })
    .where(eq(fixedExpenseItemsTable.id, id));
}

export async function createInstallmentItem({
  competenceMonth,
  title,
  amount,
  dueDay,
  referenceLabel,
  totalInstallments,
}: CreateInstallmentItemInput) {
  const timestamp = createTimestamp();

  await db.insert(installmentItemsTable).values({
    id: createRecordId('installment'),
    title,
    amount,
    competenceMonth,
    dueDay,
    paidInstallments: 0,
    referenceLabel: referenceLabel?.trim() || null,
    totalInstallments,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function updateInstallmentItem({
  id,
  title,
  amount,
  dueDay,
  referenceLabel,
  totalInstallments,
}: UpdateInstallmentItemInput) {
  const installment = await db
    .select()
    .from(installmentItemsTable)
    .where(eq(installmentItemsTable.id, id))
    .limit(1);

  const currentInstallment = installment[0] as InstallmentItem | undefined;

  if (!currentInstallment) {
    throw new Error('Parcela nao encontrada.');
  }

  if (totalInstallments < currentInstallment.paidInstallments) {
    throw new Error('O total nao pode ser menor que a quantidade ja paga.');
  }

  await db
    .update(installmentItemsTable)
    .set({
      amount,
      dueDay,
      referenceLabel: referenceLabel?.trim() || null,
      title,
      totalInstallments,
      updatedAt: createTimestamp(),
    })
    .where(eq(installmentItemsTable.id, id));
}

export async function advanceInstallmentPayment(id: string) {
  const installment = await db
    .select()
    .from(installmentItemsTable)
    .where(eq(installmentItemsTable.id, id))
    .limit(1);

  const currentInstallment = installment[0] as InstallmentItem | undefined;

  if (!currentInstallment) {
    throw new Error('Parcela nao encontrada.');
  }

  if (currentInstallment.paidInstallments >= currentInstallment.totalInstallments) {
    throw new Error('Essa parcela ja foi concluida.');
  }

  await db
    .update(installmentItemsTable)
    .set({
      paidInstallments: currentInstallment.paidInstallments + 1,
      updatedAt: createTimestamp(),
    })
    .where(eq(installmentItemsTable.id, id));
}

export async function createInvestmentItem({
  competenceMonth,
  title,
  amount,
  investmentType,
}: CreateInvestmentItemInput) {
  const timestamp = createTimestamp();

  await db.insert(investmentItemsTable).values({
    id: createRecordId('investment'),
    title,
    amount,
    competenceMonth,
    investmentType,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function updateInvestmentItem({
  id,
  title,
  amount,
  investmentType,
}: UpdateInvestmentItemInput) {
  await db
    .update(investmentItemsTable)
    .set({
      amount,
      investmentType,
      title,
      updatedAt: createTimestamp(),
    })
    .where(eq(investmentItemsTable.id, id));
}

export async function createMonthlyExpenseItem({
  competenceMonth,
  title,
  amount,
}: CreateMonthlyExpenseItemInput) {
  const timestamp = createTimestamp();

  await db.insert(monthlyExpenseItemsTable).values({
    id: createRecordId('monthly-expense'),
    title,
    amount,
    competenceMonth,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function updateMonthlyExpenseItem({
  id,
  title,
  amount,
}: UpdateMonthlyExpenseItemInput) {
  await db
    .update(monthlyExpenseItemsTable)
    .set({
      amount,
      title,
      updatedAt: createTimestamp(),
    })
    .where(eq(monthlyExpenseItemsTable.id, id));
}

export async function createPersonPaymentItem({
  competenceMonth,
  personName,
  amount,
  dueDay,
  description,
}: CreatePersonPaymentItemInput) {
  const timestamp = createTimestamp();
  const id = createRecordId('person-payment');

  await db.insert(personPaymentItemsTable).values({
    id,
    personName,
    amount,
    competenceMonth,
    dueDay,
    description: description?.trim() || null,
    isPaid: false,
    notificationId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const reminderResult = await schedulePersonPaymentReminder({
    amount,
    competenceMonth,
    description,
    dueDay,
    personName,
  });

  if (reminderResult.notificationId) {
    await db
      .update(personPaymentItemsTable)
      .set({
        notificationId: reminderResult.notificationId,
        updatedAt: createTimestamp(),
      })
      .where(eq(personPaymentItemsTable.id, id));
  }

  return reminderResult;
}

export async function updatePersonPaymentItem({
  id,
  personName,
  amount,
  dueDay,
  description,
}: UpdatePersonPaymentItemInput) {
  const personPayment = await db
    .select()
    .from(personPaymentItemsTable)
    .where(eq(personPaymentItemsTable.id, id))
    .limit(1);

  const currentPersonPayment = personPayment[0] as PersonPaymentItem | undefined;

  if (!currentPersonPayment) {
    throw new Error('Pagamento para pessoa nao encontrado.');
  }

  await cancelPersonPaymentReminder(currentPersonPayment.notificationId);

  let reminderResult: Awaited<ReturnType<typeof schedulePersonPaymentReminder>> | null = null;

  if (!currentPersonPayment.isPaid) {
    reminderResult = await schedulePersonPaymentReminder({
      amount,
      competenceMonth: currentPersonPayment.competenceMonth,
      description,
      dueDay,
      personName,
    });
  }

  await db
    .update(personPaymentItemsTable)
    .set({
      amount,
      description: description?.trim() || null,
      dueDay,
      notificationId: reminderResult?.notificationId ?? null,
      personName,
      updatedAt: createTimestamp(),
    })
    .where(eq(personPaymentItemsTable.id, id));

  return reminderResult;
}

export async function togglePersonPaymentPaidStatus(id: string) {
  const personPayment = await db
    .select()
    .from(personPaymentItemsTable)
    .where(eq(personPaymentItemsTable.id, id))
    .limit(1);

  const currentPersonPayment = personPayment[0] as PersonPaymentItem | undefined;

  if (!currentPersonPayment) {
    throw new Error('Pagamento para pessoa nao encontrado.');
  }

  if (!currentPersonPayment.isPaid) {
    await cancelPersonPaymentReminder(currentPersonPayment.notificationId);

    await db
      .update(personPaymentItemsTable)
      .set({
        isPaid: true,
        notificationId: null,
        updatedAt: createTimestamp(),
      })
      .where(eq(personPaymentItemsTable.id, id));

    return null;
  }

  const reminderResult = await schedulePersonPaymentReminder({
    amount: currentPersonPayment.amount,
    competenceMonth: currentPersonPayment.competenceMonth,
    description: currentPersonPayment.description ?? undefined,
    dueDay: currentPersonPayment.dueDay,
    personName: currentPersonPayment.personName,
  });

  await db
    .update(personPaymentItemsTable)
    .set({
      isPaid: false,
      notificationId: reminderResult.notificationId,
      updatedAt: createTimestamp(),
    })
    .where(eq(personPaymentItemsTable.id, id));

  return reminderResult;
}

export async function deletePlannerItem(section: PlannerSectionKey, id: string) {
  if (section === 'income') {
    await db.delete(incomeItemsTable).where(eq(incomeItemsTable.id, id));
    return;
  }

  if (section === 'fixed-expense') {
    await db.delete(fixedExpenseItemsTable).where(eq(fixedExpenseItemsTable.id, id));
    return;
  }

  if (section === 'installment') {
    await db.delete(installmentItemsTable).where(eq(installmentItemsTable.id, id));
    return;
  }

  if (section === 'person-payment') {
    const personPayment = await db
      .select()
      .from(personPaymentItemsTable)
      .where(eq(personPaymentItemsTable.id, id))
      .limit(1);

    await cancelPersonPaymentReminder(personPayment[0]?.notificationId);
    await db.delete(personPaymentItemsTable).where(eq(personPaymentItemsTable.id, id));
    return;
  }

  if (section === 'monthly-expense') {
    await db.delete(monthlyExpenseItemsTable).where(eq(monthlyExpenseItemsTable.id, id));
    return;
  }

  await db.delete(investmentItemsTable).where(eq(investmentItemsTable.id, id));
}

export async function resetPlannerDatabase() {
  const scheduledReminders = await db
    .select({
      notificationId: personPaymentItemsTable.notificationId,
    })
    .from(personPaymentItemsTable);

  await Promise.all(
    scheduledReminders.map((reminder) => cancelPersonPaymentReminder(reminder.notificationId))
  );

  await resetDatabaseTables();
}
