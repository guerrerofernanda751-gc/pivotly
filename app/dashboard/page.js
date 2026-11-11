"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Tools", href: "/core" },
  { label: "Roadmap", href: "/#roadmap" },
  { label: "Demo", href: "/demo" },
  { label: "Dashboard", href: "/dashboard" },
];

// Each card reads one Supabase table. "detail" builds one short line from the saved rows.
const TOOLS = [
  {
    title: "Price calculator",
    table: "core_outputs",
    href: "/core",
    detail: (rows) => {
      const key = rows[0] && Object.keys(rows[0]).find((k) => k.includes("suggest"));
      return key && rows[0][key] != null ? "Last suggested price: " + rows[0][key] : null;
    },
  },
  {
    title: "Research",
    table: "research_sessions",
    href: "/research",
    detail: (rows) => (rows[0] && rows[0].business_type ? "Last business type: " + rows[0].business_type : null),
  },
  {
    title: "Pricing scenarios",
    table: "pricing_scenarios",
    href: "/pricing",
    detail: (rows) => (rows[0] && rows[0].scenario ? "Last scenario: " + rows[0].scenario : null),
  },
  {
    title: "Marketing assets",
    table: "marketing_assets",
    href: "/marketing",
    detail: (rows) => (rows[0] && rows[0].asset_type ? "Last type: " + rows[0].asset_type : null),
  },
  {
    title: "A/B votes",
    table: "ab_votes",
    href: "/marketing",
    detail: (rows) => {
      const counts = {};
      rows.forEach((r) => {
        if (r.variant) counts[r.variant] = (counts[r.variant] || 0) + 1;
      });
      const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (entries.length === 0) return null;
      return "Leading version: " + entries[0][0] + " (" + entries[0][1] + " votes)";
    },
  },
  {
    title: "Chat summaries",
    table: "chat_summaries",
    href: "/chat",
    detail: (rows) => {
      const counts = {};
      rows.forEach((r) => {
        if (r.goal) counts[r.goal] = (counts[r.goal] || 0) + 1;
      });
      const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      return entries.length ? "Most chosen goal: " + entries[0][0] : null;
    },
  },
];

// Update this list after the testing is done.
const TESTING = [
  "3 external users tested the guided chat in Week 5. Two problems were found and fixed.",
  "Full-site regression test: every page is opened and checked.",
  "External users total for the final product: 5.",
];

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      const result = {};
      for (const tool of TOOLS) {
        const { data: rows, count, error } = await supabase
          .from(tool.table)
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .limit(500);
        result[tool.table] = error ? { error: true } : { rows: rows || [], count: count != null ? count : (rows || []).length };
      }
      if (alive) {
        setData(result);
        setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  const total = TOOLS.reduce((sum, t) => sum + (data[t.table] && data[t.table].count ? data[t.table].count : 0), 0);

  return (
    <main className="min-h-screen bg-cream">
      {/* Navbar */}
      <header className="border-b border-black/5">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="font-display text-xl tracking-tight text-forest">
            Pivotly
          </a>
          <ul className="hidden items-center gap-8 text-sm text-black/70 sm:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-forest">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/docs" className="hover:text-forest">
                Docs
              </a>
            </li>
          </ul>
          <span className="rounded-full border border-black/10 px-4 py-1.5 text-sm text-black/40">
            Log in
          </span>
        </nav>
      </header>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-forest-light">
          Dashboard
        </p>
        <h1 className="font-display text-3xl leading-tight text-black sm:text-4xl">
          Everything Pivotly saved
        </h1>
        <p className="mt-4 max-w-xl text-black/60">
          Your work from every tool in one place.{" "}
          {loading ? "Loading records..." : "Total saved records: " + total}
        </p>
      </section>

      {/* Records */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-display text-2xl text-forest">Saved records by tool</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const info = data[tool.table];
            const rows = info && info.rows ? info.rows : [];
            const detail = info && info.rows ? tool.detail(rows) : null;
            return (
              <div key={tool.table} className="rounded-2xl border border-black/5 bg-white p-5">
                <h3 className="font-medium text-forest">{tool.title}</h3>
                {loading ? (
                  <p className="mt-3 text-sm text-black/40">Loading...</p>
                ) : info && info.error ? (
                  <p className="mt-3 text-sm text-black/50">Could not load this data.</p>
                ) : (
                  <>
                    <p className="mt-2 font-display text-4xl text-black">{info.count}</p>
                    <p className="mt-2 text-sm text-black/60">
                      Last saved: {rows[0] ? formatDate(rows[0].created_at) : "nothing yet"}
                    </p>
                    {detail && <p className="text-sm text-black/60">{detail}</p>}
                  </>
                )}
                <a
                  href={tool.href}
                  className="mt-4 inline-block rounded-lg bg-forest px-4 py-2 text-sm text-white transition hover:bg-forest-dark"
                >
                  Open tool
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testing summary */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-2xl text-forest">Testing summary</h2>
        <ul className="mt-6 space-y-3">
          {TESTING.map((t) => (
            <li key={t} className="rounded-xl border border-black/5 bg-white px-5 py-3 text-sm text-black/70">
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-black/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Pivotly. Make smarter moves for your business.</p>
          <div className="flex gap-6">
            <a href="/docs" className="hover:text-forest">
              Docs
            </a>
            <a href="/" className="hover:text-forest">
              Home
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
