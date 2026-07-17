export function rupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .replace(/\s+/g, "");
}

/** Rp singkat: 1,9 jt · 450 rb */
export function rupiahShort(amount: number): string {
  if (Math.abs(amount) >= 1_000_000)
    return `Rp${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  if (Math.abs(amount) >= 1_000)
    return `Rp${Math.round(amount / 1_000).toLocaleString("id-ID")} rb`;
  return rupiah(amount);
}

export function persen(x: number, digits = 0): string {
  return `${(x * 100).toFixed(digits)}%`;
}

export function tanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export function jam(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
