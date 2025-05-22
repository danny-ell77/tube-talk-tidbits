/**
 * Abbreviates a number to a human-readable format (e.g., 1234 -> 1.2k)
 * @param num The number to abbreviate
 * @param decimals The number of decimal places to show (default: 1)
 */
export function abbreviateNumber(num: number, decimals: number = 1): string {
  if (num === null || num === undefined) return "0";

  const abbreviations = [
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
  ];

  for (const { value, symbol } of abbreviations) {
    if (num >= value) {
      return (num / value).toFixed(decimals).replace(/\.0$/, "") + symbol;
    }
  }

  return num.toString();
}

/**
 * Formats a number with commas as thousands separators
 * @param num The number to format
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
