import { createClient } from "@supabase/supabase-js";

import { env } from "../config/env.js";

export function supabaseServerClient() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {});
}
