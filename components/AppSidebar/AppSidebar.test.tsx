import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppSidebar } from '@/components/AppSidebar/AppSidebar';
import { removeClientSideCookie } from '@/lib/utils';
import { cc_access_token_cookie_name } from '@/config';
import { routeGroups } from '@/routes';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@testing-library/jest-dom/vitest';
import { redirect } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => {
  const redirect = vi.fn();
  return { redirect };
});

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
  removeClientSideCookie: vi.fn(),
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock NavMain component
vi.mock('@/components/AppSidebar/NavMain', () => ({
  NavMain: ({ title, items }: { title: string; items: any[] }) => (
    <div data-testid="nav-main">
      <div data-testid="nav-title">{title}</div>
      <div data-testid="nav-items">{items.length} items</div>
    </div>
  ),
}));

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </TooltipProvider>
  );
}

// Custom render function
function customRender(ui: React.ReactElement) {
  return render(ui, {
    wrapper: TestWrapper,
  });
}

describe('AppSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sidebar with logo', () => {
    customRender(<AppSidebar />);
    
    const logo = screen.getByAltText('Social Good Software');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
    expect(logo).toHaveAttribute('width', '48');
    expect(logo).toHaveAttribute('height', '48');
  });

  it('renders navigation with correct route group', () => {
    customRender(<AppSidebar />);
    
    const navMain = screen.getByTestId('nav-main');
    const navTitle = screen.getByTestId('nav-title');
    
    expect(navMain).toBeInTheDocument();
    expect(navTitle).toHaveTextContent(routeGroups[0].title);
  });

  it('handles logout correctly', () => {
    customRender(<AppSidebar />);
    
    const signOutButton = screen.getByTestId('log-out-button');
    fireEvent.click(signOutButton);
    
    expect(removeClientSideCookie).toHaveBeenCalledWith(cc_access_token_cookie_name);
    expect(redirect).toHaveBeenCalledWith('/login');
  });
}); 