import { test, expect } from "@playwright/test";

test("navigation is correct", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Home | Mohd Saquib");

  await page.goto("/projects/");

  await page.goto("/work/index.html");

  await page.goto("/projects/project-4/index.html");
});

test("meta is correct", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Home | Mohd Saquib");

  await page.goto("/projects/project-4/index.html");
  await expect(page).toHaveTitle("Implementing Semantic Versioning on my Website with Jenkins | Mohd Saquib");
});