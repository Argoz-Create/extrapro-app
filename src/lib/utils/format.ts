export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}

export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5).replace(":", "h");
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)}–${formatTime(end)}`;
}

export function formatSalary(
  hourlyRate: number | null,
  dailyRate: number | null,
  flatRate?: number | null
): string {
  if (hourlyRate) return `${hourlyRate}\u20AC/h`;
  if (dailyRate) return `${dailyRate}\u20AC/jour`;
  if (flatRate) return `${flatRate}\u20AC (forfait)`;
  return "";
}

export function formatDateRange(startDate: string, endDate: string | null): string {
  const start = formatDate(startDate);
  if (!endDate || endDate === startDate) return start;
  const end = formatDate(endDate);
  return `${start} \u2192 ${end}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(".", ",") + "K";
  }
  return num.toString();
}
