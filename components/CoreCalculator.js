"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const STATUS_STYLES = {
  Stable: { dot: "bg-stable", text: "text-stable", bg: "bg-stable/10" },
  Review: { dot: "bg-review", text: "text-review", bg: "bg-review/10" },
  Attention: { dot: "bg-attention", text: "text-attention", bg: "bg-attention/10" },
};

// Pure, rule-based calculation. No AI or external API involved.
function calculateCore({ fixedCosts, variableCost, unitsSold, desiredMargin }) {
  const fixedCostPerUnit = fixedCosts / unitsSold;
  const totalCostPerUnit = fixedCostPerUnit + variableCost;
  const marginFraction = desiredMargin / 100;
  const suggestedPrice = totalCostPerUnit / (1 - marginFraction);

  let status = "Stable";
  if (desiredMargin < 5 || suggestedPrice <= totalCostPerUnit || !isFinite(suggestedPrice)) {
    status = "Attention";
  } else if (desiredMargin < 20) {
    status = "Review";
  }

  return { fixedCostPerUnit, totalCostPerUnit, suggestedPrice, status };
}

const currency = (n) =>
  isFinite(n) ? n.toLocaleString("en-US", { style: "currency", currency: "MXN" }) : "—";

export default function CoreCalculator() {
  const [form, setForm] = useState({
    fixedCosts: "",
    variableCost: "",
    unitsSold: "",
    desiredMargin: "",
  });
  const [result, setResult] = useState(null);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [history, setHistory] = useState([]);
  const [historyState, setHistoryState] = useState("loading"); // loading | ready | error

  async function loadHistory() {
    setHistoryState("loading");
    const { data, error } = await supabase
      .from("core_outputs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      setHistoryState("error");
      return;
    }
    setHistory(data || []);
    setHistoryState("ready");
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCalculate(e) {
    e.preventDefault();
    const inputs = {
      fixedCosts: parseFloat(form.fixedCosts),
      variableCost: parseFloat(form.variableCost),
      unitsSold: parseFloat(form.unitsSold),
      desiredMargin: parseFloat(form.desiredMargin),
    };
    setResult(calculateCore(inputs));
    setSaveState("idle");
  }

  async function handleSave() {
    if (!result) return;
    setSaveState("saving");

    const { error } = await supabase.from("core_outputs").insert({
      fixed_costs: parseFloat(form.fixedCosts),
      variable_cost: parseFloat(form.variableCost),
      units_sold: parseFloat(form.unitsSold),
      desired_margin: parseFloat(form.desiredMargin),
      suggested_price: result.suggestedPrice,
      status: result.status,
    });

    if (error) {
      setSaveState("error");
      return;
    }
    setSaveState("saved");
    loadHistory();
  }

  const styles = result ? STATUS_STYLES[result.status] : null;

  return (
    <div className="grid gap-8 sm:grid-cols-2 sm:items-start">
      {/* Intake form */}
      <form
        onSubmit={handleCalculate}
        className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        <p className="mb-4 text-sm font-medium text-black/50">Tell us about your product</p>

        <label className="mb-3 block text-sm text-black/70">
          Monthly fixed costs (MXN)
          <input
            required
            type="number"
            step="any"
            min="0"
            name="fixedCosts"
            value={form.fixedCosts}
            onChange={handleChange}
            placeholder="e.g. 8000"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black focus:border-forest focus:outline-none"
          />
        </label>

        <label className="mb-3 block text-sm text-black/70">
          Variable cost per unit (MXN)
          <input
            required
            type="number"
            step="any"
            min="0"
            name="variableCost"
            value={form.variableCost}
            onChange={handleChange}
            placeholder="e.g. 45"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black focus:border-forest focus:outline-none"
          />
        </label>

        <label className="mb-3 block text-sm text-black/70">
          Estimated units sold per month
          <input
            required
            type="number"
            step="any"
            min="0"
            name="unitsSold"
            value={form.unitsSold}
            onChange={handleChange}
            placeholder="e.g. 200"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black focus:border-forest focus:outline-none"
          />
        </label>

        <label className="mb-4 block text-sm text-black/70">
          Desired profit margin (%)
          <input
            required
            type="number"
            step="any"
            min="0"
            max="99"
            name="desiredMargin"
            value={form.desiredMargin}
            onChange={handleChange}
            placeholder="e.g. 25"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-black focus:border-forest focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-forest px-6 py-3 text-white transition hover:bg-forest-dark"
        >
          Calculate
        </button>
        <p className="mt-3 text-xs text-black/40">
          This is a plain, rule-based calculation — not AI-generated.
        </p>
      </form>

      {/* Output card */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-black/50">Your suggested price</p>

        {!result && (
          <p className="text-sm text-black/40">
            Fill in the form and press Calculate to see your result here.
          </p>
        )}

        {result && (
          <>
            <p className="font-display text-4xl text-black">
              {currency(result.suggestedPrice)}
            </p>

            <div className={`mt-4 flex items-center gap-2 rounded-xl ${styles.bg} px-4 py-3`}>
              <span className={`h-3 w-3 rounded-full ${styles.dot}`} />
              <span className={`text-sm font-medium ${styles.text}`}>{result.status}</span>
            </div>

            <dl className="mt-4 space-y-1 text-sm text-black/60">
              <div className="flex justify-between">
                <dt>Fixed cost per unit</dt>
                <dd>{currency(result.fixedCostPerUnit)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Total cost per unit</dt>
                <dd>{currency(result.totalCostPerUnit)}</dd>
              </div>
            </dl>

            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              className="mt-5 w-full rounded-lg border border-forest px-6 py-2.5 text-forest transition hover:bg-forest hover:text-white disabled:opacity-50"
            >
              {saveState === "saving" ? "Saving…" : "Save this result"}
            </button>
            {saveState === "saved" && (
              <p className="mt-2 text-xs text-stable">✅ Saved to your dashboard below.</p>
            )}
            {saveState === "error" && (
              <p className="mt-2 text-xs text-attention">
                Couldn't save — check your connection and try again.
              </p>
            )}
          </>
        )}
      </div>

      {/* Dashboard preview */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:col-span-2">
        <p className="mb-4 text-sm font-medium text-black/50">Dashboard preview — your saved results</p>

        {historyState === "loading" && <p className="text-sm text-black/40">Loading…</p>}
        {historyState === "error" && (
          <p className="text-sm text-attention">Couldn't load saved results.</p>
        )}
        {historyState === "ready" && history.length === 0 && (
          <p className="text-sm text-black/40">No saved results yet — try calculating one above.</p>
        )}
        {historyState === "ready" && history.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-black/40">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Suggested price</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id} className="border-b border-black/5 last:border-0">
                  <td className="py-2 text-black/70">
                    {new Date(row.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="py-2 text-black/70">{currency(row.suggested_price)}</td>
                  <td className="py-2">
                    <span className={STATUS_STYLES[row.status]?.text}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
