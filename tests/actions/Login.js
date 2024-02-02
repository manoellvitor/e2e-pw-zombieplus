const { expect } = require("@playwright/test");

export class Login {
  constructor(page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto("/admin/login");

    const loginForm = this.page.locator(".login-form");
    await expect(loginForm).toBeVisible();
  }

  async submitForm(email, password) {
    await this.page.getByPlaceholder("E-mail").fill(email);
    await this.page.getByPlaceholder("Senha").fill(password);
    await this.page.getByRole("button", { name: "Entrar" }).click();
  }

  async isLoggedIn() {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page).toHaveURL(/.*admin/);
  }

  async alertHaveText(text) {
    const alert = await this.page.locator("span[class$=alert]");
    await expect(alert).toHaveText(text);
  }

  async isLoggedIn() {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page).toHaveURL(/.*admin/);
  }
}
