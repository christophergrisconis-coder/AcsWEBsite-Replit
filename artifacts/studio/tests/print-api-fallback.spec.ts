import { test, expect, type Page } from '@playwright/test';

const expectedProgramTitles = ['Reentry Pathways', 'AI Upskilling', 'Direct Placement'];

async function expectEveryProgramSectionToBePresent(page: Page) {
  await expect(page.locator('.acs-print-program')).toHaveCount(expectedProgramTitles.length);
  for (const title of expectedProgramTitles) {
    await expect(page.locator('.acs-print-program').filter({ hasText: title })).toHaveCount(1);
  }
}

/**
 * Regression test for the print-page API fallback behaviour.
 *
 * When /api/outcomes is unreachable (502), fetchOutcomesWithFallback in
 * use-outcomes.ts must silently serve the static fallback data so the print
 * page still renders useful content instead of showing the "Program not found"
 * error body.
 *
 * Uses ?noprint=1 to suppress the auto-print dialog during testing.
 */

test('print page renders static fallback content when /api/outcomes returns 502', async ({ page }) => {
  // Mock the outcomes API to return a server error before navigating
  await page.route('**/api/outcomes', (route) => {
    route.fulfill({ status: 502, body: 'Bad Gateway' });
  });

  await page.goto('/outcomes/print?noprint=1');

  // Wait for the fetch to settle: the loading banner disappears once
  // isFetching becomes false (after fetchOutcomesWithFallback resolves).
  await expect(page.getByText('Loading latest program data')).not.toBeVisible({
    timeout: 15_000,
  });

  // Check the complete document before a user saves it through the browser's
  // print dialog. Every fallback program must survive the export path.
  await expectEveryProgramSectionToBePresent(page);

  // The "Program not found" error body must not appear — the fallback
  // ensures there is always valid data to render.
  await expect(page.getByText('Program not found')).not.toBeVisible();
});

test('print page renders static fallback content when /api/outcomes returns no programs', async ({ page }) => {
  // A newly initialized database can return a successful response before
  // program records have been seeded. The print summary should still contain
  // useful static content in that case.
  await page.route('**/api/outcomes', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ programs: [], aggregateImpact: null }),
    });
  });

  await page.goto('/outcomes/print?noprint=1');

  await expect(page.getByText('Loading latest program data')).not.toBeVisible({
    timeout: 15_000,
  });

  await expectEveryProgramSectionToBePresent(page);
  await expect(page.getByText('Program not found')).not.toBeVisible();
  await expect(page.getByText('Something went wrong')).not.toBeVisible();
});

test('print page preserves every live program section before PDF export', async ({ page }) => {
  await page.route('**/api/outcomes', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        programs: expectedProgramTitles.map((programTitle, index) => ({
          programId: programTitle.toLowerCase().replaceAll(' ', '-'),
          programTitle,
          tagline: `${programTitle} outcomes`,
          measurementPeriod: `Outcome window ${index + 1}`,
          cohortContext: [],
          metrics: [
            {
              value: `${index + 1}0%`,
              label: `${programTitle} result`,
            },
          ],
          definitions: [],
        })),
        aggregateImpact: null,
      }),
    });
  });

  await page.goto('/outcomes/print?noprint=1');

  await expect(page.getByText('Loading latest program data')).not.toBeVisible({
    timeout: 15_000,
  });
  await expectEveryProgramSectionToBePresent(page);
  await expect(page.getByText('Program not found')).not.toBeVisible();
  await expect(page.getByText('Something went wrong')).not.toBeVisible();
});
