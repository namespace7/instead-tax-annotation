import { describe, expect, test } from "vitest";
import { resolvePath } from "../src/resolver.js";

const data = {
  taxpayer: {
    name: {
      first: "John",
      last: "Doe",
    },

    address: {
      city: "Austin",
    },

    dependents: [
      {
        name: {
          first: "Alice",
        },
      },
      {
        name: {
          first: "Bob",
        },
      },
    ],
  },
};

describe("resolvePath", () => {
  test("resolves a simple nested value", () => {
    expect(resolvePath(data, "$.taxpayer.name.first")).toBe("John");
  });

  test("resolves a deeply nested value", () => {
    expect(resolvePath(data, "$.taxpayer.address.city")).toBe("Austin");
  });

  test("resolves an array element", () => {
    expect(resolvePath(data, "$.taxpayer.dependents[1].name.first")).toBe(
      "Bob",
    );
  });

  test("returns undefined for a missing value", () => {
    expect(resolvePath(data, "$.taxpayer.phone.number")).toBeUndefined();
  });

  test("rejects an invalid path", () => {
    expect(() => resolvePath(data, "taxpayer.name.first")).toThrow();
  });
});
