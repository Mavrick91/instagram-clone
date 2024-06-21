import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ConversationThreadHeader from "./index";

describe("ConversationThreadHeader component", () => {
  const recipientUser = {
    id: 1,
    username: "testUser",
    avatar: "testAvatar",
    firstName: "John",
    lastName: "Doe",
  };

  it("renders correctly with recipientUser data", () => {
    render(
      <MemoryRouter>
        <ConversationThreadHeader recipientUser={recipientUser} />
      </MemoryRouter>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("points to the correct URL based on the username", () => {
    render(
      <MemoryRouter>
        <ConversationThreadHeader recipientUser={recipientUser} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/testUser");
  });

  it("displays the correct avatar", () => {
    render(
      <MemoryRouter>
        <ConversationThreadHeader recipientUser={recipientUser} />
      </MemoryRouter>,
    );

    expect(screen.getByAltText("User Avatar")).toHaveAttribute(
      "src",
      "testAvatar",
    );
  });

  it("displays the full name correctly", () => {
    render(
      <MemoryRouter>
        <ConversationThreadHeader recipientUser={recipientUser} />
      </MemoryRouter>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
