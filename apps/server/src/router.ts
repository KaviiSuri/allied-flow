import * as trpc from '@trpc/server';
import { z } from 'zod';

export const appRouter = trpc.router().query('hello', {
  input: z.object({
    name: z.string().optional(),
  }),
  resolve({ input }) {
    return `Hello, ${input.name ?? 'world'}!`;
  },
});

export type AppRouter = typeof appRouter;
