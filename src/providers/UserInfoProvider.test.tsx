import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";

import * as userActions from "@/actions/user";

import { UserInfoProvider, useUserInfo } from "./UserInfoProvider";

jest.mock("@/actions/user", () => ({
  getCurrentUser: jest.fn(),
}));

const mockInitialUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
};

const TestComponent = () => {
  const userInfo = useUserInfo();
  return <div data-testid="user-info">{JSON.stringify(userInfo)}</div>;
};

describe("UserInfoProvider", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    (userActions.getCurrentUser as jest.Mock).mockResolvedValue(
      mockInitialUser,
    );
  });

  it("provides initial user info", async () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <UserInfoProvider initialCurrentUser={mockInitialUser}>
          <TestComponent />
        </UserInfoProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(JSON.parse(getByTestId("user-info").textContent!)).toEqual(
        mockInitialUser,
      );
    });
  });

  it("updates user info when getCurrentUser returns new data", async () => {
    const updatedUser = { ...mockInitialUser, username: "updateduser" };
    (userActions.getCurrentUser as jest.Mock).mockResolvedValue(updatedUser);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <UserInfoProvider initialCurrentUser={mockInitialUser}>
          <TestComponent />
        </UserInfoProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(JSON.parse(getByTestId("user-info").textContent!)).toEqual(
        updatedUser,
      );
    });
  });

  it("throws error when useUserInfo is used outside of UserInfoProvider", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useUserInfo must be used within a UserInfoProvider",
    );

    consoleErrorSpy.mockRestore();
  });
});
