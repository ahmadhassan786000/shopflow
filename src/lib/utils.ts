export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${y}${m}${d}-${rand}`;
}

export const CURRENCY_CODE = "PKR";

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;

  if (!Number.isFinite(value)) {
    return "Rs 0.00";
  }

  return `Rs ${value.toFixed(2)}`;
}
