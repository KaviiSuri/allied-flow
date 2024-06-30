import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { env } from "@repo/server-config";
import { extractClaimsFromHeader } from "./services/auth/auth.js";

import { appRouter, createTRPCContext } from "@repo/api";

const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  let claims = null;
  try {
    const payload = await extractClaimsFromHeader(req.headers);
    claims = payload;
  } catch (error) {
    /* empty */
    console.error(">>> Error extracting claims", error);
  }

  return createTRPCContext({
    headers: req.headers,
    claims,
  });
};

async function start() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

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
