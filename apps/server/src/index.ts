import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { withLogto } from '@logto/express';

import { appRouter, createTRPCContext } from "@repo/api";

import { env } from "./config/env.js";
import { supabaseServerClient } from "./services/supabase.js";
import { logtoServiceConfig } from "./services/logtoService.js";

const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {

  const supabase = supabaseServerClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data;
  } catch {
    /* empty */
  }

  user = req.user.userInfo;

  return createTRPCContext({
    headers: req.headers,
    user,
  });
};

async function start() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(
    withLogto(logtoServiceConfig)
  )

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  console.log("Starting server");

  app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
}

function shutdown() {
  console.log("Shutting down server");
}

start();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});
