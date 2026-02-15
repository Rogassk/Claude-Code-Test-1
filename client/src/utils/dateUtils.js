import { format, isToday, isTomorrow, isYesterday, isPast, parseISO, differenceInDays } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';

  const diff = differenceInDays(date, new Date());
  if (diff > 0 && diff <= 7) return format(date, 'EEEE');
  return format(date, 'MMM d, yyyy');
}

export function isOverdue(dateStr, status) {
  if (!dateStr || status === 'completed') return false;
  return isPast(parseISO(dateStr + 'T23:59:59'));
}

export function isDueToday(dateStr) {
  if (!dateStr) return false;
  return isToday(parseISO(dateStr));
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  return format(parseISO(dateStr), 'MMM d, yyyy h:mm a');
}
