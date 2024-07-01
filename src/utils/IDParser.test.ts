import { parseId } from "./IDParser";

describe("parseId", () => {
  it("should return the number if given a positive integer", () => {
    expect(parseId(5)).toBe(5);
  });

  it("should parse a valid string to a number", () => {
    expect(parseId("10")).toBe(10);
  });

  it("should throw an error for negative numbers", () => {
    expect(() => parseId(-1)).toThrow("Invalid ID: Must be a positive integer");
  });

  it("should throw an error for non-integer numbers", () => {
    expect(() => parseId(3.14)).toThrow(
      "Invalid ID: Must be a positive integer",
    );
  });

  it("should throw an error for invalid strings", () => {
    expect(() => parseId("abc")).toThrow(
      "Invalid ID: Must be a numeric string representing a positive integer",
    );
  });

  it("should throw an error for other types", () => {
    expect(() => parseId({})).toThrow("Invalid ID: Must be a string or number");
  });
});
