const ROMAN_TABLE: [string, number][] = [
  ["M", 1000],
  ["CM", 900],
  ["D", 500],
  ["CD", 400],
  ["C", 100],
  ["XC", 90],
  ["L", 50],
  ["XL", 40],
  ["X", 10],
  ["IX", 9],
  ["V", 5],
  ["IV", 4],
  ["I", 1],
];

export const toRoman = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return "";
  let remainder = Math.floor(value);
  let result = "";
  ROMAN_TABLE.forEach(([symbol, amount]) => {
    while (remainder >= amount) {
      result += symbol;
      remainder -= amount;
    }
  });
  return result;
};

export const formatDisplayOrder = (
  order: number | undefined,
  fallback: number | string = "",
) => (order == null ? String(fallback) : String(order));
