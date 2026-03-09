import type { InstallmentItem } from './planner-types';

function normalizePaidInstallments(item: InstallmentItem) {
  return Math.min(Math.max(item.paidInstallments, 0), item.totalInstallments);
}

export function getInstallmentPaidAmount(item: InstallmentItem) {
  return item.amount * normalizePaidInstallments(item);
}

export function getInstallmentProgressPercentage(item: InstallmentItem) {
  if (item.totalInstallments <= 0) {
    return 0;
  }

  return (normalizePaidInstallments(item) / item.totalInstallments) * 100;
}

export function getInstallmentRemainingCount(item: InstallmentItem) {
  return Math.max(item.totalInstallments - normalizePaidInstallments(item), 0);
}

export function getInstallmentRemainingAmount(item: InstallmentItem) {
  return item.amount * getInstallmentRemainingCount(item);
}

export function getInstallmentCurrentNumber(item: InstallmentItem) {
  return Math.min(normalizePaidInstallments(item) + 1, item.totalInstallments);
}

export function isInstallmentCompleted(item: InstallmentItem) {
  return getInstallmentRemainingCount(item) === 0;
}
