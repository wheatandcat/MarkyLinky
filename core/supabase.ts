import { createClient } from "@supabase/supabase-js";
import type { Database } from "../schema";

export const supabase = createClient<Database>(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_KEY,
);
