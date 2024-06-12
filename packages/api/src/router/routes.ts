import * as trpc from '@trpc/server';
import { z } from 'zod';
export const expressRouter = trpc.router().mutation('login', {
  input: z.object({
    username: z.string(),
    password: z.string(),
  }),
  resolve({ input }) {
    // Implement your login logic here
    return { success: true, message: 'Login successful' };
  },
});
