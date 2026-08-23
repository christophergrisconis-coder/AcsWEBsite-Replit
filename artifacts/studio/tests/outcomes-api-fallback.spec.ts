import { test, expect } from '@playwright/test';

/**
 * Regression test for the main outcomes page API fallback behaviour.
 *
 * The page shares fetchOutcomesWithFallback with the print view. If the API
 * returns an error, it should still render the static program data and avoid
 * showing an error state to visitors.
 */

test('outcomes page renders a program when /api/outcomes returns 502', async ({ page }) => {
  // Mock the outcomes API to return a server error before navigating.
  await page.route('**/api/outcomes', (route) => {
    route.fulfill({ status: 502, body: 'Bad Gateway' });
  });

  await page.goto('/outcomes');

  // The static fallback contains "Reentry Pathways" as the first program.
  await expect(page.getByRole('heading', { name: 'Reentry Pathways' })).toBeVisible();

  // A failed live fetch must not surface an error state because the fallback
  // data is returned successfully from fetchOutcomesWithFallback.
  await expect(
    page.getByText('Showing last-known figures — live data temporarily unavailable.'),
  ).not.toBeVisible();
});

test('outcomes page renders static programs when the API returns an empty list', async ({ page }) => {
  await page.route('**/api/outcomes', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ programs: [], aggregateImpact: null }),
    });
  });

  await page.goto('/outcomes');

  await expect(page.getByRole('heading', { name: 'Reentry Pathways' })).toBeVisible();
  await expect(
    page.getByText('Showing last-known figures — live data temporarily unavailable.'),
  ).not.toBeVisible();
  await expect(page.getByText('Something went wrong')).not.toBeVisible();
});