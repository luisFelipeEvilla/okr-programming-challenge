import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ContactsTable, defaultColumns } from "./ContactsTable";
import { ContactSchema } from "@/schemas/Contact";
import { mockContacts } from "@/mock/contacts";

describe("ContactsTable", () => {
  it("renders table with correct columns", () => {
    render(
      <ContactsTable
        data={mockContacts}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );

    // Check if all column headers are present
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Created At")).toBeInTheDocument();
  });

  it("displays contact data correctly", () => {
    render(
      <ContactsTable
        data={mockContacts}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );

    // Check if contact data is displayed
    expect(screen.getByText(mockContacts[0].first_name)).toBeInTheDocument();
    expect(screen.getByText(mockContacts[0].last_name)).toBeInTheDocument();
    expect(
      screen.getByText(mockContacts[0].email_address.address)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockContacts[0].phone_numbers?.[0]?.phone_number || "")
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockContacts[0].street_addresses?.[0]?.street || "")
    ).toBeInTheDocument();
  });

  it('displays "No contacts found" when data is empty', () => {
    render(
      <ContactsTable
        data={[]}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );
    expect(screen.getByText("No contacts found.")).toBeInTheDocument();
  });

  it("sorts columns when clicking sort buttons", () => {
    render(
      <ContactsTable
        data={mockContacts}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );

    // Click First Name column header
    const firstNameHeader = screen.getByText("First Name");
    fireEvent.click(firstNameHeader);

    // Get all rows
    const first_name = screen.getByText(mockContacts[1].first_name);
    expect(first_name).toBeInTheDocument();
  });

  it("handles pagination controls correctly", async () => {
    // Create more than 10 contacts to test pagination
    const manyContacts = Array.from({ length: 15 }, (_, i) => ({
      ...mockContacts[0],
      first_name: `Contact ${i + 1}`,
      email_address: {
        address: `contact${i + 1}@example.com`,
        permission_to_send: "implicit",
      },
    }));

    const mockOnPageChange = vi.fn();
    const { rerender } = render(
      <ContactsTable
        data={manyContacts}
        columns={defaultColumns}
        currentPage={1}
        hasNextPage={true}
        onPageChange={mockOnPageChange}
        pageSize={10}
        count={manyContacts.length}
        isLoading={false}
      />
    );

    // Check initial state
    expect(
      screen.getByText(`Showing 1-10 of ${manyContacts.length} contacts`)
    ).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    // Click next page
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    // Verify onPageChange was called
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    // Simulate page change by re-rendering with updated props
    rerender(
      <ContactsTable
        data={manyContacts.slice(10, 15)}
        columns={defaultColumns}
        currentPage={2}
        hasNextPage={false}
        onPageChange={mockOnPageChange}
        pageSize={10}
        count={manyContacts.length}
        isLoading={false}
      />
    );

    // Check updated state
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  it("disables pagination buttons appropriately", () => {
    render(
      <ContactsTable
        data={mockContacts}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );

    // With only 2 contacts, both buttons should be disabled
    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("truncates long text in cells", () => {
    const longContact = {
      ...mockContacts[0],
      email_address: {
        address: "very.long.email.address.that.should.be.truncated@example.com",
        permission_to_send: "implicit",
      },
    };

    render(
      <ContactsTable
        data={[longContact]}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );

    const emailCell = screen.getByText(/very.long.email/);
    expect(emailCell).toHaveClass("truncate");
  });

  it("formats dates correctly", () => {
    render(
      <ContactsTable
        data={mockContacts}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );

    // Check if dates are formatted
    if (!mockContacts[0].created_at) {
      throw new Error("Created at is undefined");
    }

    const date = new Date(mockContacts[0].created_at).toLocaleString();
    const dateCell = screen.getByText(date);
    expect(dateCell).toBeInTheDocument();
  });

  it("handles custom columns prop", () => {
    const customColumns = [
      {
        accessorKey: "first_name",
        header: "Custom First Name",
        cell: ({ row }: any) => <div>Custom: {row.getValue("first_name")}</div>,
      },
    ];

    render(
      <ContactsTable
        data={mockContacts}
        columns={customColumns}
        currentPage={1}
        hasNextPage={false}
        onPageChange={async () => {}}
      />
    );

    expect(screen.getByText("Custom First Name")).toBeInTheDocument();
    expect(screen.getByText("Custom: John")).toBeInTheDocument();
  });
});
