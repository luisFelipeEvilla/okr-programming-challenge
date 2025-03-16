import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { usePathname } from "next/navigation";
import { routeGroups } from "@/routes";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SidebarProvider } from "../ui/sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </TooltipProvider>
  );
}

function customRender(ui: React.ReactElement) {
  return render(ui, {
    wrapper: TestWrapper,
  });
}

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header with initial route only", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");

    customRender(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders breadcrumb with nested route", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/contacts");

    customRender(<Header />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();

    // First item should be a link, last item should be text
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByText("Contacts")).not.toHaveAttribute("href");
  });

  it("renders breadcrumb with deeply nested route", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard/contacts/import");

    customRender(<Header />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("Import")).toBeInTheDocument();

    // Check links and current page
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: "Contacts" })).toHaveAttribute(
      "href",
      "/dashboard/contacts"
    );
    expect(screen.getByText("Import")).not.toHaveAttribute("href");
  });

  it("handles unknown routes gracefully", () => {
    vi.mocked(usePathname).mockReturnValue("/unknown/route");

    customRender(<Header />);

    // Should render the header structure but without breadcrumbs
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders sidebar trigger button", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");

    customRender(<Header />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders separator between sidebar trigger and breadcrumbs", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");

    customRender(<Header />);

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("matches all route groups", () => {
    // Test each route group's initial route
    routeGroups.forEach((group) => {
      vi.mocked(usePathname).mockReturnValue(group.initialRoute.url);

      const { unmount } = customRender(<Header />);
      expect(screen.getByText(group.initialRoute.title)).toBeInTheDocument();
      unmount();
    });
  });
});
