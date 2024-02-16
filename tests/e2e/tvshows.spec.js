const { test } = require("../support");
const { executeSQL } = require("../support/database");

const data = require("../support/fixtures/tvshows.json");

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM tvshows`);
});

test("must be able to create a new tvshow", async ({ page }) => {
  const tvshow = data.create;

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.create(tvshow);
  await page.popup.haveText(
    `A série '${tvshow.title}' foi adicionada ao catálogo.`
  );
});

test("must be able to remove a tvshow", async ({ page, request }) => {
  const tvshow = data.to_remove;

  await request.api.postMovie(tvshow);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.remove(movie.title);
  await page.popup.haveText("Filme removido com sucesso.");
});

test("must not be able to create a movie with duplicated title", async ({
  page,
  request,
}) => {
  const movie = data.duplicate;

  await request.api.postMovie(movie);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.create(movie);
  await page.popup.haveText(
    `O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
  );
});

test("must not be able to create a new movie if required fields are empty", async ({
  page,
}) => {
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.openForm();
  await page.movies.submitForm();
  await page.movies.alertToHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
  ]);
});

test("must be able to search for the term zombie", async ({
  page,
  request,
}) => {
  const movies = data.search;

  movies.data.forEach(async (movie) => {
    await request.api.postMovie(movie);
  });

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.movies.search(movies.input);
  await page.movies.tableHave(movies.outputs);
});