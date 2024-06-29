import type { TRPCRouterRecord } from "@trpc/server";
import { db } from "@repo/db/client";
import { users } from "@repo/db/schema";
import { publicProcedure } from "../trpc.js";

export const usersRouter = {
    createUser: publicProcedure.query(() => {
        return 'create user';
    }),
    readUsers: publicProcedure.query(async () => {
        const res = db.select().from(users).all()
        return res;
    }),
    updateUser: publicProcedure.query(() => {
        return "update user";
    }),
    deleteUser: publicProcedure.query(() => {
        return "delete user";
    }),
} satisfies TRPCRouterRecord;
