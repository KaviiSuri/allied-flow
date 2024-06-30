import axios from "axios";

import { env } from "@repo/server-config";
export type * from "./sdk/index.js";
import { RolesApi, UsersApi } from "./sdk/api.js";
import { Configuration } from "./sdk/configuration.js";
import { fetchAdminAccessToken } from "./helper.js";

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
