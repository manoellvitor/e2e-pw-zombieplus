const { expect } = require("@playwright/test");

export class Toast {
  constructor(page) {
    this.page = page;
  }

  async containText(message) {
    const toastMessage = message;
    const locator = this.page.locator(".toast");

    await expect(locator).toContainText(toastMessage);
    await expect(locator).toBeHidden({ timeout: 7000 });
  }
}
