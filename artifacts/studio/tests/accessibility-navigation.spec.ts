import { test, expect } from "@playwright/test";

test.describe("keyboard navigation", () => {
  test("keeps the mobile navigation accessible and returns focus on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation menu" }).click();

    const mobileNavigation = page.locator("#mobile-navigation");
    await expect(mobileNavigation).toBeVisible();
    await expect(page.getByRole("link", { name: "Impact", exact: true })).toBeFocused();
    await expect(
      page.getByRole("button", { name: "Close navigation menu" }),
    ).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");

    await expect(mobileNavigation).toBeHidden();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  });

  test("traps the briefing dialog and restores focus on Escape", async ({ page }) => {
    await page.goto("/");

    const briefingButton = page.getByRole("button", {
      name: "Request a program briefing",
    });
    await briefingButton.click();

    await expect(
      page.getByRole("dialog", { name: "Agency briefing request" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close briefing request" }),
    ).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("dialog", { name: "Agency briefing request" }),
    ).toBeHidden();
    await expect(briefingButton).toBeFocused();
  });
});