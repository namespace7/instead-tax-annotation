import { describe, expect, test } from "vitest";

import { processAnnotations } from "../src/engine";

import taxData from "../examples/tax-data.json";

import specification from "../examples/annotations.json" with { type: "json" };

describe("processAnnotations", () => {
  test("resolves and formats annotation values", () => {
    const result = processAnnotations(taxData, specification);

    expect(result).toHaveLength(4);

    const firstName = result.find((item) => item.id === "taxpayer.firstName");

    expect(firstName).toMatchObject({
      id: "taxpayer.firstName",
      type: "text",
      value: "Yashwant",
    });
  });

  test("preserves rendering information", () => {
    const result = processAnnotations(taxData, specification);

    const firstName = result.find((item) => item.id === "taxpayer.firstName");

    expect(firstName.target).toEqual({
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

  test("renders an annotation when its condition is satisfied", () => {
    const result = processAnnotations(taxData, specification);

    const checkbox = result.find((item) => item.id === "filing.single");

    expect(checkbox).toMatchObject({
      id: "filing.single",
      type: "checkbox",
      checked: true,
    });

    expect(checkbox).not.toHaveProperty("value");
  });

  test("does not render an annotation when its condition is not satisfied", () => {
    const data = {
      ...taxData,
      taxpayer: {
        ...taxData.taxpayer,
        filingStatus: "married",
      },
    };

    const result = processAnnotations(data, specification);

    const checkbox = result.find((item) => item.id === "filing.single");

    expect(checkbox).toBeUndefined();
  });
});
