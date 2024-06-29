import axios from "axios";
import { z } from "zod";

import { env } from "../../config/env.js";
import { RolesApi, UsersApi } from "./sdk/api.js";
import { Configuration } from "./sdk/configuration.js";

const tokenResponseSchema = z.object({
  access_token: z.string(), // Use this token to access the API resource
  expires_in: z.number(), // Token expiration in seconds
  token_type: z.string(), // Auth type for your request when using the access token
  scope: z.string(), // scope `all` for Logto Management API
});

export const fetchAdminAccessToken = async () => {
  const res = await fetch(`${env.LOGTO_ENDPOINT}/oidc/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${env.LOGTO_ADMIN_APP_ID}:${env.LOGTO_ADMIN_APP_SECRET}`,
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      resource: `https://${env.LOGTO_TENANT_ID}.logto.app/api`,
      scope: "all",
    }).toString(),
  });

  if (!res.ok) {
    throw new Error(`Could not create token ${res.status}`);
  }

  const data = await res.json();

  const { access_token } = tokenResponseSchema.parse(data);

  return access_token;
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await fetchAdminAccessToken();
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const usersApi = new UsersApi(
  undefined,
  env.LOGTO_ENDPOINT,
  axiosInstance,
);

export const rolesApi = new RolesApi(
  undefined,
  env.LOGTO_ENDPOINT,
  axiosInstance,
);
