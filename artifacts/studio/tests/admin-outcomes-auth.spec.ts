import { test, expect } from '@playwright/test';

test('shows an error when saving metrics with an invalid admin token', async ({ page }) => {
  await page.route('**/api/outcomes', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        programs: [
          {
            programId: 'reentry-pathways',
            programTitle: 'Reentry Pathways',
            tagline: 'Measured reintegration outcomes',
            measurementPeriod: '12 months',
            cohortContext: [],
            metrics: [
              {
                value: '68%',
                label: 'Secured employment within 90 days',
              },
            ],
            definitions: [],
          },
        ],
        aggregateImpact: {
          headline: 'Aggregate impact',
          note: 'Across programs',
          stats: [],
        },
      }),
    }),
  );

  // The unlock flow performs a benign aggregate PUT before showing the editors.
  await page.route('**/api/outcomes/aggregate', async (route) => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
      return;
    }
    await route.continue();
  });

  let programPutSeen = false;
  await page.route('**/api/outcomes/programs/reentry-pathways', async (route) => {
    expect(route.request().method()).toBe('PUT');
    programPutSeen = true;
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Invalid admin token' }),
    });
  });

  await page.goto('/admin/outcomes');

  const inputs = page.locator('input');
  await inputs.nth(0).fill('invalid-token');
  await page.getByRole('button', { name: 'Unlock' }).click();

  await expect(page.getByRole('heading', { name: 'Reentry Pathways' })).toBeVisible();
  await inputs.nth(1).fill('99%');
  await page.getByRole('button', { name: 'Save metrics' }).click();

  await expect(page.getByText('Invalid admin token')).toBeVisible();
  expect(programPutSeen).toBe(true);
});