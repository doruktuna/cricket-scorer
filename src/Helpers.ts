import type { CricketNumber } from "./types/cricket";

export function shotStr(
  cricketNumber: CricketNumber | undefined,
  amount: number | undefined,
): string {
  if (!cricketNumber || !amount) {
    console.warn(
      "Undefined cricket number or amount in shotStr function",
      cricketNumber,
      amount,
    );
    return "";
  }
  if (cricketNumber === 25 && amount === 1) return "BULL";
  if (cricketNumber === 25 && amount === 2) return "BE";
  if (amount === 1) return cricketNumber.toString();
  if (amount === 2) return `D${cricketNumber}`;
  if (amount === 3) return `T${cricketNumber}`;

  console.error(
    "This line shouldn't have been reached in shotStr function",
    cricketNumber,
    amount,
  );
  return `${amount}x${cricketNumber}`;
}
