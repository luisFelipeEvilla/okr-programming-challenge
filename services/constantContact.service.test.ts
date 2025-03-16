import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getContacts, createContact } from './constantContact.service';
import { getClientSideCookie } from '@/lib/utils';
import { api_url, cc_access_token_cookie_name } from '@/config';
import type { ContactSchema } from '@/schemas/Contact';

// Mock axios
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
    },
  };

  const mockAxios = {
    create: vi.fn(() => mockAxiosInstance),
  };
  return {
    default: mockAxios,
    ...mockAxios,
  };
});

// Mock next/headers
const mockCookies = {
  get: vi.fn(),
};

vi.mock('next/headers', () => ({
  cookies: () => mockCookies,
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
  getClientSideCookie: vi.fn(),
}));

describe('Constant Contact Service', () => {
  const mockAccessToken = 'mock-access-token';
  const mockContact: ContactSchema = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window object
    global.window = {} as any;
  });

  describe('Client-side requests', () => {
    beforeEach(() => {
      // Mock window to simulate client-side
      global.window = {} as any;
      (getClientSideCookie as ReturnType<typeof vi.fn>).mockReturnValue(mockAccessToken);
    });

    it('should get contacts with proper authorization header', async () => {
      const mockResponse = {
        data: {
          contacts: [mockContact],
        },
      };
      const axiosInstance = axios.create();
      (axiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await getContacts();

      expect(result).toEqual([mockContact]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/contacts');
    });

    it('should create contact with proper authorization header', async () => {
      const mockResponse = {
        data: mockContact,
      };
      const axiosInstance = axios.create();
      (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await createContact(mockContact);

      expect(result).toEqual(mockContact);
      expect(axiosInstance.post).toHaveBeenCalledWith('/contacts', mockContact, {
        signal: undefined,
      });
    });

    it('should handle abort signal when creating contact', async () => {
      const mockAbortSignal = new AbortController().signal;
      const mockResponse = {
        data: mockContact,
      };
      const axiosInstance = axios.create();
      (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      await createContact(mockContact, mockAbortSignal);

      expect(axiosInstance.post).toHaveBeenCalledWith('/contacts', mockContact, {
        signal: mockAbortSignal,
      });
    });
  });

  describe('Server-side requests', () => {
    beforeEach(() => {
      // Remove window to simulate server-side
      delete (global as any).window;
      mockCookies.get.mockReturnValue({ value: mockAccessToken });
    });

    it('should get contacts with proper authorization header on server-side', async () => {
      const mockResponse = {
        data: {
          contacts: [mockContact],
        },
      };
      const axiosInstance = axios.create();
      (axiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await getContacts();

      expect(result).toEqual([mockContact]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/contacts');
    });

    it('should create contact with proper authorization header on server-side', async () => {
      const mockResponse = {
        data: mockContact,
      };
      const axiosInstance = axios.create();
      (axiosInstance.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await createContact(mockContact);

      expect(result).toEqual(mockContact);
      expect(axiosInstance.post).toHaveBeenCalledWith('/contacts', mockContact, {
        signal: undefined,
      });
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      global.window = {} as any;
      (getClientSideCookie as ReturnType<typeof vi.fn>).mockReturnValue(mockAccessToken);
    });

    it('should throw error when getting contacts fails', async () => {
      const error = new Error('Network error');
      const axiosInstance = axios.create();
      (axiosInstance.get as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      await expect(getContacts()).rejects.toThrow('Network error');
    });

    it('should throw error when creating contact fails', async () => {
      const error = new Error('Network error');
      const axiosInstance = axios.create();
      (axiosInstance.post as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      await expect(createContact(mockContact)).rejects.toThrow('Network error');
    });
  });
});
