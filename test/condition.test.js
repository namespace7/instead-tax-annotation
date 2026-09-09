import { describe, expect, test } from "vitest";

import { evaluateCondition } from "../src/condition";

describe("evaluateCondition", () => {
  test("returns true when there is not condition", () => {
    expect(evaluateCondition("single")).toBe(true);
  });

  test("supports equals", () => {
    expect(
      evaluateCondition("single", {
        operator: "equals",
        value: "single",
      }),
    ).toBe(true);
  });

  test("supports notEquals", () => {
    expect(
      evaluateCondition("single", {
        operator: "notEquals",
        value: "married",
      }),
    ).toBe(true);

    expect(
      evaluateCondition("married", {
        operator: "notEquals",
        value: "married",
      }),
    ).toBe(false);
  });

  test("rejects unsupported operators", () => {
    expect(() =>
      evaluateCondition("single", {
        operator: "contains",
        value: "single",
      }),
    ).toThrow("Unsupported condition operator: contains");
  });
});
