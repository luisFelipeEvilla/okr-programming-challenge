import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImportForm } from "./ImportForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn, readCsvFile } from "@/lib/utils";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock readCsvFile
vi.mock("@/lib/utils", () => ({
  readCsvFile: vi.fn(),
  cn: vi.fn()
}));

describe("ImportForm", () => {
  const mockOnImport = vi.fn();
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  it("renders form elements correctly", () => {
    render(<ImportForm onImport={mockOnImport} />);

    expect(screen.getByText(/Upload a CSV file containing your contacts/)).toBeInTheDocument();
    expect(screen.getByText("Skip duplicates")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import Contacts" })).toBeInTheDocument();
  });

  it("handles file selection", async () => {
    render(<ImportForm onImport={mockOnImport} />);

    const file = new File(["test"], "test.csv", { type: "text/csv" });
    const input = screen.getByTestId("file-input");
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test.csv")).toBeInTheDocument();
    });
  });

  it("handles form submission with invalid file type", async () => {
    render(<ImportForm onImport={mockOnImport} />);

    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");
    const submitButton = screen.getByRole("button", { name: "Import Contacts" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/File must be a CSV/)).toBeInTheDocument();
    });
  });

  it("handles cancel button click", () => {
    render(<ImportForm onImport={mockOnImport} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard/contacts");
  });

  it("handles skip duplicates checkbox", () => {
    render(<ImportForm onImport={mockOnImport} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("shows loading state during processing", async () => {
    render(<ImportForm onImport={mockOnImport} />);

    const file = new File(["test"], "test.csv", { type: "text/csv" });
    const input = screen.getByTestId("file-input");
    const submitButton = screen.getByRole("button", { name: "Import Contacts" });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Processing...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });
});

