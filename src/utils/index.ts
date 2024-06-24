export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ("response" in error && typeof (error as any).response === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (error as any).response;
      if (
        response.data &&
        typeof response.data === "object" &&
        "message" in response.data
      ) {
        message = response.data.message;
      } else if (response.statusText) {
        message = response.statusText;
      } else {
        message = error.message;
      }
    } else {
      message = error.message;
    }
  } else if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null) {
    if (
      "message" in error &&
      typeof (error as Record<string, unknown>).message === "string"
    ) {
      message = (error as Record<string, unknown>).message as string;
    } else if (
      "error" in error &&
      typeof (error as Record<string, unknown>).error === "string"
    ) {
      message = (error as Record<string, unknown>).error as string;
    } else {
      message = JSON.stringify(error);
    }
  } else if (error instanceof Event) {
    message = (error as Event).type;
  } else {
    message = "An unknown error occurred";
  }

  console.error(message);

  return message;
};
