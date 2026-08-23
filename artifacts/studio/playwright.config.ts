import { defineConfig } from '@playwright/test';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * Playwright configuration for the Studio artifact.
 *
 * Runs against a dedicated Vite dev-server instance on port 5174 so it never
 * collides with the primary dev-server workflow (which uses an env-assigned
 * port).  Automatically locates the Replit-provided Chromium binary from the
 * nix store so the test works without any environment-variable ceremony.
 */

/**
 * Find a working Chromium binary.
 * Priority:
 *  1. REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE env var (set by Replit)
 *  2. Programmatic search of /nix/store for playwright-browsers Chromium
 */
function findChromium(): string | undefined {
  const fromEnv = process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const nixStore = '/nix/store';
  if (!existsSync(nixStore)) return undefined;

  try {
    const entries = readdirSync(nixStore);
    for (const entry of entries) {
      if (!entry.includes('playwright-browsers')) continue;
      const browsersDir = join(nixStore, entry);
      try {
        const subdirs = readdirSync(browsersDir);
        for (const sub of subdirs) {
          if (!sub.startsWith('chromium')) continue;
          const candidate = join(browsersDir, sub, 'chrome-linux', 'chrome');
          if (existsSync(candidate)) return candidate;
        }
      } catch {
        // not a readable directory — skip
      }
    }
  } catch {
    // /nix/store not searchable
  }

  return undefined;
}

const chromiumExecutable = findChromium();

export default defineConfig({
  testDir: './tests',
  // Run tests serially to keep port usage predictable
  fullyParallel: false,
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
    // executablePath lives inside launchOptions, not directly in use
    ...(chromiumExecutable
      ? { launchOptions: { executablePath: chromiumExecutable } }
      : {}),
  },
  projects: [
    {
      name: 'chromium',
    },
  ],
  webServer: {
    // Launch a dedicated Vite instance for tests on a fixed port
    command: 'node_modules/.bin/vite --config vite.config.ts --host 0.0.0.0',
    url: 'http://localhost:5174',
    // In CI always start fresh; locally reuse an existing server if present
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: '5174',
      BASE_PATH: '/',
    },
  },
});
