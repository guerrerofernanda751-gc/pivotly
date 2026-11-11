"use client";

import { useState } from "react";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Tools", href: "/core" },
  { label: "Roadmap", href: "/#roadmap" },
  { label: "Demo", href: "/demo" },
  { label: "Dashboard", href: "/dashboard" },
];

const STEPS = [
  {
    title: "Start here",
    pivi: "Hi! Not sure where to start? Tell me about your business.",
    text: "Answer 3 quick questions and the assistant points you to the right tool.",
    href: "/chat",
    button: "Open the chat",
  },
  {
    title: "Set your price",
    pivi: "Let's find a price that covers your costs.",
    text: "Enter your costs and see a suggested price and a health signal.",
    href: "/core",
    button: "Open the calculator",
  },
  {
    title: "See your market",
    pivi: "You are not alone. Let's look at businesses like yours.",
    text: "Compare your business with others like it.",
    href: "/research",
    button: "Open research",
  },
  {
    title: "Plan your plan",
    pivi: "Here is how Pivotly itself makes money.",
    text: "See Pivotly's plans and how the business model works.",
    href: "/pricing",
    button: "Open pricing",
  },
  {
    title: "Get customers",
    pivi: "Now let's tell people about your business.",
    text: "Ready-to-use posts, video scripts and a 14-day calendar.",
    href: "/marketing",
    button: "Open marketing",
  },
  {
    title: "See it all saved",
    pivi: "Everything you saved is in one place.",
    text: "All your saved work from every tool, in one page.",
    href: "/dashboard",
    button: "Open the dashboard",
  },
];

const AGENT_TOOLS = ["Price calculator", "Research", "Pricing simulator", "Marketing engine"];

const IMPACT = [
  {
    title: "Where it helps",
    text: "Owners see if their price covers their costs, who their competitors are and what to post to find customers.",
  },
  {
    title: "Limits",
    text: "It follows fixed rules and does not use AI. It uses simple numbers only. It is not a replacement for an accountant.",
  },
  {
    title: "Possible harm",
    text: "A wrong price estimate could hurt a small business. Results are labeled as estimates. Tax and legal questions are sent to a human expert.",
  },
];

const ROADMAP = [
  "Spanish version",
  "User login and personal history",
  "Labor cost in the price calculator",
  "Real payments for the paid plans",
  "Charts in the dashboard",
];

export default function Demo() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

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
          Live demo
        </p>
        <h1 className="font-display text-3xl leading-tight text-black sm:text-4xl">
          See Pivotly in 2 minutes
        </h1>
        <p className="mt-4 max-w-xl text-black/60">
          Follow the 6 steps. Each one opens a real tool that is already live.
        </p>
      </section>

      {/* Guided tour */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-black/50">
            Step {step + 1} of {STEPS.length}
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-cream">
            <div
              className="h-2 rounded-full bg-forest transition-all"
              style={{ width: ((step + 1) / STEPS.length) * 100 + "%" }}
            />
          </div>

          <div className="mt-6 inline-block max-w-[90%] rounded-2xl rounded-bl-sm border border-black/5 bg-cream px-4 py-2.5 text-sm text-black/80">
            Pivi: {current.pivi}
          </div>

          <h2 className="mt-6 font-display text-2xl text-forest">{current.title}</h2>
          <p className="mt-2 text-black/60">{current.text}</p>

          <a
            href={current.href}
            className="mt-5 inline-block rounded-lg bg-forest px-5 py-2.5 text-sm text-white transition hover:bg-forest-dark"
          >
            {current.button}
          </a>

          {isLast && (
            <p className="mt-6 rounded-lg bg-cream px-4 py-3 text-sm text-forest">
              You finished the tour. Thank you for trying Pivotly!
            </p>
          )}

          <div className="mt-8 flex justify-between border-t border-black/5 pt-5">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="rounded-full border border-forest px-5 py-2 text-sm text-forest transition hover:bg-forest hover:text-white disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(isLast ? 0 : step + 1)}
              className="rounded-full border border-forest px-5 py-2 text-sm text-forest transition hover:bg-forest hover:text-white"
            >
              {isLast ? "Start again" : "Next"}
            </button>
          </div>
        </div>
      </section>

      {/* Agent map */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-display text-2xl text-forest">Agent map</h2>
        <p className="mt-2 max-w-xl text-sm text-black/60">
          These are the parts of Pivotly and what each one does. All of them follow fixed rules and none uses paid AI.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-black/5 bg-white p-6 text-center text-sm sm:flex-row sm:justify-between">
          <div className="rounded-xl bg-forest px-5 py-4 text-white">Visitor</div>
          <span className="text-black/40">→</span>
          <div className="rounded-xl border border-forest px-5 py-4">
            <p className="font-medium text-forest">Pivi</p>
            <p className="text-black/60">guides the visitor</p>
          </div>
          <span className="text-black/40">→</span>
          <div className="space-y-2">
            {AGENT_TOOLS.map((t) => (
              <div key={t} className="rounded-lg border border-black/10 px-4 py-1.5 text-black/70">
                {t}
              </div>
            ))}
          </div>
          <span className="text-black/40">→</span>
          <div className="rounded-xl border border-forest-light bg-cream px-5 py-4">
            <p className="font-medium text-forest">Supabase</p>
            <p className="text-black/60">saves the results</p>
          </div>
          <span className="text-black/40">→</span>
          <div className="rounded-xl bg-forest px-5 py-4 text-white">Dashboard</div>
        </div>
      </section>

      {/* Practical impact check */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-display text-2xl text-forest">Practical impact check</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {IMPACT.map((i) => (
            <div key={i.title} className="rounded-2xl border border-black/5 bg-white p-5">
              <h3 className="font-medium text-forest">{i.title}</h3>
              <p className="mt-2 text-sm text-black/60">{i.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Version 2 roadmap */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-2xl text-forest">Version 2 roadmap</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {ROADMAP.map((r) => (
            <li key={r} className="rounded-xl border border-black/5 bg-white px-5 py-3 text-sm text-black/70">
              {r}
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
