import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GET } from '@/app/api/auth/callback/constantcontact/route';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { cc_access_token_cookie_name, client_id, client_secret, redirect_uri, token_url } from '@/config';

// Mock axios
vi.mock('axios');

// Mock NextResponse
const mockCookieSet = vi.fn();
const mockRedirectResponse = {
  cookies: {
    set: mockCookieSet
  }
};

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn().mockImplementation((url) => ({
      ...mockRedirectResponse,
      url: url.toString()
    }))
  }
}));

describe('Constant Contact Callback Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if code is missing', async () => {
    const request = new Request('https://example.com/api/auth/callback/constantcontact');
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing code');
  });

  it('successfully handles valid authorization code', async () => {
    // Mock successful token response
    const mockTokenResponse = {
      data: {
        access_token: 'mock_access_token',
        expires_in: 3600,
      },
    };
    (axios.post as any).mockResolvedValueOnce(mockTokenResponse);

    // Create request with authorization code
    const request = new Request(
      'https://example.com/api/auth/callback/constantcontact?code=valid_code'
    );

    const response = await GET(request);

    // Verify axios call
    expect(axios.post).toHaveBeenCalledWith(
      token_url,
      {
        code: 'valid_code',
        redirect_uri,
        grant_type: 'authorization_code',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
        },
      }
    );

    // Verify redirect and cookie
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.any(URL)
    );

    // Verify cookie was set with correct parameters
    expect(mockCookieSet).toHaveBeenCalledWith({
      name: cc_access_token_cookie_name,
      value: 'mock_access_token',
      httpOnly: false,
      expires: expect.any(Date),
      path: '/',
    });
  });

  it('handles token fetch error', async () => {
    // Mock axios error
    (axios.post as any).mockRejectedValueOnce(new Error('Network error'));

    const request = new Request(
      'https://example.com/api/auth/callback/constantcontact?code=valid_code'
    );

    const response = await GET(request);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Error fetching access token');
  });

  it('sets correct cookie expiration', async () => {
    const expiresIn = 3600; // 1 hour
    const mockTokenResponse = {
      data: {
        access_token: 'mock_access_token',
        expires_in: expiresIn,
      },
    };
    (axios.post as any).mockResolvedValueOnce(mockTokenResponse);

    const request = new Request(
      'https://example.com/api/auth/callback/constantcontact?code=valid_code'
    );

    await GET(request);

    // Verify cookie expiration
    const cookieCall = mockCookieSet.mock.calls[0][0];
    const expectedExpiration = new Date(Date.now() + expiresIn * 1000);
    const actualExpiration = cookieCall.expires;
    const timeDifference = Math.abs(expectedExpiration.getTime() - actualExpiration.getTime());
    
    expect(timeDifference).toBeLessThan(1000); // Less than 1 second difference
  });
}); 