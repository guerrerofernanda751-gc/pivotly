"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const COMPETITORS = [
  {
    name: "Alegra",
    type: "Accounting and invoicing platform",
    kind: "Direct competitor",
    offers: "Helps businesses create invoices, track income and expenses, and manage accounting records.",
    gap: "More focused on accounting tasks than teaching beginners how to understand their prices.",
  },
  {
    name: "CONTPAQi / Aspel SAE",
    type: "Mexican business management software",
    kind: "Direct competitor",
    offers: "Offers invoicing, sales, inventory, customer management, and financial reports.",
    gap: "Has many functions that can feel difficult for someone with little financial knowledge.",
  },
  {
    name: "Bind ERP",
    type: "Mexican cloud-based business platform",
    kind: "Direct competitor",
    offers: "Helps businesses manage sales, inventory, invoicing, purchases, and basic financial information.",
    gap: "Made for managing operations, while Pivotly focuses on a simple financial diagnosis.",
  },
  {
    name: "misKuentas",
    type: "Mexican accounting software",
    kind: "Direct competitor",
    offers: "Automates invoices, accounting records, bank reconciliation, taxes, and SAT-connected tasks.",
    gap: "Useful for formal accounting but may be too advanced for a beginner who just wants to understand prices.",
  },
  {
    name: "Clip",
    type: "Mexican payment and POS platform",
    kind: "Substitute / adjacent competitor",
    offers: "Lets businesses accept payments and use point-of-sale tools with sales and inventory features.",
    gap: "Helps users see sales but does not explain if the price covers all their costs.",
  },
  {
    name: "Excel or Google Sheets",
    type: "Informal financial tool",
    kind: "Substitute",
    offers: "Users can create budgets, cost tables, and price calculations.",
    gap: "Requires the user to already know what formulas to use and how to interpret the numbers.",
  },
  {
    name: "Local accountant or bookkeeper",
    type: "Human alternative",
    kind: "Substitute",
    offers: "Gives personalized support with taxes, costs, and accounting questions.",
    gap: "Can be expensive or unavailable for someone who only needs basic guidance at first.",
  },
  {
    name: "YouTube, TikTok, or WhatsApp advice groups",
    type: "Informal education and advice",
    kind: "Substitute",
    offers: "Users find financial tips, pricing videos, or advice from other entrepreneurs.",
    gap: "Advice may be generic, confusing, or not based on the user's real numbers.",
  },
];

const GLOBAL_EXAMPLES = [
  {
    name: "QuickBooks",
    does: "Helps businesses track income, expenses, invoices, and cash flow.",
    why: "Puts important financial information in one place and includes simple reports.",
  },
  {
    name: "Xero",
    does: "Accounting platform for invoices, expenses, payments, and cash-flow tracking.",
    why: "Helps small businesses see their financial situation without doing everything manually.",
  },
  {
    name: "Zoho Books / Zoho Invoice",
    does: "Creates invoices, tracks payments, and organizes basic business records.",
    why: "Useful for small businesses that need a simpler way to manage sales and payments.",
  },
  {
    name: "FreshBooks",
    does: "Helps users send invoices, track expenses, accept payments, and review reports.",
    why: "Designed for small businesses and service providers who do not need advanced accounting tools.",
  },
  {
    name: "Wave",
    does: "Offers invoicing, receipt scanning, expense tracking, and basic accounting tools.",
    why: "Gives small business owners a low-cost way to organize their finances.",
  },
];

// Qualitative risk map: how close each entry is to Pivotly's core idea (simple
// diagnosis for beginners) vs. how big a threat it is to Pivotly's users.
const RISK_MAP = {
  "high-high": ["Alegra", "misKuentas"],
  "high-low": ["Excel or Google Sheets", "Local accountant or bookkeeper"],
  "low-high": [],
  "low-low": ["CONTPAQi / Aspel SAE", "Bind ERP", "Clip", "YouTube, TikTok, or WhatsApp advice groups"],
};

const FILTERS = ["All", "Direct competitor", "Substitute", "Substitute / adjacent competitor"];

export default function ResearchDashboard() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [notes, setNotes] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const [sessions, setSessions] = useState([]);
  const [sessionsState, setSessionsState] = useState("loading");

  const filtered = useMemo(() => {
    return COMPETITORS.filter((c) => {
      const matchesFilter = filter === "All" || c.kind === filter;
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  async function loadSessions() {
    setSessionsState("loading");
    const { data, error } = await supabase
      .from("research_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      setSessionsState("error");
      return;
    }
    setSessions(data || []);
    setSessionsState("ready");
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!businessType.trim()) return;
    setSaveState("saving");

    const { error } = await supabase.from("research_sessions").insert({
      business_type: businessType.trim(),
      notes: notes.trim() || null,
      competitors_reviewed: filtered.length,
    });

    if (error) {
      setSaveState("error");
      return;
    }
    setSaveState("saved");
    setBusinessType("");
    setNotes("");
    loadSessions();
  }

  return (
    <div className="space-y-12">
      {/* Research intake */}
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        <p className="mb-4 text-sm font-medium text-black/50">Log this research session</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-black/70">
            What business or idea are you researching?
            <input
              required
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Pivotly — financial diagnosis for small businesses"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black focus:border-forest focus:outline-none"
            />
          </label>
          <label className="block text-sm text-black/70">
            Notes (optional)
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. focused on Mexico City sellers"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black focus:border-forest focus:outline-none"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={saveState === "saving"}
          className="mt-4 rounded-lg bg-forest px-6 py-3 text-white transition hover:bg-forest-dark disabled:opacity-50"
        >
          {saveState === "saving" ? "Saving…" : "Save this research"}
        </button>
        {saveState === "saved" && (
          <p className="mt-2 text-xs text-stable">✅ Saved — see it in the dashboard below.</p>
        )}
        {saveState === "error" && (
          <p className="mt-2 text-xs text-attention">Couldn't save — check your connection and try again.</p>
        )}
      </form>

      {/* Competitor / substitute table */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-black/50">
            Competitors &amp; substitutes for Pivotly in Mexico
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="rounded-lg border border-black/10 px-3 py-1.5 text-sm focus:border-forest focus:outline-none"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-1.5 text-sm focus:border-forest focus:outline-none"
            >
              {FILTERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-black/40">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Kind</th>
                <th className="py-2 pr-4 font-medium">What it offers</th>
                <th className="py-2 font-medium">Gap Pivotly addresses</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.name} className="border-b border-black/5 align-top last:border-0">
                  <td className="py-3 pr-4 font-medium text-black">{c.name}</td>
                  <td className="py-3 pr-4 text-black/60">{c.type}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs text-forest-light">
                      {c.kind}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-black/60">{c.offers}</td>
                  <td className="py-3 text-black/60">{c.gap}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-black/40">
                    No matches for that search/filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global benchmark cards */}
      <div>
        <p className="mb-4 text-sm font-medium text-black/50">5 global benchmark examples</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GLOBAL_EXAMPLES.map((g) => (
            <div key={g.name} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <h3 className="font-medium text-black">{g.name}</h3>
              <p className="mt-2 text-sm text-black/60">{g.does}</p>
              <p className="mt-2 text-xs text-black/40">{g.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk map */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="mb-1 text-sm font-medium text-black/50">Risk map</p>
        <p className="mb-4 text-xs text-black/40">
          How close each entry is to Pivotly's core idea, vs. how big a threat it is.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <RiskCell title="Direct threat" subtitle="High threat · High similarity" items={RISK_MAP["high-high"]} tone="bg-attention/10 text-attention" />
          <RiskCell title="Habit to break" subtitle="High threat · Low similarity" items={RISK_MAP["high-low"]} tone="bg-review/10 text-review" />
          <RiskCell title="Learn from" subtitle="Low threat · High similarity" items={RISK_MAP["low-high"]} tone="bg-forest/10 text-forest-light" />
          <RiskCell title="Not a concern" subtitle="Low threat · Low similarity" items={RISK_MAP["low-low"]} tone="bg-stable/10 text-stable" />
        </div>
      </div>

      {/* Dashboard widget */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-black/50">Research dashboard</p>
        {sessionsState === "loading" && <p className="text-sm text-black/40">Loading…</p>}
        {sessionsState === "error" && (
          <p className="text-sm text-attention">Couldn't load saved research.</p>
        )}
        {sessionsState === "ready" && (
          <>
            <p className="text-3xl font-display text-black">{sessions.length}</p>
            <p className="text-xs text-black/40">saved research session{sessions.length === 1 ? "" : "s"} (last 5 shown)</p>
            {sessions.length > 0 && (
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-black/40">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Business / idea</th>
                    <th className="pb-2 font-medium">Competitors reviewed</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-b border-black/5 last:border-0">
                      <td className="py-2 text-black/70">
                        {new Date(s.created_at).toLocaleDateString("en-US")}
                      </td>
                      <td className="py-2 text-black/70">{s.business_type}</td>
                      <td className="py-2 text-black/70">{s.competitors_reviewed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RiskCell({ title, subtitle, items, tone }) {
  return (
    <div className={`rounded-xl p-4 ${tone}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mb-2 text-xs opacity-70">{subtitle}</p>
      {items.length === 0 ? (
        <p className="text-xs opacity-60">—</p>
      ) : (
        <ul className="space-y-1 text-xs">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
