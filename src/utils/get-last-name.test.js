import { describe, it, expect } from "vitest";
import { getLastName } from "./get-last-name";

describe("getLastName", () => {
  it("returns the last name after the last space", () => {
    expect(getLastName("Nick Pope")).toBe("Pope");
    expect(getLastName("Cristiano Ronaldo")).toBe("Ronaldo");
    expect(getLastName("Lionel Andrés Messi")).toBe("Messi");
  });

  it("returns the whole string if no space is present", () => {
    expect(getLastName("Neymar")).toBe("Neymar");
    expect(getLastName("Ronaldo")).toBe("Ronaldo");
  });

  it("handles empty strings", () => {
    expect(getLastName("")).toBe("");
  });

  it("trims leading and trailing spaces", () => {
    expect(getLastName(" Nick Pope ")).toBe("Pope");
  });

  it("throws an error for non-string inputs", () => {
    expect(() => getLastName(123)).toThrow("Input must be a string");
    expect(() => getLastName(null)).toThrow("Input must be a string");
    expect(() => getLastName(undefined)).toThrow("Input must be a string");
  });
});
