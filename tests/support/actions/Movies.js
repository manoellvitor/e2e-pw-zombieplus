const { expect } = require("@playwright/test");

export class Movies {
  constructor(page) {
    this.page = page;
  }

  async openForm() {
    await this.page.locator('a[href$="register"]').click();
  }

  async submitForm() {
    await this.page.getByRole("button", { name: "Cadastrar" }).click();
  }

  async create({ title, overview, company, release_year, cover, featured }) {
    await this.openForm();
    await this.page.getByLabel("Titulo do filme").fill(title);
    await this.page.getByLabel("Sinopse").fill(overview);

    await this.page
      .locator("#select_company_id .react-select__indicator")
      .click();

    await this.page
      .locator(".react-select__option")
      .filter({ hasText: company })
      .click();

    await this.page.locator("#select_year .react-select__indicator").click();

    await this.page
      .locator(".react-select__option")
      .filter({ hasText: release_year })
      .click();

    await this.page
      .locator("input[name=cover]")
      .setInputFiles(`tests/support/fixtures${cover}`);

    if (featured) {
      await this.page.locator(".featured .react-switch").click();
    }

    await this.submitForm();
  }

  async search(target) {
    await this.page.getByPlaceholder("Busque pelo nome").fill(target);

    await this.page.click(".actions button");
  }

  async tableHave(content) {
    // This was supposed to work with 'row' as well, but sometimes it does not work very well.
    const rows = this.page.getByRole("cell");
    await expect(rows).toContainText(content);
  }

  async alertToHaveText(message) {
    const locator = this.page.locator(".alert");

    await expect(locator).toHaveText(message);
  }

  async remove(movieTitle) {
    await this.page
      .getByRole("row", { name: movieTitle })
      .getByRole("button")
      .click();
    await this.page.click(".confirm-removal");
  }
}
