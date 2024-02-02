const { test } = require("../support");
const { executeSQL } = require("../support/database");

const data = require("../support/fixtures/movies.json");

test("must be able to register a new movie", async ({ page }) => {
  const movie = data.create;

  await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`);

  await page.login.visit();
  await page.login.submitForm("admin@zombieplus.com", "pwd123");
  await page.login.isLoggedIn();
  await page.movies.create(
    movie.title,
    movie.overview,
    movie.company,
    movie.release_year
  );
  await page.toast.containText("Cadastro realizado com sucesso!");
});

test("must not be able to register a new movie if required fields are empty", async ({
  page,
}) => {
  await page.login.visit();
  await page.login.submitForm("admin@zombieplus.com", "pwd123");
  await page.login.isLoggedIn();

  await page.movies.openForm();
  await page.movies.submitForm();
  await page.movies.alertToHaveText([
    "Por favor, informe o título.",
    "Por favor, informe a sinopse.",
    "Por favor, informe a empresa distribuidora.",
    "Por favor, informe o ano de lançamento.",
  ]);
});
