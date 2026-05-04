export function formatUsdCompact(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatUsdFull(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPctChange(pct: number): string {
  if (!Number.isFinite(pct)) return "—";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% vs. last period`;
}

export function formatInt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-CA").format(Math.round(n));
}

export function formatRate(r: number): string {
  if (!Number.isFinite(r)) return "—";
  return `${(r * 100).toFixed(1)}%`;
}

export function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

/** Split API `contact` field into phone-like and email-like lines. */
export function splitContact(contact: string): { phone: string; email: string } {
  const trimmed = contact.trim();
  const emailMatch = trimmed.match(/[^\s<>]+@[^\s<>]+/);
  if (!emailMatch) {
    return { phone: trimmed || "—", email: "" };
  }
  const email = emailMatch[0];
  const phone = trimmed.replace(email, "").replace(/\|/g, " ").trim();
  return {
    phone: phone || "—",
    email,
  };
}

export function calendarRangeIso(daysAhead: number): {
  startIso: string;
  endIso: string;
  timezone: string;
} {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + daysAhead);
  end.setHours(23, 59, 59, 999);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
  };
}
