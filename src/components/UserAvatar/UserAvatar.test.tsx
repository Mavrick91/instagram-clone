import { render } from "@testing-library/react";

import UserAvatar from "./index";

describe("UserAvatar component", () => {
  it("displays the provided avatar correctly", () => {
    const avatarUrl = "testAvatarUrl";
    const { getByAltText } = render(<UserAvatar avatar={avatarUrl} />);
    expect(getByAltText("Profile picture")).toHaveAttribute("src", avatarUrl);
  });

  it("displays the placeholder avatar when no avatar is provided", () => {
    const { getByAltText } = render(<UserAvatar />);
    expect(getByAltText("Profile picture")).toHaveAttribute(
      "src",
      "@/assets/placeholder-avatar.png",
    );
  });

  it("applies the specified class names correctly", () => {
    const customClassName = "custom-class";
    const { container } = render(<UserAvatar className={customClassName} />);
    expect(container.firstChild).toHaveClass(
      "size-10 aspect-square rounded-full shrink-0 custom-class",
    );
  });
});
