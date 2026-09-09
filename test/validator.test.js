import { describe, expect, test } from "vitest";

import { validateSpecification } from "../src/validator";

import validSpecification from "../examples/annotations.json";

describe("validateSpecification", () => {
  test("accepts a valid annotation specification", () => {
    const result = validateSpecification(validSpecification);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects a specification without schemaVersion", () => {
    const invalidSpecification = {
      ...validSpecification,
    };

    delete invalidSpecification.schemaVersion;

    const result = validateSpecification(invalidSpecification);

    expect(result.valid).toBe(false);
  });

  test("rejects an invalid coordinate unit", () => {
    const invalidSpecification = {
      ...validSpecification,

      form: {
        ...validSpecification.form,
        units: "pixels",
      },
    };

    const result = validateSpecification(invalidSpecification);

    expect(result.valid).toBe(false);
  });

  test("rejects an annotation without a target", () => {
    const invalidSpecification = {
      ...validSpecification,

      annotations: [
        {
          id: "test",
          type: "text",
          source: {
            path: "$.taxpayer.name.first",
          },
        },
      ],
    };

    const result = validateSpecification(invalidSpecification);

    expect(result.valid).toBe(false);
  });
});
