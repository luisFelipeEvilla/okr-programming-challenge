import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from '@/app/(auth)/login/page';
import '@testing-library/jest-dom/vitest';

describe('LoginPage', () => {
  it('renders login page correctly', () => {
    render(<LoginPage />);
    
    // Header elements
    expect(screen.getByText('Social Good Software')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /social good software/i })).toHaveAttribute('href', '/');
    
    // Main content
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    
    // Footer
    expect(screen.getByText(/need help\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /hello@socialgoodsoftware\.com/i }))
      .toHaveAttribute('href', 'mailto:hello@socialgoodsoftware.com');
    
    // Banner content
    expect(screen.getByText(/helping museums integrate with altru/i)).toBeInTheDocument();
    expect(screen.getByText(/the most complete integration solution/i)).toBeInTheDocument();
    
    // Feature list
    expect(screen.getByText('Deduplication')).toBeInTheDocument();
    expect(screen.getByText('Calendar Builder')).toBeInTheDocument();
    expect(screen.getByText('Email Designer')).toBeInTheDocument();
    expect(screen.getByText('Barcode Scanner')).toBeInTheDocument();
  });

  it('renders images with correct attributes', () => {
    render(<LoginPage />);
    
    const dashboardImage = screen.getAllByTestId('login-banner-image');

    expect(dashboardImage[0]).toHaveAttribute('width', '1200');
    expect(dashboardImage[0]).toHaveAttribute('height', '675');
    
    const mobileImage = screen.getByTestId('login-floating-image');
    expect(mobileImage).toHaveAttribute('width', '400');
    expect(mobileImage).toHaveAttribute('height', '300');
  });
}); 