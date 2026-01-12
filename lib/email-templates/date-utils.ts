/**
 * Date formatting utilities for email templates
 * All deadlines default to 11:59 PM EST
 */

export interface DateFormats {
  short: string;           // "October 1st"
  full: string;            // "WEDNESDAY 10/1 AT 11:59PM"
  withTime: string;        // "October 1st, at 11:59 PM EST"
  casual: string;          // "October 1st by 11:59 PM"
  dayOfWeek: string;       // "Saturday"
  dayOfWeekFull: string;   // "Saturday, October 4th"
  monthDay: string;        // "10/1"
  shortMonth: string;      // "Oct 4th"
}

export interface EventDateFormats {
  single: string;          // "October 4th"
  singleFull: string;      // "Saturday, October 4th"
  range: string;           // "November 15th and 16th" or "November 15th and November 22nd"
  rangeFull: string;       // "Saturday, November 15th and Sunday, November 16th"
  rangeShort: string;      // "Nov 15-16th" or "Nov 15th & 22nd"
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, 4th, etc.)
 */
function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Format a number with its ordinal suffix
 */
function formatOrdinal(n: number): string {
  return `${n}${getOrdinalSuffix(n)}`;
}

/**
 * Compute all date format variations from a Date object
 */
export function computeDateFormats(date: Date | null): DateFormats | null {
  if (!date) return null;

  const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
  const month = MONTHS[date.getMonth()];
  const monthShort = MONTHS_SHORT[date.getMonth()];
  const day = date.getDate();
  const dayOrdinal = formatOrdinal(day);
  const monthNum = date.getMonth() + 1;

  return {
    short: `${month} ${dayOrdinal}`,                                    // "October 1st"
    full: `${dayOfWeek.toUpperCase()} ${monthNum}/${day} AT 11:59PM`,   // "WEDNESDAY 10/1 AT 11:59PM"
    withTime: `${month} ${dayOrdinal}, at 11:59 PM EST`,                // "October 1st, at 11:59 PM EST"
    casual: `${month} ${dayOrdinal} by 11:59 PM`,                       // "October 1st by 11:59 PM"
    dayOfWeek: dayOfWeek,                                               // "Saturday"
    dayOfWeekFull: `${dayOfWeek}, ${month} ${dayOrdinal}`,              // "Saturday, October 4th"
    monthDay: `${monthNum}/${day}`,                                     // "10/1"
    shortMonth: `${monthShort} ${dayOrdinal}`,                          // "Oct 4th"
  };
}

/**
 * Compute event date formats for single or two-day events
 */
export function computeEventDateFormats(
  date1: Date | null,
  date2: Date | null = null,
  isTwoDays: boolean = false
): EventDateFormats | null {
  if (!date1) return null;

  const day1 = date1.getDate();
  const day1Ordinal = formatOrdinal(day1);
  const month1 = MONTHS[date1.getMonth()];
  const monthShort1 = MONTHS_SHORT[date1.getMonth()];
  const dayOfWeek1 = DAYS_OF_WEEK[date1.getDay()];

  // Single day event
  if (!isTwoDays || !date2) {
    return {
      single: `${month1} ${day1Ordinal}`,
      singleFull: `${dayOfWeek1}, ${month1} ${day1Ordinal}`,
      range: `${month1} ${day1Ordinal}`,
      rangeFull: `${dayOfWeek1}, ${month1} ${day1Ordinal}`,
      rangeShort: `${monthShort1} ${day1Ordinal}`,
    };
  }

  // Two-day event
  const day2 = date2.getDate();
  const day2Ordinal = formatOrdinal(day2);
  const month2 = MONTHS[date2.getMonth()];
  const monthShort2 = MONTHS_SHORT[date2.getMonth()];
  const dayOfWeek2 = DAYS_OF_WEEK[date2.getDay()];

  const sameMonth = date1.getMonth() === date2.getMonth();
  const consecutive = Math.abs(date2.getTime() - date1.getTime()) <= 24 * 60 * 60 * 1000 + 1000; // Within ~1 day

  let range: string;
  let rangeShort: string;

  if (sameMonth && consecutive) {
    // "November 15th and 16th"
    range = `${month1} ${day1Ordinal} and ${day2Ordinal}`;
    rangeShort = `${monthShort1} ${day1}-${day2Ordinal}`;
  } else if (sameMonth) {
    // "November 15th and 22nd"
    range = `${month1} ${day1Ordinal} and ${day2Ordinal}`;
    rangeShort = `${monthShort1} ${day1Ordinal} & ${day2Ordinal}`;
  } else {
    // "November 15th and December 6th"
    range = `${month1} ${day1Ordinal} and ${month2} ${day2Ordinal}`;
    rangeShort = `${monthShort1} ${day1Ordinal} & ${monthShort2} ${day2Ordinal}`;
  }

  return {
    single: `${month1} ${day1Ordinal}`,
    singleFull: `${dayOfWeek1}, ${month1} ${day1Ordinal}`,
    range,
    rangeFull: `${dayOfWeek1}, ${month1} ${day1Ordinal} and ${dayOfWeek2}, ${month2} ${day2Ordinal}`,
    rangeShort,
  };
}

/**
 * Get the day after a given date
 */
export function getNextDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

/**
 * Check if two dates are on the same weekend (Sat-Sun)
 */
export function isSameWeekend(date1: Date, date2: Date): boolean {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  const daysDiff = diff / (1000 * 60 * 60 * 24);
  return daysDiff <= 1 && 
    ((date1.getDay() === 6 && date2.getDay() === 0) || 
     (date1.getDay() === 0 && date2.getDay() === 6) ||
     (date1.getDay() === 5 && date2.getDay() === 6) ||
     (date1.getDay() === 6 && date2.getDay() === 5));
}

/**
 * Format a date for input[type="date"] value (YYYY-MM-DD)
 */
export function toDateInputValue(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date from input[type="date"] value (YYYY-MM-DD)
 */
export function fromDateInputValue(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Fixed program times (never change)
 */
export const FIXED_TIMES = {
  checkIn: "8:45 AM",
  splash: {
    end: "3:30 PM",
    program: "10 AM to 3:30 PM",
  },
  sprout: {
    end: "3:10 PM",
    program: "10 AM to 3:10 PM",
  },
} as const;









