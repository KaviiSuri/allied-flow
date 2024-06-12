import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";

import { appRouter } from "@repo/api";

import { env } from "./config/env.js";

async function start() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
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
