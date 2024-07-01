import { ReactNode } from "react";

import { render } from "@/test-utils";

import ReactQueryProvider from "./ReactQueryProvider";

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  QueryClientProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-query-provider">{children}</div>
  ),
  HydrationBoundary: ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-hydration-boundary">{children}</div>
  ),
}));

jest.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div data-testid="mock-query-devtools" />,
}));

describe("ReactQueryProvider", () => {
  it("renders children within QueryClientProvider and HydrationBoundary", () => {
    const { getByTestId, getByText } = render(
      <ReactQueryProvider dehydratedState={{}}>
        <div>Test Child</div>
      </ReactQueryProvider>,
    );

    expect(getByTestId("mock-query-provider")).toBeInTheDocument();
    expect(getByTestId("mock-hydration-boundary")).toBeInTheDocument();
    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("renders ReactQueryDevtools", () => {
    const { getByTestId } = render(
      <ReactQueryProvider dehydratedState={{}}>
        <div>Test Child</div>
      </ReactQueryProvider>,
    );

    expect(getByTestId("mock-query-devtools")).toBeInTheDocument();
  });
});
