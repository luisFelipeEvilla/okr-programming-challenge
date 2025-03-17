import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components/Forms/LoginForm/LoginForm';
import { auth_url, client_id, redirect_uri } from '@/config';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('LoginForm', () => {
  beforeEach(() => {
    // Mock window.location
    const location = { href: '' } as Location;
    Object.defineProperty(window, 'location', {
      value: location,
      writable: true
    });
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByRole('heading', { name: /login to your account/i })).toBeInTheDocument();
    expect(screen.getByText(/connect social good software/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('redirects to OAuth URL with correct parameters when login button is clicked', () => {
    render(<LoginForm />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    const expectedUrl = new URL(auth_url);
    expectedUrl.searchParams.set('client_id', client_id);
    expectedUrl.searchParams.set('redirect_uri', redirect_uri);
    expectedUrl.searchParams.set('response_type', 'code');
    expectedUrl.searchParams.set('scope', 'contact_data');
    expectedUrl.searchParams.set('state', '235o250eddsdff');

    expect(window.location.href).toBe(expectedUrl.toString());
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<LoginForm className={customClass} />);
    
    const form = screen.getByRole('form');
    expect(form).toHaveClass(customClass);
  });
}); 