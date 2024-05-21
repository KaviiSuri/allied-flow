import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from "@repo/api";
import { supabaseServerClient } from "~/supabase/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
export const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  const supabase = supabaseServerClient();
  let sess = null;
  try {
  const {
    data: {
      session
    }
  }= await supabase.auth.getSession();
    sess = session
  } catch { /* empty */ }

  return createTRPCContext({
    headers: heads,
    session: sess,
  });
});

export const api = createCaller(createContext);
