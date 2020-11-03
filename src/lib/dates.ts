const rtf = new Intl.RelativeTimeFormat('en', { style: 'long' });

export function formatDate(date: Date, relative = false): string {
  const diff = computeDaysDiff(date);

  if (relative && diff === 0) {
    return 'today';
  } else if (relative && diff >= -7 && diff < 0) {
    return rtf.format(diff, 'day');
  } else {
    return sliceDateToDay(date);
  }
}

function sliceDateToDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function computeDaysDiff(date: Date) {
  const today = new Date(sliceDateToDay(new Date()));
  const targetDate = new Date(sliceDateToDay(date));

  const millisDiff = targetDate.getTime() - today.getTime();
  const daysDiff = millisDiff / 1000 / 60 / 60 / 24;

  return daysDiff >= 0 ? Math.floor(daysDiff) : Math.ceil(daysDiff);
}
