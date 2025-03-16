import { expect, afterEach, vi } from 'vitest';

// Mock fetch if needed in Node environment
global.fetch = vi.fn();
global.Request = vi.fn(); 