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
  dailyRate: number | null
): string {
  if (hourlyRate) return `${hourlyRate}\u20AC/h`;
  if (dailyRate) return `${dailyRate}\u20AC/jour`;
  return "";
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
