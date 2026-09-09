import { describe, expect, test } from "vitest";

import { formatValue } from "../src/formatter";

describe("formatValue", () => {
  test("formats text", () => {
    expect(
      formatValue("Yashwant", {
        type: "text",
      }),
    ).toBe("Yashwant");
  });

  test("formats currency", () => {
    expect(
      formatValue(95000, {
        type: "currency",
        currency: "USD",
        decimals: 2,
      }),
    ).toBe("$95,000.00");
  });

  test("formats a number", () => {
    expect(
      formatValue(1234567.5, {
        type: "number",
        decimals: 2,
      }),
    ).toBe("1,234,567.50");
  });

  test("formats a number without grouping", () => {
    expect(
      formatValue(1234567.5, {
        type: "number",
        useGrouping: false,
        decimals: 1,
      }),
    ).toBe("1234567.5");
  });

  test("formats a percentage", () => {
    expect(
      formatValue(0.25, {
        type: "percentage",
        decimals: 1,
      }),
    ).toBe("25.0%");
  });

  test("formats a date", () => {
    expect(
      formatValue("2025-01-15", {
        type: "date",
        locale: "en-US",
      }),
    ).toBe("1/15/2025");
  });

  test("returns empty text for a missing value", () => {
    expect(
      formatValue(undefined, {
        type: "text",
      }),
    ).toBe("");
  });

  test("rejects an invalid date", () => {
    expect(() =>
      formatValue("not-a-date", {
        type: "date",
      }),
    ).toThrow("Invalid date value");
  });

  test("rejects an unsupported annotation type", () => {
    expect(() =>
      formatValue("Yashwant", {
        type: "unsupported",
      }),
    ).toThrow("Unsupported annotation type: unsupported");
  });
});
