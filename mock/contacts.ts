import { Contact, StreetAddress, StreetAddressKind } from "@prisma/client";
import { ContactSchema } from "@/schemas/Contact";

type ContactStatus = "pending" | "success" | "error";

interface ContactWithStatus extends ContactSchema {
  status: ContactStatus;
  errorMessage?: string;
}

// contact with street address
export const mockContacts: ContactWithStatus[] = [
  {
    first_name: "John",
    last_name: "Doe",
    email_address: {
      address: "john.doe@example.com",
      permission_to_send: "implicit",
    },
    create_source: "Account",
    street_addresses: [
      {
        kind: "home" as const,
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postal_code: "10001",
        country: "USA",
      },
    ],
    phone_numbers: [
      {
        kind: "home" as const,
        phone_number: "+1 (555) 123-4567",
      },
    ],
    created_at: "2024-03-16T12:00:00Z",
    status: "pending",
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email_address: {
      address: "jane.smith@example.com",
      permission_to_send: "implicit",
    },
    create_source: "Account",
    street_addresses: [
      {
        kind: "home" as const,
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        postal_code: "90001",
        country: "USA",
      },
    ],
    phone_numbers: [
      {
        kind: "home" as const,
        phone_number: "+1 (555) 987-6543",
      },
    ],
    created_at: "2024-03-16T13:00:00Z",
    status: "success",
  },
  {
    first_name: "Bob",
    last_name: "Wilson",
    email_address: {
      address: "bob.wilson@example.com",
      permission_to_send: "implicit",
    },
    create_source: "Account",
    street_addresses: [
      {
        kind: "home" as const,
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        postal_code: "60601",
        country: "USA",
      },
    ],
    phone_numbers: [
      {
        kind: "home" as const,
        phone_number: "+1 (555) 456-7890",
      },
    ],
    created_at: "2024-03-16T14:00:00Z",
    status: "error",
    errorMessage: "Duplicate email address",
  },
];
