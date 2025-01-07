import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.APP_URL || "http://localhost:5173");
});

test("should open and close a dialog window", async ({ page }) => {
  // Button click "View More"
  const viewMoreButton = page.locator("button.view-more-btn").first();
  await viewMoreButton.click();

  // Checking that dialog is open
  const dialog = page.locator("div[data-state='open']");
  await expect(dialog).toBeVisible();

  const characterName = "Rick Sanchez";
  const dialogTitle = dialog.locator("h2");
  await expect(dialogTitle).toHaveText(characterName);

  // Checking for image
  const image = dialog.locator("img");
  await expect(image).toHaveAttribute("src", /.+/);
  await expect(image).toBeVisible();

  // Checking for additional info
  const status = dialog.locator("p:has-text('Status:')");
  await expect(status).toHaveText("Status: Alive");

  const species = dialog.locator("p:has-text('Species:')");
  await expect(species).toHaveText("Species: Human");

  const location = dialog.locator("p:has-text('Location:')");
  await expect(location).toHaveText("Location: Citadel of Ricks");

  const gender = dialog.locator("p:has-text('Gender:')");
  await expect(gender).toHaveText("Gender: Male");

  // button click "Close"
  const closeButton = dialog.locator("button:has-text('Close')");
  await closeButton.click();

  // checking that dialog is closed
  await expect(dialog).not.toBeVisible();
});
