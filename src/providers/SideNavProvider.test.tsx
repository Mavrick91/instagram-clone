import { useViewportSize } from "@mantine/hooks";
import { act, render } from "@testing-library/react";
import { usePathname } from "next/navigation";

import SideNavProvider, { useSideNav } from "./SideNavProvider";

jest.mock("@mantine/hooks", () => ({
  useViewportSize: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const TestComponent = () => {
  const {
    sideNavOpen,
    toggleSideNav,
    isSearchVisible,
    toggleSearch,
    isNotificationVisible,
    toggleNotification,
    isNewPostVisible,
    toggleNewPost,
    displaySmallNav,
    isConversationPage,
  } = useSideNav();

  return (
    <div>
      <div data-testid="side-nav-open">{sideNavOpen.toString()}</div>
      <button onClick={toggleSideNav}>Toggle Side Nav</button>
      <div data-testid="search-visible">{isSearchVisible.toString()}</div>
      <button onClick={toggleSearch}>Toggle Search</button>
      <div data-testid="notification-visible">
        {isNotificationVisible.toString()}
      </div>
      <button onClick={toggleNotification}>Toggle Notification</button>
      <div data-testid="new-post-visible">{isNewPostVisible.toString()}</div>
      <button onClick={toggleNewPost}>Toggle New Post</button>
      <div data-testid="display-small-nav">{displaySmallNav.toString()}</div>
      <div data-testid="is-conversation-page">
        {isConversationPage.toString()}
      </div>
    </div>
  );
};

describe("SideNavProvider", () => {
  beforeEach(() => {
    (useViewportSize as jest.Mock).mockReturnValue({ width: 1000 });
    (usePathname as jest.Mock).mockReturnValue("/home");
  });

  it("provides correct initial state", () => {
    const { getByTestId } = render(
      <SideNavProvider>
        <TestComponent />
      </SideNavProvider>,
    );

    expect(getByTestId("side-nav-open").textContent).toBe("false");
    expect(getByTestId("search-visible").textContent).toBe("false");
    expect(getByTestId("notification-visible").textContent).toBe("false");
    expect(getByTestId("new-post-visible").textContent).toBe("false");
    expect(getByTestId("display-small-nav").textContent).toBe("true");
    expect(getByTestId("is-conversation-page").textContent).toBe("false");
  });

  it("toggles side nav correctly", () => {
    const { getByTestId, getByText } = render(
      <SideNavProvider>
        <TestComponent />
      </SideNavProvider>,
    );

    act(() => {
      getByText("Toggle Side Nav").click();
    });

    expect(getByTestId("side-nav-open").textContent).toBe("true");
  });

  it("toggles search correctly", () => {
    const { getByTestId, getByText } = render(
      <SideNavProvider>
        <TestComponent />
      </SideNavProvider>,
    );

    act(() => {
      getByText("Toggle Search").click();
    });

    expect(getByTestId("search-visible").textContent).toBe("true");
  });

  it("updates state based on viewport size", () => {
    (useViewportSize as jest.Mock).mockReturnValue({ width: 1300 });

    const { getByTestId } = render(
      <SideNavProvider>
        <TestComponent />
      </SideNavProvider>,
    );

    expect(getByTestId("side-nav-open").textContent).toBe("true");
  });

  it("detects conversation page correctly", () => {
    (usePathname as jest.Mock).mockReturnValue("/direct/inbox");

    const { getByTestId } = render(
      <SideNavProvider>
        <TestComponent />
      </SideNavProvider>,
    );

    expect(getByTestId("is-conversation-page").textContent).toBe("true");
  });
});
