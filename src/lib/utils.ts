import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string (ISO yyyy-mm-dd or DD/MM/YYYY) to DD/MM/YYYY for display.
 *  Parses date parts directly to avoid timezone shifts from `new Date(...)`. */
export function formatDateDMY(value: string | null | undefined): string {
  if (!value) return "—";
  const str = String(value).trim();
  // ISO yyyy-mm-dd (optionally with time component)
  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  // Already DD/MM/YYYY or DD-MM-YYYY
  const dmy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (dmy) {
    let [, d, m, y] = dmy;
    if (y.length === 2) y = (parseInt(y) < 50 ? "20" : "19") + y;
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }
  // Fallback: use Date but read UTC parts to avoid TZ shift
  const dt = new Date(str);
  if (isNaN(dt.getTime())) return str;
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = dt.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Format a timestamp to DD/MM/YYYY for display */
export function formatTimestampDMY(value: string | null | undefined): string {
  return formatDateDMY(value);
}
