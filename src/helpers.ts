export function prepareDate(dayDiff: number) {
  const date = new Date();

  date.setTime(date.getTime() + (dayDiff * 1000 * 60 * 60 * 24));

  return date;
}


export function paddy(subject: string, length: number, padChar = '0') {
  const pad = new Array(1 + length).join(padChar);
  return (pad + subject).slice(-pad.length);
}

export function formatDate(date: Date) {
  return paddy(String(date.getDate()), 2)
    + "/"
    + paddy(String(date.getMonth() + 1), 2)
    + "/"
    + date.getFullYear();
}