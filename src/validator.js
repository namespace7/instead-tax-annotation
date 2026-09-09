import Ajv2020 from "ajv/dist/2020.js";
import schema from "../schema/annotation.schema.json" with { type: "json" };

const ajv = new Ajv2020({
  allErrors: true,
});

const validateSchema = ajv.compile(schema);

/**
 * Validate an annotation specification against the
 * published JSON Schema.
 *
 * This answers:
 *
 * "Is the annotation structurally valid?"
 *
 * It does NOT answer:
 *
 * "Does the source path actually exist in the data?"
 */

export function validateSpecification(specification) {
  const valid = validateSchema(specification);

  if (valid) {
    return {
      valid: true,
      errors: [],
    };
  }

  return {
    valid: false,
    errors: validateSchema.errors ?? [],
  };
}
