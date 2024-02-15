import { expect } from "@playwright/test";
require("dotenv").config();

export class Api {
  constructor(request) {
    this.request = request;
    this.token = undefined;
  }

  async setToken() {
    const response = await this.request.post(
      `${process.env.BASE_API_URL}/sessions`,
      {
        data: {
          email: "admin@zombieplus.com",
          password: "pwd123",
        },
      }
    );

    expect(await response.ok()).toBeTruthy();
    const body = JSON.parse(await response.text());
    this.token = body.token;
  }
}
