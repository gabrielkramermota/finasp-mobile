import {
  accountsTable,
  categoriesTable,
  entriesTable,
  fixedExpenseItemsTable,
  incomeItemsTable,
  installmentItemsTable,
  investmentItemsTable,
  personPaymentItemsTable,
  recurringEntriesTable,
} from '../schema/finance-schema';
import { db } from '../client';

export async function resetFinanceDatabase() {
  await db.delete(personPaymentItemsTable);
  await db.delete(investmentItemsTable);
  await db.delete(installmentItemsTable);
  await db.delete(fixedExpenseItemsTable);
  await db.delete(incomeItemsTable);
  await db.delete(entriesTable);
  await db.delete(recurringEntriesTable);
  await db.delete(categoriesTable);
  await db.delete(accountsTable);
}
