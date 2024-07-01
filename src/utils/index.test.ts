import { getErrorMessage } from "./index";

describe("getErrorMessage", () => {
  let consoleErrorMock;

  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  it("should handle Error instances", () => {
    const error = new Error("Test error");
    expect(getErrorMessage(error)).toBe("Test error");
  });

  it("should handle Error instances with response object", () => {
    const error = new Error("Test error") as any;
    error.response = { data: { message: "Response error" } };
    expect(getErrorMessage(error)).toBe("Response error");
  });

  it("should handle string errors", () => {
    expect(getErrorMessage("String error")).toBe("String error");
  });

  it("should handle objects with message property", () => {
    expect(getErrorMessage({ message: "Object error" })).toBe("Object error");
  });

  it("should handle objects with error property", () => {
    expect(getErrorMessage({ error: "Object error" })).toBe("Object error");
  });

  it("should handle unknown error types", () => {
    expect(getErrorMessage(null)).toBe("An unknown error occurred");
  });
});
