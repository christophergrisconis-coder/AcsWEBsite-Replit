import { test, expect } from "@playwright/test";

test("partner resources page explains engagement paths and offers a briefing", async ({ page }) => {
  await page.goto("/partners");

  await expect(page).toHaveTitle("Partner Resources | Advanced Creation Studio");
  await expect(page.getByRole("heading", { name: /A clear route from mission to movement/ })).toBeVisible();
  await expect(page.getByText("State and federal agencies")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence should earn its place." })).toBeVisible();
  await expect(page.getByText("Source approval in progress")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore reentry pathways" })).toHaveAttribute(
    "href",
    "/work/reentry-pathways",
  );
  await expect(page.getByRole("link", { name: "Review outcomes" })).toHaveAttribute(
    "href",
    "/outcomes",
  );
  await expect(
    page.getByRole("link", { name: "Download capabilities statement" }),
  ).toHaveAttribute("href", "/api/partner-resources/capabilities.pdf");
  await expect(
    page.getByRole("link", { name: "View print layout" }),
  ).toHaveAttribute("href", "/partners/print?noprint=1");
  await expect(
    page.getByRole("link", { name: "View print layout" }),
  ).toHaveAttribute("target", "_blank");

  await page.getByRole("button", { name: "Request a briefing" }).first().click();
  await expect(
    page.getByRole("dialog", { name: "Agency briefing request" }),
  ).toBeVisible();
  await expect(page.locator("#bf-program")).toHaveValue("reentry-pathways");
  await page.getByRole("button", { name: "Close briefing request" }).click();

  await page.getByRole("button", { name: "Start a briefing" }).click();
  await expect(
    page.getByRole("dialog", { name: "Agency briefing request" }),
  ).toBeVisible();
  await expect(page.locator("#bf-program")).toHaveValue("general");
});

test("capabilities statement renders all procurement sections without browser errors", async ({
  page,
}) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  await page.goto("/partners/print?noprint=1");

  await expect(page).toHaveTitle(
    "Partner Capabilities Statement | Advanced Creation Studio",
  );
  await expect(
    page.getByRole("heading", { name: "A clear route from mission to movement." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Open without auto-print" })).toHaveAttribute(
    "href",
    /noprint=1/,
  );

  await expect(page.getByRole("heading", { name: "Who this is for" })).toBeVisible();
  await expect(page.getByText("State and federal agencies")).toBeVisible();
  await expect(page.getByText("Employer and community partners")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Three connected pillars" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reentry education" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reintegration support" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "AI and workforce readiness" }),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Built for execution" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Strategic messaging" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Media production" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contract readiness" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Digital products and outcomes reporting" }),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Ways to engage" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Program delivery" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Workforce readiness", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Communications", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Evidence and tools", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download PDF" }),
  ).toHaveAttribute("href", "/api/partner-resources/capabilities.pdf");
  await expect(
    page.getByRole("link", { name: "Request a briefing" }),
  ).toHaveAttribute("href", "/partners");

  expect(browserErrors).toEqual([]);
});

test("capabilities statement fits the supported letter print viewport", async ({ page }) => {
  // 8.5 x 11 inches at the browser's 96 CSS pixels per inch.
  await page.setViewportSize({ width: 816, height: 1056 });
  await page.goto("/partners/print?noprint=1");
  await page.emulateMedia({ media: "print" });

  const layout = await page.locator(".acs-capabilities-root").evaluate((root) => {
    const rootRect = root.getBoundingClientRect();
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".acs-capabilities-section, .acs-capabilities-cta",
      ),
    ).map((section) => {
      const rect = section.getBoundingClientRect();
      const content = Array.from(section.querySelectorAll<HTMLElement>("*")).map(
        (element) => {
          const elementRect = element.getBoundingClientRect();
          return {
            right: elementRect.right,
            bottom: elementRect.bottom,
            left: elementRect.left,
            top: elementRect.top,
          };
        },
      );

      return {
        bottom: rect.bottom,
        content,
        left: rect.left,
        right: rect.right,
        top: rect.top,
      };
    });

    return {
      clientWidth: document.documentElement.clientWidth,
      mediaIsPrint: window.matchMedia("print").matches,
      root: {
        bottom: rootRect.bottom,
        left: rootRect.left,
        right: rootRect.right,
        top: rootRect.top,
      },
      scrollWidth: document.documentElement.scrollWidth,
      sections,
      printPadding: getComputedStyle(root).padding,
    };
  });

  expect(layout.mediaIsPrint).toBe(true);
  expect(layout.printPadding).toBe("0px");
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);

  for (const section of layout.sections) {
    expect(section.left).toBeGreaterThanOrEqual(layout.root.left);
    expect(section.right).toBeLessThanOrEqual(layout.root.right);
    for (const element of section.content) {
      expect(element.left).toBeGreaterThanOrEqual(section.left);
      expect(element.right).toBeLessThanOrEqual(section.right);
      expect(element.bottom).toBeLessThanOrEqual(layout.root.bottom);
    }
  }

  for (let index = 1; index < layout.sections.length; index += 1) {
    expect(layout.sections[index].top).toBeGreaterThanOrEqual(
      layout.sections[index - 1].bottom,
    );
  }
});
