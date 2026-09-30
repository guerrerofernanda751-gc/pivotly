"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Assumptions for each scenario: % of total users expected in each paid tier.
// Compass is always free, so its % is whatever is left over.
const SCENARIOS = {
  conservative: {
    label: "Conservative",
    compassPct: 70,
    pivotPct: 25,
    momentumPct: 5,
  },
  optimistic: {
    label: "Optimistic",
    compassPct: 50,
    pivotPct: 35,
    momentumPct: 15,
  },
};

const PIVOT_PRICE = 99;
const MOMENTUM_PRICE = 249;

function calculateRevenue(totalUsers, scenarioKey) {
  const s = SCENARIOS[scenarioKey];
  const pivotUsers = (totalUsers * s.pivotPct) / 100;
  const momentumUsers = (totalUsers * s.momentumPct) / 100;
  const monthly = pivotUsers * PIVOT_PRICE + momentumUsers * MOMENTUM_PRICE;
  const annual = monthly * 12;
  return { monthly, annual, pivotUsers, momentumUsers };
}

function formatMXN(n) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function PricingSimulator() {
  const [totalUsers, setTotalUsers] = useState(1000);
  const [scenario, setScenario] = useState("conservative");
  const [saveState, setSaveState] = useState("idle");
  const [scenarios, setScenarios] = useState([]);
  const [scenariosState, setScenariosState] = useState("loading");

  const result = useMemo(
    () => calculateRevenue(Number(totalUsers) || 0, scenario),
    [totalUsers, scenario]
  );

  async function loadScenarios() {
    setScenariosState("loading");
    const { data, error } = await supabase
      .from("pricing_scenarios")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      setScenariosState("error");
      return;
    }
    setScenarios(data || []);
    setScenariosState("ready");
  }

  useEffect(() => {
    loadScenarios();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaveState("saving");

    const { error } = await supabase.from("pricing_scenarios").insert({
      total_users: Number(totalUsers) || 0,
      scenario,
      monthly_revenue: Math.round(result.monthly),
      annual_revenue: Math.round(result.annual),
    });

    if (error) {
      setSaveState("error");
      return;
    }
    setSaveState("saved");
    loadScenarios();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-dashed border-black/15 bg-black/[0.02] p-4 text-sm text-black/60">
        This section models <strong>Pivotly's own business</strong> — how much
        revenue the company could generate at different numbers of users. It
        is not a tool for end users; it's for founders, investors, or
        graders reviewing the business model.
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-black/50">Revenue calculator</p>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm text-black/70">
            Total Pivotly users
            <input
              type="number"
              min="0"
              value={totalUsers}
              onChange={(e) => setTotalUsers(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black focus:border-forest focus:outline-none"
            />
          </label>

          <div>
            <p className="mb-1 text-sm text-black/70">Scenario</p>
            <div className="flex gap-2">
              {Object.entries(SCENARIOS).map(([key, s]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                    scenario === key
                      ? "border-forest bg-forest text-white"
                      : "border-black/10 text-black/60 hover:border-forest/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-forest/5 p-4">
            <p className="text-xs text-black/40">Monthly revenue</p>
            <p className="font-display text-2xl text-forest">
              ${formatMXN(result.monthly)} MXN
            </p>
          </div>
          <div className="rounded-xl bg-forest/5 p-4">
            <p className="text-xs text-black/40">Annual revenue</p>
            <p className="font-display text-2xl text-forest">
              ${formatMXN(result.annual)} MXN
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <button
            type="submit"
            disabled={saveState === "saving"}
            className="mt-6 rounded-lg bg-forest px-6 py-3 text-sm text-white transition hover:bg-forest-dark disabled:opacity-50"
          >
            {saveState === "saving" ? "Saving…" : "Save this scenario"}
          </button>
          {saveState === "saved" && (
            <p className="mt-2 text-xs text-stable">✅ Saved — see it in the dashboard below.</p>
          )}
          {saveState === "error" && (
            <p className="mt-2 text-xs text-attention">
              Couldn't save — check your connection and try again.
            </p>
          )}
        </form>
      </div>

      {/* Assumptions table */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-black/50">
          Assumptions — {SCENARIOS[scenario].label} scenario
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-black/40">
                <th className="py-2 pr-4 font-medium">Tier</th>
                <th className="py-2 pr-4 font-medium">Price / month</th>
                <th className="py-2 pr-4 font-medium">% of total users</th>
                <th className="py-2 font-medium">Estimated users</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/5">
                <td className="py-2 pr-4 text-black">Compass</td>
                <td className="py-2 pr-4 text-black/60">$0</td>
                <td className="py-2 pr-4 text-black/60">{SCENARIOS[scenario].compassPct}%</td>
                <td className="py-2 text-black/60">
                  {formatMXN((Number(totalUsers) || 0) * SCENARIOS[scenario].compassPct / 100)}
                </td>
              </tr>
              <tr className="border-b border-black/5">
                <td className="py-2 pr-4 text-black">Pivot</td>
                <td className="py-2 pr-4 text-black/60">${PIVOT_PRICE}</td>
                <td className="py-2 pr-4 text-black/60">{SCENARIOS[scenario].pivotPct}%</td>
                <td className="py-2 text-black/60">{formatMXN(result.pivotUsers)}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-black">Momentum</td>
                <td className="py-2 pr-4 text-black/60">${MOMENTUM_PRICE}</td>
                <td className="py-2 pr-4 text-black/60">{SCENARIOS[scenario].momentumPct}%</td>
                <td className="py-2 text-black/60">{formatMXN(result.momentumUsers)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Saved scenarios dashboard */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-black/50">Saved pricing scenarios</p>
        {scenariosState === "loading" && <p className="text-sm text-black/40">Loading…</p>}
        {scenariosState === "error" && (
          <p className="text-sm text-attention">Couldn't load saved scenarios.</p>
        )}
        {scenariosState === "ready" && (
          <>
            <p className="text-3xl font-display text-black">{scenarios.length}</p>
            <p className="text-xs text-black/40">
              saved scenario{scenarios.length === 1 ? "" : "s"} (last 5 shown)
            </p>
            {scenarios.length > 0 && (
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-black/40">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Total users</th>
                    <th className="pb-2 font-medium">Scenario</th>
                    <th className="pb-2 font-medium">Monthly</th>
                    <th className="pb-2 font-medium">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s) => (
                    <tr key={s.id} className="border-b border-black/5 last:border-0">
                      <td className="py-2 text-black/70">
                        {new Date(s.created_at).toLocaleDateString("en-US")}
                      </td>
                      <td className="py-2 text-black/70">{s.total_users}</td>
                      <td className="py-2 text-black/70 capitalize">{s.scenario}</td>
                      <td className="py-2 text-black/70">${formatMXN(s.monthly_revenue)}</td>
                      <td className="py-2 text-black/70">${formatMXN(s.annual_revenue)}</td>
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
