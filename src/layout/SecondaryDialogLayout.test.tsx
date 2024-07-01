import { fireEvent, render, screen } from "@testing-library/react";

import SecondaryDialogLayout from "./SecondaryDialogLayout";

describe("SecondaryDialogLayout", () => {
  const mockCloseModal = jest.fn();

  it("renders title and description when provided", () => {
    render(
      <SecondaryDialogLayout
        closeModal={mockCloseModal}
        contents={[<div key="1">Content 1</div>]}
        description="Test Description"
        title="Test Title"
      />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders contents correctly", () => {
    render(
      <SecondaryDialogLayout
        closeModal={mockCloseModal}
        contents={[<div key="1">Content 1</div>, <div key="2">Content 2</div>]}
      />,
    );

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it("calls closeModal when Cancel button is clicked", () => {
    render(
      <SecondaryDialogLayout
        closeModal={mockCloseModal}
        contents={[<div key="1">Content</div>]}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
