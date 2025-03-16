import { vi, describe, it, expect, beforeEach } from 'vitest';
import { middleware } from '@/middleware';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cc_access_token_cookie_name } from '@/config';

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn().mockImplementation((url) => ({ url })),
    next: vi.fn().mockReturnValue({ type: 'next' }),
  },
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to create mock request
  function createMockRequest(path: string) {
    return {
      nextUrl: {
        pathname: path,
        searchParams: new URLSearchParams(),
      },
      url: `https://example.com${path}`,
    } as any;
  }

  // Helper function to mock cookies
  function mockCookies(hasToken: boolean) {
    const get = vi.fn().mockReturnValue(hasToken ? { value: 'token' } : undefined);
    (cookies as any).mockReturnValue({ get });
    return { get };
  }

  describe('Public Paths', () => {
    it.each([
      '/login',
      '/api/auth/callback/constantcontact',
      '/_next/something',
      '/images/test.png',
      '/favicon.ico'
    ])('should allow access to public path: %s', async (path) => {
      mockCookies(false);
      const request = createMockRequest(path);
      const response = await middleware(request);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe('Protected Paths', () => {
    it.each([
      '/dashboard',
      '/dashboard/contacts',
      '/settings'
    ])('should redirect to login if no token present: %s', async (path) => {
      mockCookies(false);
      const request = createMockRequest(path);
      await middleware(request);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          searchParams: expect.any(URLSearchParams),
          pathname: '/login'
        })
      );
      expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it.each([
      '/dashboard',
      '/dashboard/contacts',
      '/settings'
    ])('should allow access to protected path with valid token: %s', async (path) => {
      mockCookies(true);
      const request = createMockRequest(path);
      await middleware(request);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe('Login Path Behavior', () => {
    it('should redirect to dashboard if accessing login with valid token', async () => {
      mockCookies(true);
      const request = createMockRequest('/login');
      await middleware(request);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/dashboard/contacts'
        })
      );
      expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it('should allow access to login page without token', async () => {
      mockCookies(false);
      const request = createMockRequest('/login');
      await middleware(request);

      expect(NextResponse.next).toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe('Cookie Handling', () => {
    it('should check for correct cookie name', async () => {
      const cookieGet = mockCookies(false).get;
      const request = createMockRequest('/dashboard');
      await middleware(request);

      expect(cookieGet).toHaveBeenCalledWith(cc_access_token_cookie_name);
    });
  });

  describe('Redirect Behavior', () => {
    it('should preserve original path in redirect to login', async () => {
      mockCookies(false);
      const originalPath = '/dashboard/contacts';
      const request = createMockRequest(originalPath);
      await middleware(request);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          searchParams: expect.any(URLSearchParams)
        })
      );

      const redirectCall = (NextResponse.redirect as any).mock.calls[0][0];
      expect(redirectCall.searchParams.get('from')).toBe(originalPath);
    });
  });
});
