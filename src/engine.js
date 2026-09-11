import { resolvePath } from "./resolver.js";
import { formatValue } from "./formatter.js";
import { validateSpecification } from "./validator.js";
import { evaluateCondition } from "./condition.js";

/**
 * Convert a declarative annotation specification
 * into renderer-independent instructions.
 *
 * The engine:
 * 1. validates the specification
 * 2. resolves source values
 * 3. evauates conditions
 * 4. format values
 * 5. produces renderer-ready instructions
 *
 * The engine deliberately does not know anything
 * about PDF libraries.
 */
export function processAnnotations(data, specification) {
  const validation = validateSpecification(specification);

  if (!validation.valid) {
    throw new Error(formatValidationErrors(validation.errors));
  }

  return specification.annotations
    .map((annotation) => {
      const rawValue = resolvePath(data, annotation.source.path);

      const isMissing = rawValue === undefined || rawValue === null;

      if (isMissing) {
        const behavior = annotation.behavior?.missingValue ?? "skip";

        if (behavior === "skip") {
          return null;
        }

        if (behavior === "error") {
          throw new Error(`Missing value for annotation: ${annotation.id}`);
        }
      }

      const shouldRender = evaluateCondition(rawValue, annotation.condition);

      if (!shouldRender) {
        return null;
      }

      if (annotation.type === "checkbox") {
        return {
          id: annotation.id,
          type: annotation.type,
          checked: true,
          target: annotation.target,
          format: annotation.format,
          behavior: annotation.behavior,
          condition: annotation.condition,
        };
      }

      const value = formatValue(rawValue, {
        type: annotation.type,
        ...annotation.format,
      });

      return {
        id: annotation.id,
        type: annotation.type,
        value,
        target: annotation.target,
        format: annotation.format,
        behavior: annotation.behavior,
        condition: annotation.condition,
      };
    })
    .filter(Boolean);
}

function formatValidationErrors(errors) {
  return errors
    .map((error) => {
      const location = error.instancePath || "root";

      return `${location} ${error.message}`;
    })
    .join("\n");
}
