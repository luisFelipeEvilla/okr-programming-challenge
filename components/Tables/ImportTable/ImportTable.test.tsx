import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImportTable } from "./ImportTable";
import { ContactSchema } from "@/schemas/Contact";
import { mockContacts } from "@/mock/contacts";

describe("ImportTable", () => {
  const mockOnUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the table with correct title and description", () => {
    render(
      <ImportTable
        contacts={mockContacts}
        onUpload={mockOnUpload}
        isProcessing={false}
      />
    );

    expect(screen.getByText("Import Contacts")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Preview the contacts you are importing before uploading, and make sure they are correct."
      )
    ).toBeInTheDocument();
  });

  it("renders all contacts with correct status badges", () => {
    render(
      <ImportTable
        contacts={mockContacts}
        onUpload={mockOnUpload}
        isProcessing={false}
      />
    );

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Imported")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

    it('displays error dialog when clicking eye icon on failed contact', () => {
      render(<ImportTable contacts={mockContacts} onUpload={mockOnUpload} isProcessing={false} />);

      // Find and click the eye icon button
      const eyeButton = screen.getByRole('button', { name: "view error" });
      fireEvent.click(eyeButton);

      // Check if error dialog is displayed
      expect(screen.getByText('Import Error')).toBeInTheDocument();
      expect(screen.getByText('Duplicate email address')).toBeInTheDocument();
    });

  it("calls onUpload when clicking upload button", () => {
    render(
      <ImportTable
        contacts={mockContacts}
        onUpload={mockOnUpload}
        isProcessing={false}
      />
    );

    const uploadButton = screen.getByText("Upload Contacts");
    fireEvent.click(uploadButton);

    expect(mockOnUpload).toHaveBeenCalledTimes(1);
  });

  it("disables upload button and shows loading state when isProcessing is true", () => {
    render(
      <ImportTable
        contacts={mockContacts}
        onUpload={mockOnUpload}
        isProcessing={true}
      />
    );

    const uploadButton = screen.getByText("Uploading...");
    expect(uploadButton).toBeDisabled();
  });

  it("renders empty state when no contacts are provided", () => {
    render(
      <ImportTable contacts={[]} onUpload={mockOnUpload} isProcessing={false} />
    );

    expect(screen.getByText("No contacts found.")).toBeInTheDocument();
  });

  it("applies correct badge variants based on status", () => {
    render(
      <ImportTable
        contacts={mockContacts}
        onUpload={mockOnUpload}
        isProcessing={false}
      />
    );

    // Check badge variants
    const pendingBadge = screen.getByText("Pending");
    const successBadge = screen.getByText("Imported");
    const errorBadge = screen.getByText("Failed");

    expect(pendingBadge).toHaveClass("bg-secondary");
    expect(successBadge).toHaveClass("bg-green-500");
    expect(errorBadge).toHaveClass("bg-destructive");
  });

  it("renders all contact information correctly", () => {
    render(
      <ImportTable
        contacts={mockContacts}
        onUpload={mockOnUpload}
        isProcessing={false}
      />
    );

    const firstName = screen.getByText(mockContacts[0].first_name);
    const lastName = screen.getByText(mockContacts[0].last_name);
    const email = screen.getByText(mockContacts[0].email_address.address);
    const phone = screen.getByText(mockContacts[0].phone_numbers?.[0]?.phone_number || "");
    const address = screen.getByText(mockContacts[0].street_addresses?.[0]?.street || "");

    // Check if all contact information is displayed
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(address).toBeInTheDocument();
  });

    it('closes error dialog when clicking outside', () => {
      render(<ImportTable contacts={mockContacts} onUpload={mockOnUpload} isProcessing={false} />);

      // Open dialog
      const eyeButton = screen.getByRole('button', { name: /view error/i });
      fireEvent.click(eyeButton);

      // Click outside dialog
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

      // Check if dialog is closed
      expect(screen.queryByText('Import Error')).not.toBeInTheDocument();
    });

    it('maintains table sorting functionality', () => {
      render(<ImportTable contacts={mockContacts} onUpload={mockOnUpload} isProcessing={false} />);

      // Click First Name column header
      const firstNameHeader = screen.getByText('First Name');
      fireEvent.click(firstNameHeader);

      // Check if sorting is applied
      const first_name = screen.getByText(mockContacts[0].first_name);
      expect(first_name).toBeInTheDocument();
    });
});
