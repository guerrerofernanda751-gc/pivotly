"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/* ------------------------------------------------------------------ */
/* Content (all rule-based, no external AI)                            */
/* ------------------------------------------------------------------ */

const BUSINESS_OPTIONS = ["Café or restaurant", "Shop", "Salon or beauty", "Other"];

const GOALS = [
  { label: "Set my prices", page: "/core" },
  { label: "Know if I make a profit", page: "/core" },
  { label: "See what other businesses do", page: "/research" },
  { label: "Understand Pivotly's plans", page: "/pricing" },
  { label: "Promote my business", page: "/marketing" },
];

const COST_OPTIONS = ["Yes", "More or less", "No"];

const PAGE_NAMES = {
  "/core": "the price calculator",
  "/research": "the research page",
  "/pricing": "the plans and pricing page",
  "/marketing": "the marketing page",
};

const PAGE_REASONS = {
  "/core": "It shows if your prices cover your costs and leave you a profit.",
  "/research": "It helps you compare your business with others like it.",
  "/pricing": "It explains what each Pivotly plan includes and what it costs.",
  "/marketing": "It gives you ready-to-use posts and ideas to attract customers.",
};
const QUESTIONS = {
  business: "1. What type of business do you have?",
  goal: "2. What do you want to do today?",
  costs: "3. Do you know how much it costs you to make or buy each product?",
};

const GREETING =
  "Hi! I'm the Pivotly assistant. I'll ask you 3 quick questions to find the right tool for you.";

const GUARDRAIL =
  "I can't help with loans, investments, taxes or legal questions. For that, please talk to an accountant or another expert. Here is what Pivotly can help you with:";

const ACCOUNTANT =
  "This is a question for an accountant. Please talk to one before making a decision.";

/* ------------------------------------------------------------------ */
/* Logic                                                               */
/* ------------------------------------------------------------------ */

function pageFor(goal) {
  const found = GOALS.find((g) => g.label === goal);
  return found ? found.page : "/core";
}

function nextStep(a) {
  if (!a.business) return "business";
  if (!a.goal) return "goal";
  if (!a.costs) return "costs";
  return "result";
}

// Decides what a typed message is about. Simple keyword rules.
function classify(text) {
  const t = text.toLowerCase();
  if (/\b(tax|taxes|legal|lawyer|law|impuesto|impuestos|iva|isr)\b/.test(t)) {
    return { type: "legal" };
  }
  if (/(loan|credit|invest|mortgage|stock|crypto|bitcoin|pr[eé]stamo|cr[eé]dito|inversi)/.test(t)) {
    return { type: "blocked" };
  }
  if (/\b(plans?|subscription|tiers?|membership|pricing)\b/.test(t)) {
    return { type: "goal", goal: "Understand Pivotly's plans" };
  }
  if (/(marketing|promote|promotion|advertis|social media|instagram|posts?\b)/.test(t)) {
    return { type: "goal", goal: "Promote my business" };
  }
  if (/(competitor|competition|other businesses|research|compare)/.test(t)) {
    return { type: "goal", goal: "See what other businesses do" };
  }
  if (/(profit|margin|earn|making money|make money|losing money)/.test(t)) {
    return { type: "goal", goal: "Know if I make a profit" };
  }
  if (/(price|prices|cost|costs|charge|calculator|how much)/.test(t)) {
    return { type: "goal", goal: "Set my prices" };
  }
  if (/\b(hi|hello|hey|help|pivotly|business|start)\b/.test(t)) {
    return { type: "generic" };
  }
  return { type: "blocked" };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ChatAssistant() {
  const idRef = useRef(100);
  const boxRef = useRef(null);

  function makeMsg(from, text, extra) {
    idRef.current += 1;
    return { id: idRef.current, from, text, ...(extra || {}) };
  }

  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: GREETING },
    { id: 2, from: "bot", text: QUESTIONS.business },
  ]);
  const [step, setStep] = useState("business"); // business | goal | costs | rate | save | guardrail | done
  const [answers, setAnswers] = useState({});
  const [rating, setRating] = useState(null);
  const [guardrailHit, setGuardrailHit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  function push(...items) {
    setMessages((m) => [...m, ...items]);
  }

  function goNext(a) {
    const s = nextStep(a);
    if (s !== "result") {
      push(makeMsg("bot", QUESTIONS[s]));
      setStep(s);
      return;
    }
    const page = pageFor(a.goal);
    const items = [
        makeMsg("bot", "Based on your answers, I recommend " + PAGE_NAMES[page] + ". " + PAGE_REASONS[page], {
        link: { href: page, label: "Open " + PAGE_NAMES[page] },
      }),
    ];
    if (a.costs === "No") {
      items.push(makeMsg("bot", "Write down your costs first. The calculator will ask for them."));
    }
    items.push(makeMsg("bot", "Was this helpful?"));
    push(...items);
    setRating(null);
    setStep("rate");
  }

  function answer(key, value, skipUserMessage) {
    if (!skipUserMessage) push(makeMsg("user", value));
    const a = { ...answers, [key]: value };
    setAnswers(a);
    goNext(a);
  }

  function handleRate(value) {
    setRating(value);
    push(
      makeMsg("user", value === "up" ? "👍 Yes, it helped" : "👎 Not really"),
      makeMsg("bot", "Can we save a summary of this chat to improve Pivotly?")
    );
    setStep("save");
  }

  async function handleSave(yes) {
    push(makeMsg("user", yes ? "Yes" : "No"));
    if (!yes) {
      push(makeMsg("bot", "No problem. Nothing was saved."));
      setStep("done");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("chat_summaries").insert({
      business_type: answers.business || null,
      goal: answers.goal || null,
      knows_costs: answers.costs || null,
      recommended_page: pageFor(answers.goal),
      guardrail_triggered: guardrailHit,
      rating: rating,
    });
    setSaving(false);
    if (error) {
      push(makeMsg("bot", "Sorry, I couldn't save the summary. Please try again."));
      return;
    }
    push(makeMsg("bot", "Thank you! Your summary was saved."));
    setStep("done");
  }

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    push(makeMsg("user", text));

    const c = classify(text);
    if (c.type === "legal" || c.type === "blocked") {
      setGuardrailHit(true);
      const items = [];
      if (c.type === "legal") items.push(makeMsg("bot", ACCOUNTANT));
      items.push(makeMsg("bot", GUARDRAIL));
      push(...items);
      setStep("guardrail");
    } else if (c.type === "goal") {
      answer("goal", c.goal, true);
    } else {
      push(makeMsg("bot", "Happy to help! Let's continue with a few quick questions."));
      if (step === "business" || step === "goal" || step === "costs") {
        push(makeMsg("bot", QUESTIONS[step]));
      }
    }
  }

  function restart() {
    setMessages([
      { id: 1, from: "bot", text: GREETING },
      { id: 2, from: "bot", text: QUESTIONS.business },
    ]);
    setAnswers({});
    setRating(null);
    setGuardrailHit(false);
    setStep("business");
  }

  // Buttons shown under the conversation, depending on the step
  let choices = [];
  if (step === "business") {
    choices = BUSINESS_OPTIONS.map((o) => ({ label: o, onClick: () => answer("business", o) }));
  } else if (step === "goal" || step === "guardrail") {
    choices = GOALS.map((g) => ({ label: g.label, onClick: () => answer("goal", g.label) }));
  } else if (step === "costs") {
    choices = COST_OPTIONS.map((o) => ({ label: o, onClick: () => answer("costs", o) }));
  } else if (step === "rate") {
    choices = [
      { label: "👍", onClick: () => handleRate("up") },
      { label: "👎", onClick: () => handleRate("down") },
    ];
  } else if (step === "save") {
    choices = [
      { label: "Yes", onClick: () => handleSave(true) },
      { label: "No", onClick: () => handleSave(false) },
    ];
  } else if (step === "done") {
    choices = [{ label: "Start again", onClick: restart }];
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
      {/* Conversation */}
      <div ref={boxRef} className="h-96 space-y-3 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.from === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-forest px-4 py-2.5 text-sm text-white"
                  : "max-w-[80%] rounded-2xl rounded-bl-sm border border-black/5 bg-cream px-4 py-2.5 text-sm text-black/80"
              }
            >
              <p>{m.text}</p>
              {m.link && (
                <a
                  href={m.link.href}
                  className="mt-2 inline-block rounded-lg bg-forest px-4 py-2 text-sm text-white transition hover:bg-forest-dark"
                >
                  {m.link.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Option buttons */}
      {choices.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {choices.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.onClick}
              disabled={saving}
              className="rounded-full border border-forest px-4 py-2 text-sm text-forest transition hover:bg-forest hover:text-white disabled:opacity-50"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Free text box */}
      <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t border-black/5 pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Or type a question…"
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm text-black focus:border-forest focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-forest px-5 py-2 text-sm text-white transition hover:bg-forest-dark"
        >
          Send
        </button>
      </form>
         <button
        type="button"
        onClick={restart}
        className="mt-3 text-sm text-forest underline"
      >
        Start over
      </button>
      <p className="mt-3 text-xs text-black/40">
        This assistant follows simple rules. It is not AI-generated and it does not give financial,
        tax or legal advice.
      </p>
    </div>
  );
}
