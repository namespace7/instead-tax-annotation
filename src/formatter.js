/**
 * Convert a resolved value into the text that should
 * appear on the form
 *
 * The annotation type describes what the value means.
 * The format object describes how that value should appear.
 */

export function formatValue(value, format = {}) {
  if (value === null || value === undefined) {
    return "";
  }

  switch (format.type) {
    case "currency":
      return formatCurrency(value, format);

    case "percentage":
      return formatPercentage(value, format);

    case "date":
      return formatDate(value, format);

    case "number":
      return formatNumber(value, format);

    case "text":
      return String(value);

    default:
      throw new Error(`Unsupported annotation type: ${format.type}`);
  }
}

/**
 * Format a currency value.
 *
 * Example:
 * 95000 -> "$95,000.00"
 */
function formatCurrency(value, format) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: format.currency ?? "USD",
    minimumFractionDigits: format.decimals ?? 2,
    maximumFractionDigits: format.decimals ?? 2,
  }).format(value);
}

/**
 * Format a percentage value.
 *
 * The input is expected to be a decimal fraction.
 *
 * Example:
 * 0.25 -> "25%"
 */
function formatPercentage(value, format) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: format.decimals ?? 0,
    maximumFractionDigits: format.decimals ?? 0,
  }).format(value);
}

/**
 * Format a generic number.
 *
 * Example:
 * 1234567.5 -> "1,234,567.50"
 */
function formatNumber(value, format) {
  return new Intl.NumberFormat("en-US", {
    useGrouping: format.useGrouping ?? true,
    minimumFractionDigits: format.decimals ?? 0,
    maximumFractionDigits: format.decimals ?? 2,
  }).format(value);
}

/**
 * Format a date using the requested locale.
 */
function formatDate(value, format) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return new Intl.DateTimeFormat(format.locale ?? "en-US").format(date);
}
