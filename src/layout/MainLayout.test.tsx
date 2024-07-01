import { useModal } from "@/providers/ModalProvider";
import { useSideNav } from "@/providers/SideNavProvider";
import { render } from "@/test-utils";

import MainLayout from "./MainLayout";

jest.mock("@/providers/SideNavProvider", () => ({
  useSideNav: jest.fn(),
}));

jest.mock("@/providers/ModalProvider", () => ({
  useModal: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("MainLayout", () => {
  beforeEach(() => {
    (useSideNav as jest.Mock).mockReturnValue({
      sideNavOpen: true,
      isConversationPage: false,
    });
    (useModal as jest.Mock).mockReturnValue({
      closeAllModals: jest.fn(),
    });
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>,
    );

    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("calls closeAllModals on mount", () => {
    const mockCloseAllModals = jest.fn();
    (useModal as jest.Mock).mockReturnValue({
      closeAllModals: mockCloseAllModals,
    });

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>,
    );

    expect(mockCloseAllModals).toHaveBeenCalledTimes(1);
  });
});
