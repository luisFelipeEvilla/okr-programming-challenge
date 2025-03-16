import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { csvToContact } from './csvToContact.adapter';
import type { ContactCsvSchema } from '@/schemas/Contact';

describe('csvToContact', () => {
  const mockDate = new Date('2024-03-16T12:00:00Z');
  
  beforeEach(() => {
    // Mock Date to return a consistent timestamp
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should convert CSV data to Contact format', () => {
    const csvData: ContactCsvSchema = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4B',
      address_city: 'New York',
      address_state: 'NY',
      address_zip: '10001',
      address_country: 'USA',
      phone_number: '+1 (555) 123-4567',
    };

    const result = csvToContact(csvData);

    expect(result).toEqual({
      first_name: 'John',
      last_name: 'Doe',
      email_address: {
        address: 'john.doe@example.com',
        permission_to_send: 'implicit',
      },
      create_source: 'Account',
      street_addresses: [
        {
          kind: 'home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA',
        },
      ],
      phone_numbers: [
        {
          kind: 'home',
          phone_number: '+1 (555) 123-4567',
        },
      ],
      created_at: mockDate.toISOString(),
      updated_at: mockDate.toISOString(),
    });
  });

  it('should handle empty address fields', () => {
    const csvData: ContactCsvSchema = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      address_line_1: '',
      address_line_2: '',
      address_city: '',
      address_state: '',
      address_zip: '',
      address_country: '',
      phone_number: '',
    };

    const result = csvToContact(csvData);

    expect(result).toEqual({
      first_name: 'Jane',
      last_name: 'Smith',
      email_address: {
        address: 'jane.smith@example.com',
        permission_to_send: 'implicit',
      },
      create_source: 'Account',
      street_addresses: [
        {
          kind: 'home',
          street: '',
          city: '',
          state: '',
          postal_code: '',
          country: '',
        },
      ],
      phone_numbers: [
        {
          kind: 'home',
          phone_number: '',
        },
      ],
      created_at: mockDate.toISOString(),
      updated_at: mockDate.toISOString(),
    });
  });

  it('should handle special characters in address fields', () => {
    const csvData: ContactCsvSchema = {
      first_name: 'María',
      last_name: 'González',
      email: 'maria.gonzalez@example.com',
      address_line_1: 'Calle Mayor 123',
      address_line_2: 'Piso 2º',
      address_city: 'Madrid',
      address_state: 'Madrid',
      address_zip: '28001',
      address_country: 'España',
      phone_number: '+34 91 123 45 67',
    };

    const result = csvToContact(csvData);

    expect(result).toEqual({
      first_name: 'María',
      last_name: 'González',
      email_address: {
        address: 'maria.gonzalez@example.com',
        permission_to_send: 'implicit',
      },
      create_source: 'Account',
      street_addresses: [
        {
          kind: 'home',
          street: 'Calle Mayor 123',
          city: 'Madrid',
          state: 'Madrid',
          postal_code: '28001',
          country: 'España',
        },
      ],
      phone_numbers: [
        {
          kind: 'home',
          phone_number: '+34 91 123 45 67',
        },
      ],
      created_at: mockDate.toISOString(),
      updated_at: mockDate.toISOString(),
    });
  });

  it('should handle long address lines', () => {
    const csvData: ContactCsvSchema = {
      first_name: 'Robert',
      last_name: 'Johnson',
      email: 'robert.johnson@example.com',
      address_line_1: '1234 Very Long Street Name That Might Wrap To Multiple Lines',
      address_line_2: 'Suite 100, Building A, Floor 5',
      address_city: 'San Francisco',
      address_state: 'CA',
      address_zip: '94105',
      address_country: 'USA',
      phone_number: '+1 (415) 555-0123',
    };

    const result = csvToContact(csvData);

    expect(result).toEqual({
      first_name: 'Robert',
      last_name: 'Johnson',
      email_address: {
        address: 'robert.johnson@example.com',
        permission_to_send: 'implicit',
      },
      create_source: 'Account',
      street_addresses: [
        {
          kind: 'home',
          street: '1234 Very Long Street Name That Might Wrap To Multiple Lines',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94105',
          country: 'USA',
        },
      ],
      phone_numbers: [
        {
          kind: 'home',
          phone_number: '+1 (415) 555-0123',
        },
      ],
      created_at: mockDate.toISOString(),
      updated_at: mockDate.toISOString(),
    });
  });
});
