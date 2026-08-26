import { test, expect } from "@playwright/test";

test("impact area pages expose route-specific social and service metadata", async ({ page }) => {
  await page.goto("/work/reentry-pathways");

  await expect(page).toHaveTitle("Reentry Pathways | Advanced Creation Studio");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Reentry Pathways | Advanced Creation Studio",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /acs-confinement-to-horizon/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://advancedcreationstudio.com/work/reentry-pathways",
  );

  const structuredData = await page
    .locator('script[data-page-structured-data="true"]')
    .textContent();
  expect(JSON.parse(structuredData ?? "{}")).toMatchObject({
    "@type": "Service",
    name: "Reentry Pathways",
  });
});

test("stale printable program links are marked unavailable to crawlers", async ({ page }) => {
  await page.goto("/outcomes/print?program=renamed-program&noprint=1");

  await expect(page).toHaveTitle(
    "Program One-Pager Unavailable | Advanced Creation Studio",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://advancedcreationstudio.com/outcomes/print?program=renamed-program",
  );
  await expect(page.getByText("Program not found")).toBeVisible();
});
