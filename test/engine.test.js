import { describe, expect, test } from "vitest";

import { processAnnotations } from "../src/engine";

import taxData from "../examples/tax-data.json";

import specification from "../examples/annotations.json" with { type: "json" };

describe("processAnnotations", () => {
  test("resolves and formats annotation values", () => {
    const result = processAnnotations(taxData, specification);

    expect(result).toHaveLength(3);

    expect(result[0]).toMatchObject({
      id: "taxpayer.firstName",
      type: "text",
      value: "Yashwant",
    });
  });

  test("preserves rendering information", () => {
    const result = processAnnotations(taxData, specification);

    expect(result[0].target).toEqual({
      page: 1,
      box: {
        x: 100,
        y: 100,
        width: 150,
        height: 20,
      },
    });
  });

  test("rejects an invalid speification", () => {
    const invalidSpecification = {
      ...specification,
      form: {
        ...specification.form,
        units: "invalid",
      },
    };

    expect(() => processAnnotations(taxData, invalidSpecification)).toThrow();
  });
});
