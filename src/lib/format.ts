import { differenceInCalendarDays, format, parseISO } from "date-fns";

export function money(n: number | string | null | undefined, currency = "INR") {
  const v = Number(n ?? 0);
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(v);
  } catch {
    return `${currency} ${v.toFixed(2)}`;
  }
}

export function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return format(parseISO(d), "dd MMM yyyy");
}

export function fmtDateTime(d: string | null | undefined) {
  if (!d) return "—";
  return format(parseISO(d), "dd MMM yyyy, h:mm a");
}

export function nights(a: string, b: string) {
  return Math.max(0, differenceInCalendarDays(parseISO(b), parseISO(a)));
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function addDaysISO(iso: string, days: number) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return format(d, "yyyy-MM-dd");
}

export const STATUS_LABEL: Record<string, string> = {
  reserved: "Reserved",
  checked_in: "Checked in",
  checked_out: "Checked out",
  cancelled: "Cancelled",
};

export function errMsg(e: unknown) {
  if (e && typeof e === "object" && "message" in e) return String((e as { message: string }).message);
  return "Something went wrong";
}

/** Indian mobile normalisation for WhatsApp links: keeps digits, adds 91 for 10-digit numbers. */
export function waNumber(mobile: string) {
  const d = mobile.replace(/\D/g, "");
  if (d.length === 10) return "91" + d;
  if (d.length === 11 && d.startsWith("0")) return "91" + d.slice(1);
  return d;
}

/**
 * Normalises a time string (12-hour or 24-hour) into standard 12-hour AM/PM format (e.g. "12:00 PM", "11:00 AM").
 */
export function formatTime12h(timeStr: string | null | undefined, fallback = "12:00 PM"): string {
  if (!timeStr || !timeStr.trim()) return fallback;
  const s = timeStr.trim().toUpperCase();

  // Already 12-hour format: "12:00 PM", "11:00 AM", "01:30 PM"
  const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (m12) {
    const hh = String(Math.min(12, Math.max(1, parseInt(m12[1], 10)))).padStart(2, "0");
    const mm = m12[2];
    const period = m12[3];
    return `${hh}:${mm} ${period}`;
  }

  // 24-hour format: "14:30", "09:00", "12:00:00"
  const m24 = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (m24) {
    let h = parseInt(m24[1], 10);
    const mm = m24[2];
    const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${String(h).padStart(2, "0")}:${mm} ${period}`;
  }

  return fallback;
}

/**
 * Parses any time string into its 12-hour constituent parts for UI form controls.
 */
export function parseTimeParts(
  timeStr: string | null | undefined,
  defaultHour = "12",
  defaultMinute = "00",
  defaultPeriod: "AM" | "PM" = "PM"
): { hour: string; minute: string; period: "AM" | "PM" } {
  const formatted = formatTime12h(timeStr, `${defaultHour}:${defaultMinute} ${defaultPeriod}`);
  const match = formatted.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/);
  if (match) {
    return { hour: match[1], minute: match[2], period: match[3] as "AM" | "PM" };
  }
  return { hour: defaultHour, minute: defaultMinute, period: defaultPeriod };
}

/**
 * Combines hour, minute, and period into a canonical 12-hour time string.
 */
export function buildTime12h(hour: string, minute: string, period: "AM" | "PM"): string {
  const hh = String(Math.min(12, Math.max(1, parseInt(hour, 10) || 12))).padStart(2, "0");
  const mm = String(Math.min(59, Math.max(0, parseInt(minute, 10) || 0))).padStart(2, "0");
  return `${hh}:${mm} ${period}`;
}

/**
 * Converts a 12-hour or 24-hour time string to ISO 24-hour "HH:mm" format for date calculations.
 */
export function timeTo24h(timeStr: string | null | undefined, fallback = "12:00"): string {
  if (!timeStr || !timeStr.trim()) return fallback;
  const s = timeStr.trim().toUpperCase();

  const m12 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const mm = m12[2];
    const period = m12[3];
    if (period === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h < 12) h += 12;
    }
    return `${String(h).padStart(2, "0")}:${mm}`;
  }

  const m24 = s.match(/^(\d{1,2}):(\d{2})/);
  if (m24) {
    return `${m24[1].padStart(2, "0")}:${m24[2]}`;
  }

  return fallback;
}
