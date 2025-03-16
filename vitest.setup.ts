import "@testing-library/jest-dom/vitest";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Extend Vitest's expect method with testing-library methods
expect.extend({});

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Only mock window-specific APIs in jsdom environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
  });
} 