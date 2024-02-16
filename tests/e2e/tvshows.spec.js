const { test } = require("../support");
const { executeSQL } = require("../support/database");

const data = require("../support/fixtures/tvshows.json");

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM tvshows`);
});

test("must be able to create a new tvshow", async ({ page }) => {
  const tvshow = data.create;

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.go("/admin/tvshows");
  await page.tvshows.create(tvshow);
  await page.popup.haveText(
    `A série '${tvshow.title}' foi adicionada ao catálogo.`
  );
});

test("must be able to remove a tvshow", async ({ page, request }) => {
  const tvshow = data.to_remove;

  await request.api.postTvShow(tvshow);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.go("/admin/tvshows");
  await page.tvshows.remove(tvshow.title);
  await page.popup.haveText("Série removida com sucesso.");
});

test("must not be able to create a tvshow with duplicated title", async ({
  page,
  request,
}) => {
  const tvshow = data.duplicate;

  await request.api.postTvShow(tvshow);

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.go("/admin/tvshows");
  await page.tvshows.create(tvshow);
  await page.popup.haveText(
    `O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
  );
});

test("must not be able to create a new tvshow if required fields are empty", async ({
  page,
}) => {
  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.go("/admin/tvshows");
  await page.tvshows.openForm();
  await page.tvshows.submitForm();
  await page.tvshows.alertToHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório",
    "Campo obrigatório (apenas números)",
  ]);
});

test("must be able to search for the term zombie", async ({
  page,
  request,
}) => {
  const shows = data.search;

  shows.data.forEach(async (tvshow) => {
    await request.api.postTvShow(tvshow);
  });

  await page.login.do("admin@zombieplus.com", "pwd123", "Admin");
  await page.tvshows.go("/admin/tvshows");
  await page.tvshows.search(shows.input);
  await page.tvshows.tableHave(shows.outputs);
});
