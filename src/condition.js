/**
 * Evaluate a condition against a resolved source value.
 *
 * Conditions are deliberately small and predictable.
 * The engine evaluates them; the PDF renderer does not
 * need to understand business rules.
 */
export function evaluateCondition(value, condition) {
  if (!condition) {
    return true;
  }

  switch (condition.operator) {
    case "equals":
      return value === condition.value;

    case "notEquals":
      return value !== condition.value;

    default:
      throw new Error(`Unsupported condition operator: ${condition.operator}`);
  }
}
