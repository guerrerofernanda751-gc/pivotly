import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This file just sets up the connection to Supabase.
// It is not used to read or write real data yet — that comes in a later sprint.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
