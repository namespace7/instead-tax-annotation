import { resolvePath } from "./resolver";
import { formatValue } from "./formatter";
import { validateSpecification } from "./validator";

/**
 * Convert a declarative annotation specification
 * into renderer-independent instructions.
 *
 * The engine deliberately does not know anything
 * about PDF libraries
 */
export function processAnnotations(data, specification) {
  const validation = validateSpecification(specification);

  if (!validation.valid) {
    throw new Error(formatValidationErrors(validation.errors));
  }

  return specification.annotations.map((annotation) => {
    const rawValue = resolvePath(data, annotation.source.path);

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
    };
  });
}

function formatValidationErrors(errors) {
  return errors
    .map((error) => {
      const location = error.instancePath || "root";

      return `${location} ${error.message}`;
    })
    .join("\n");
}
