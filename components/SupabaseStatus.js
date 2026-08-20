"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseStatus() {
  const [status, setStatus] = useState("Checking connection...");

  useEffect(() => {
    async function checkConnection() {
      try {
        // This calls Supabase's auth service — it doesn't need any table
        // to exist, it just proves the URL + key can reach Supabase.
        const { error } = await supabase.auth.getSession();
        if (error) {
          setStatus("⚠️ Connected to Supabase, but got an error: " + error.message);
        } else {
          setStatus("✅ Supabase is connected");
        }
      } catch (err) {
        setStatus("❌ Could not reach Supabase: " + err.message);
      }
    }
    checkConnection();
  }, []);

  return (
    <p className="mt-2 text-xs text-black/40">{status}</p>
  );
}
