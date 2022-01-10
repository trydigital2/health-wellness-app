/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Formats minutes into human readable text, e.g. "1h 15m" or "45 min"
 */
export function formatMinutesHuman(totalMinutes: number): string {
  if (isNaN(totalMinutes) || totalMinutes <= 0) return '0 min';
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${mins} min`;
}

/**
 * Formats number with thousands separator (e.g., 10000 -> "10,000")
 */
export function formatNumber(num: number): string {
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

/**
 * Formats date into friendly header string, e.g. "Tuesday, Oct 20"
 */
export function formatDateFriendly(dateStr?: string): string {
  try {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Today';
  }
}

/**
 * Formats date into short day format, e.g. "Oct 20, 2026"
 */
export function formatDateShort(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Returns a time-of-day greeting (Morning, Afternoon, Evening)
 */
export function getTimeGreeting(): string {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return 'Good morning';
  if (currentHour < 17) return 'Good afternoon';
  return 'Good evening';
}
