import { expect } from "@playwright/test";
require("dotenv").config();

export class Api {
  constructor(request) {
    this.request = request;
    this.token = undefined;
    this.API_URL = process.env.BASE_API_URL;
  }

  async setToken() {
    const response = await this.request.post(`${this.API_URL}/sessions`, {
      data: {
        email: "admin@zombieplus.com",
        password: "pwd123",
      },
    });

    expect(await response.ok()).toBeTruthy();
    const body = JSON.parse(await response.text());
    this.token = `Bearer ${body.token}`;
  }

  async getCompanyIdByName(companyName) {
    const response = await this.request.get(`${this.API_URL}/companies`, {
      headers: {
        Authorization: this.token,
      },
      params: {
        name: companyName,
      },
    });

    expect(await response.ok()).toBeTruthy();
    const body = JSON.parse(await response.text());
    const { id: companyId } = body.data[0];

    return companyId;
  }

  async postMovie(movie) {
    const companyId = await this.getCompanyIdByName(movie.company);

    const response = await this.request.post(`${this.API_URL}/movies`, {
      headers: {
        ContentType: "multipart/form-data",
        Accept: "application/json, text/plain, */*",
        Authorization: this.token,
      },
      multipart: {
        title: movie.title,
        overview: movie.overview,
        company_id: companyId,
        release_year: movie.release_year,
        featured: movie.featured,
        cover: "",
      },
    });
    expect(await response.ok()).toBeTruthy();
  }
}
