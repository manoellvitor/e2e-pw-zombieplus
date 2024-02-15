const { test } = require("../support");
const { executeSQL } = require("../support/database");

const data = require("../support/fixtures/movies.json");

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM movies`);
});

test("must be able to create a new movie", async ({ page }) => {
  const movie = data.create;

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.toast.containText("Cadastro realizado com sucesso!");
});

test("must not be able to create a movie with duplicated title", async ({
  page,
  request,
}) => {
  const movie = data.duplicate;

  const token = await request.api.setToken();

  // await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  // await page.movies.create(movie);
  // await page.toast.containText(
  //   "Este conteúdo já encontra-se cadastrado no catálogo"
  // );
});

test("must not be able to create a new movie if required fields are empty", async ({
  page,
}) => {
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.openForm();
  await page.movies.submitForm();
  await page.movies.alertToHaveText([
    "Por favor, informe o título.",
    "Por favor, informe a sinopse.",
    "Por favor, informe a empresa distribuidora.",
    "Por favor, informe o ano de lançamento.",
  ]);
});
