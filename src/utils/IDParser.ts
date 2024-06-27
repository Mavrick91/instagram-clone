export const parseId = (id: string | number): number => {
  if (typeof id === "number") {
    if (Number.isInteger(id) && id > 0) {
      return id;
    }
    throw new Error("Invalid ID: Must be a positive integer");
  }

  if (typeof id === "string") {
    if (/^\d+$/.test(id)) {
      const parsedId = parseInt(id, 10);
      if (parsedId > 0) {
        return parsedId;
      }
    }
    throw new Error(
      "Invalid ID: Must be a numeric string representing a positive integer",
    );
  }

  throw new Error("Invalid ID: Must be a string or number");
};

export const isValidId = (value: unknown): value is string | number => {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0;
  }
  if (typeof value === "string") {
    return /^\d+$/.test(value) && parseInt(value, 10) > 0;
  }
  return false;
};
