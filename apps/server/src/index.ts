import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";

import { appRouter, createTRPCContext } from "@repo/api";

import { env } from "./config/env.js";
import { supabaseServerClient } from "./services/supabase.js";

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
    "/trpc",
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
