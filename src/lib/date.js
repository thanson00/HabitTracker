// src/lib/date.js
export function toYMD(d) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  
  export function getMonthDays(year, monthIndex /* 0-11 */) {
    const first = new Date(year, monthIndex, 1);
    const days = [];
    let d = new Date(first);
    while (d.getMonth() === monthIndex) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }
  
  export function isWeekend(date) {
    const w = date.getDay(); // 0=Sun … 6=Sat
    return w === 0 || w === 6;
  }
  export function isWeekday(date) {
    return !isWeekend(date);
  }