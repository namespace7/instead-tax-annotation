/**
 * Convert a resolved value into the text that should
 * appear on the form
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

    case "integer":
      return formatInteger(value, format);

    case "decimal":
      return formatDecimal(value, format);

    case "text":
    default:
      return String(value);
  }
}

function formatCurrency(value, format) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: format.currency ?? "USD",
    minimumFractionDigits: format.decimals ?? 2,
    maximumFractionDigits: format.decimals ?? 2,
  }).format(value);
}

function formatPercentage(value, format) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: format.decimals ?? 0,
    maximumFractionDigits: format.decimals ?? 0,
  }).format(value);
}

function formatInteger(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDecimal(value, format) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: format.decimals ?? 2,
    maximumFractionDigits: format.decimals ?? 2,
  }).format(value);
}

function formatDate(value, format) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(format.locale ?? "en-US").format(date);
}
