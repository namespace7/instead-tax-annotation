import { describe, expect, test } from "vitest";

import { processAnnotations } from "../src/engine";

import taxData from "../examples/tax-data.json";

import specification from "../examples/annotations.json" with { type: "json" };

describe("processAnnotations", () => {
  test("resolves and formats annotation values", () => {
    const result = processAnnotations(taxData, specification);

    expect(result).toHaveLength(7);

    const firstName = result.find((item) => item.id === "taxpayer.firstName");

    expect(firstName).toMatchObject({
      id: "taxpayer.firstName",
      type: "text",
      value: "Yashwant",
    });

    const filingDate = result.find((item) => item.id === "return.filingDate");

    expect(filingDate).toMatchObject({
      id: "return.filingDate",
      type: "date",
      value: "4/15/2025",
    });

    const taxRate = result.find((item) => item.id === "return.taxRate");

    expect(taxRate).toMatchObject({
      id: "return.taxRate",
      type: "percentage",
      value: "24.0%",
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

  test("skips an annotation when its value is missing", () => {
    const specificationWithMissingValue = {
      ...specification,
      annotations: [
        {
          id: "taxpayer.middleName",
          type: "text",
          source: {
            path: "$.taxpayer.name.middleName",
          },
          target: {
            page: 1,
            box: {
              x: 100,
              y: 100,
              width: 100,
              height: 20,
            },
          },
          behavior: {
            missingValue: "skip",
          },
        },
      ],
    };

    const result = processAnnotations(taxData, specificationWithMissingValue);

    expect(result).toHaveLength(0);
  });

  test("renders an empty value when missingValue is empty", () => {
    const specificationWithMissingValue = {
      ...specification,
      annotations: [
        {
          id: "taxpayer.middleName",
          type: "text",
          source: {
            path: "$.taxpayer.name.middleName",
          },
          target: {
            page: 1,
            box: {
              x: 100,
              y: 100,
              width: 100,
              height: 20,
            },
          },
          behavior: {
            missingValue: "empty",
          },
        },
      ],
    };

    const result = processAnnotations(taxData, specificationWithMissingValue);

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("");
  });

  test("throws when a required value is missing", () => {
    const specificationWithMissingValue = {
      ...specification,
      annotations: [
        {
          id: "taxpayer.middleName",
          type: "text",
          source: {
            path: "$.taxpayer.name.middleName",
          },
          target: {
            page: 1,
            box: {
              x: 100,
              y: 100,
              width: 100,
              height: 20,
            },
          },
          behavior: {
            missingValue: "error",
          },
        },
      ],
    };

    expect(() =>
      processAnnotations(taxData, specificationWithMissingValue),
    ).toThrow("Missing value for annotation: taxpayer.middleName");
  });
});
