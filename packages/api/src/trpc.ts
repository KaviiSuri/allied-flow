/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import type { IdTokenClaims } from "@logto/js";
import { initTRPC, TRPCError } from "@trpc/server";
import type { IncomingMessageWithBody } from "@trpc/server/adapters/node-http";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@repo/db/client";
import type { SubjectsWithTypes } from "@repo/permissions";
import { defineAbilityFor } from "@repo/permissions";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = (opts: {
  headers: IncomingMessageWithBody["headers"];
  claims: IdTokenClaims | null;
}) => {
  const claims = opts.claims;
  const source = opts.headers["x-trpc-source"] ?? "unknown";

  console.log(">>> tRPC Request from", source, "by", claims?.sub);

  return {
    claims,
    db,
  };
};

type Meta = {
  [S in keyof SubjectsWithTypes]: {
    action: SubjectsWithTypes[S]["actions"];
    subject: S;
  };
}[keyof SubjectsWithTypes];

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<Meta>()
  .create({
    transformer: superjson,
    defaultMeta: undefined,
    errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }),
  });

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(
  async ({ ctx, next, meta }) => {
    const { claims } = ctx;
    if (!claims) {
      console.log("claims", claims);
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, claims.sub),
      with: {
        team: true,
      },
    });
    if (!user) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const ability = defineAbilityFor(user);
    // @ts-expect-error - this is a hack to get around the fact that the type of meta is not inferred
    if (meta && ability.cannot(meta.action, meta.subject)) {
      // @ts-expect-error - this is a hack to get around the fact that the type of meta is not inferred
      const rule = ability.relevantRuleFor(meta.action, meta.subject);
      throw new TRPCError({
        code: "FORBIDDEN",
        message: rule?.reason ?? "Permission denied",
      });
    }
    return next({
      ctx: {
        claims,
        user,
        ability,
      },
    });
  },
);
