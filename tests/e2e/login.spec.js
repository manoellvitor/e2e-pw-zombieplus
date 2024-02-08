const { test } = require("../support");

test("must be able to login as admin", async ({ page }) => {
  await page.login.visit();
  await page.login.submitForm("admin@zombieplus.com", "pwd123");
  await page.login.isLoggedIn("Admin");
});

test("must not be able to login with invalid email", async ({ page }) => {
  await page.login.visit();
  await page.login.submitForm("admin.manoel.com", "abc123");
  await page.login.alertHaveText("Email incorreto");
});

test("must not be able to login with invalid password", async ({ page }) => {
  await page.login.visit();
  await page.login.submitForm("admin@zombieplus.com", "abc123");
  await page.toast.containText(
    "Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente."
  );
});

test("must not be able to login with empty email", async ({ page }) => {
  await page.login.visit();
  await page.login.submitForm("", "abc123");
  await page.login.alertHaveText("Campo obrigatório");
});

test("must not be able to login with empty password", async ({ page }) => {
  await page.login.visit();
  await page.login.submitForm("manoel@gmail.com", "");
  await page.login.alertHaveText("Campo obrigatório");
});

test("must not be able to login with both empty inputs", async ({ page }) => {
  await page.login.visit();
  await page.login.submitForm("", "");
  await page.login.alertHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
