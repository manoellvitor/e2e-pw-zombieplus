const { test, expect } = require("../support");
const { faker } = require("@faker-js/faker");

test("must be able to register a lead on the waiting list", async ({
  page,
}) => {
  const name = faker.person.fullName();
  const email = faker.internet.email();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(name, email);

  await page.toast.containText(
    "Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!"
  );
});

test("must not be able to register a lead with an email that is already registered", async ({
  request,
  page,
}) => {
  const newLeadData = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
  };

  const newLead = await request.post("http://localhost:3333/leads", {
    data: newLeadData,
  });

  expect(newLead.ok()).toBeTruthy();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(newLeadData.name, newLeadData.email);

  await page.toast.containText(
    "O endereço de e-mail fornecido já está registrado em nossa fila de espera."
  );
});

test("must not aceept invalid emails", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("Manoel", "manoel.gmail.com");

  await page.leads.alertToHaveText("Email incorreto");
});

test("must not register with empty name", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("", "manoel@gmail.com");

  await page.leads.alertToHaveText("Campo obrigatório");
});

test("must not register with empty email", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("Manoel", "");

  await page.leads.alertToHaveText("Campo obrigatório");
});

test("must not register with both empty inputs", async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm("", "");

  await page.leads.alertToHaveText(["Campo obrigatório", "Campo obrigatório"]);
});
