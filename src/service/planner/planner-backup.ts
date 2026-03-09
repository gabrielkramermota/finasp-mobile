import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { db } from '../../storage/sqlite/client';
import {
  fixedExpenseItemsTable,
  incomeItemsTable,
  installmentItemsTable,
  investmentItemsTable,
  personPaymentItemsTable,
  userProfileTable,
} from '../../storage/sqlite/schema/finance-schema';

const backupDirectory = new Directory(Paths.document, 'backups');

function ensureBackupDirectory() {
  if (!backupDirectory.exists) {
    backupDirectory.create({
      idempotent: true,
      intermediates: true,
    });
  }

  return backupDirectory;
}

function createBackupFileName() {
  const date = new Date();
  const safeTimestamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    '-',
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ].join('');

  return `finasp-backup-${safeTimestamp}.json`;
}

export type PlannerBackupExportResult = {
  fileName: string;
  fileUri: string;
  shared: boolean;
};

export async function exportPlannerBackup(): Promise<PlannerBackupExportResult> {
  const [profile, incomeItems, fixedExpenseItems, installmentItems, investmentItems, personItems] =
    await Promise.all([
      db.select().from(userProfileTable).limit(1),
      db.select().from(incomeItemsTable),
      db.select().from(fixedExpenseItemsTable),
      db.select().from(installmentItemsTable),
      db.select().from(investmentItemsTable),
      db.select().from(personPaymentItemsTable),
    ]);

  const backupData = {
    exportedAt: new Date().toISOString(),
    profile: profile[0] ?? null,
    planner: {
      fixedExpenseItems,
      incomeItems,
      installmentItems,
      investmentItems,
      personPaymentItems: personItems,
    },
  };

  const fileName = createBackupFileName();
  const targetDirectory = ensureBackupDirectory();
  const backupFile = new File(targetDirectory, fileName);

  if (backupFile.exists) {
    backupFile.delete();
  }

  backupFile.write(JSON.stringify(backupData, null, 2));

  let shared = false;

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(backupFile.uri, {
      dialogTitle: 'Exportar backup do Finasp',
      mimeType: 'application/json',
      UTI: 'public.json',
    });
    shared = true;
  }

  return {
    fileName,
    fileUri: backupFile.uri,
    shared,
  };
}
