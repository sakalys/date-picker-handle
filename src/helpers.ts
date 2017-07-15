export function prepareDate(dayDiff: number) {
  const date = new Date();

  date.setTime(date.getTime() + (dayDiff * 1000 * 60 * 60 * 24));

  return date;
}
