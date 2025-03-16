import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProgressModal } from "./ProgressModal";

describe("ProgressModal", () => {
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

//   it("renders with default props", () => {
//     render(
//       <ProgressModal
//         isOpen={true}
//         progress={5}
//         total={10}
//       />
//     );

//     expect(screen.getByText("Uploading Contacts")).toBeInTheDocument();
//     expect(screen.getByText("Please wait while your contacts are being uploaded...")).toBeInTheDocument();
//     expect(screen.getByText("5 of 10 contacts processed (50%)")).toBeInTheDocument();
//     expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
//   });

  it("renders with custom title and description", () => {
    render(
      <ProgressModal
        isOpen={true}
        progress={3}
        total={6}
        title="Custom Title"
        description="Custom Description"
      />
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Description")).toBeInTheDocument();
  });

  it("calculates percentage correctly", () => {
    render(
      <ProgressModal
        isOpen={true}
        progress={7}
        total={20}
      />
    );

    expect(screen.getByText("7 of 20 contacts processed (35%)")).toBeInTheDocument();
  });

  it("handles cancel button click", () => {
    render(
      <ProgressModal
        isOpen={true}
        progress={1}
        total={5}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("disables cancel button when isCanceling is true", () => {
    render(
      <ProgressModal
        isOpen={true}
        progress={1}
        total={5}
        onCancel={mockOnCancel}
        isCanceling={true}
      />
    );

    const cancelButton = screen.getByText("Canceling...");
    expect(cancelButton).toBeDisabled();
  });

  it("does not render when isOpen is false", () => {
    render(
      <ProgressModal
        isOpen={false}
        progress={1}
        total={5}
      />
    );

    expect(screen.queryByText("Uploading Contacts")).not.toBeInTheDocument();
  });
});
