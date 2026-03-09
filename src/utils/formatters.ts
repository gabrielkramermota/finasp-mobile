const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseMonthKey(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);

  return {
    month,
    year,
  };
}

export function formatCurrencyBRL(value: number) {
  return brlFormatter.format(value);
}

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}` as const;
}

export function compareMonthKeys(leftMonthKey: string, rightMonthKey: string) {
  const { month: leftMonth, year: leftYear } = parseMonthKey(leftMonthKey);
  const { month: rightMonth, year: rightYear } = parseMonthKey(rightMonthKey);

  if (leftYear !== rightYear) {
    return leftYear - rightYear;
  }

  return leftMonth - rightMonth;
}

export function formatMonthKeyLabel(monthKey: string) {
  const { month, year } = parseMonthKey(monthKey);
  const normalizedDate = new Date(year, month - 1, 1);
  const label = monthFormatter.format(normalizedDate);

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function shiftMonthKey(monthKey: string, amount: number) {
  const { month, year } = parseMonthKey(monthKey);
  const shiftedDate = new Date(year, month - 1 + amount, 1);

  return getMonthKey(shiftedDate);
}

export function isCurrentMonthKey(monthKey: string, referenceDate = new Date()) {
  return monthKey === getMonthKey(referenceDate);
}

export function getDateForMonthKeyDay(monthKey: string, dayOfMonth: number) {
  const { month, year } = parseMonthKey(monthKey);
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const safeDay = Math.max(1, Math.min(dayOfMonth, lastDayOfMonth));

  return new Date(year, month - 1, safeDay, 9, 0, 0, 0);
}

export function formatDayOfMonth(dayOfMonth: number) {
  return `Dia ${dayOfMonth.toString().padStart(2, '0')}`;
}

export function formatPercentage(value: number) {
  return `${percentageFormatter.format(value)}%`;
}
