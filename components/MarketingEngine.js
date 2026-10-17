"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const AB_TESTS = [
  {
    id: "headline",
    question: "Which headline would make you stop scrolling?",
    variants: {
      A: "Are you really making money, or does it just look like it?",
      B: "Stop guessing your prices. Know your numbers.",
    },
  },
  {
    id: "cta",
    question: "Which button would you click?",
    variants: {
      A: "Try the price calculator",
      B: "Find out what to charge",
    },
  },
];

const POSTS = [
  {
    id: "post-1",
    bg: "forest",
    headline: "Meet Pivotly.",
    brand: true,
    caption:
      "Pivotly helps small shops, cafés and salons in Mexico see their real numbers and set the right prices. Start with our free price calculator. #smallbusiness #mexico #pivotly",
  },
  {
    id: "post-2",
    bg: "cream",
    headline: "A full register is not a full pocket.",
    caption:
      "Rent, supplies and wages come out first. Do you know what is really left at the end of the month? #smallbusiness #pricing #cafelife",
  },
  {
    id: "post-3",
    bg: "yellow",
    headline: "Are you pricing by gut feeling?",
    caption:
      "Add up your costs, pick the margin you want, and the right price follows. Pivotly's price calculator does the math in one minute. #smallbusiness #knowyournumbers",
  },
  {
    id: "post-4",
    bg: "orange",
    headline: "Fixed vs. variable costs, explained.",
    caption:
      "Fixed costs, like rent and wages, show up even on slow days. Variable costs, like ingredients and packaging, grow with every sale. Both belong in your price. #smallbusiness #pricing",
  },
  {
    id: "post-5",
    bg: "forest",
    headline: "Stable, Review or Attention?",
    caption:
      "In Pivotly's calculator, a healthy margin shows up green, a tight one yellow, and a risky one orange. Where does your business land? #financialhealth #smallbusiness",
  },
  {
    id: "post-6",
    bg: "cream",
    headline: "No accounting degree needed.",
    caption:
      "You run the shop, we help with the numbers. Plain language, simple tools, built for small businesses in Mexico. #smallbusiness #mexico #pivotly",
  },
  {
    id: "post-7",
    bg: "yellow",
    headline: "Price for the slow days too.",
    caption:
      "Your rent and wages don't shrink when sales do. When you sell fewer units, each one has to carry more of those fixed costs. Check your price against a slow month. #smallbusiness #pricing",
  },
  {
    id: "post-8",
    bg: "orange",
    headline: "What margin do you actually want?",
    caption:
      "Margin is the part of the price you keep as profit. For example, a 25% margin on a $100 price means $25 stays with you after costs. Pick yours before you set your price. #smallbusiness #margins",
  },
  {
    id: "post-9",
    bg: "forest",
    headline: "A popular product can still lose money.",
    caption:
      "If the price doesn't cover what it costs to make and sell, every sale digs the hole deeper. Run the numbers on your best seller first. #smallbusiness #knowyournumbers",
  },
  {
    id: "post-10",
    bg: "cream",
    headline: "Find out what to charge.",
    caption:
      "Enter your costs, choose your margin, and get a suggested price in about a minute. Try Pivotly's free price calculator. #pivotly #smallbusiness #mexico",
  },
];

const VIDEOS = [
  {
    id: "video-1",
    title: "3 numbers every café owner should know",
    duration: "0:30",
    hook: {
      time: "0:00-0:05",
      text: "Close-up of a hand writing prices on a chalkboard. Voiceover: \"Do you know if you're actually making money?\"",
    },
    middle: {
      time: "0:05-0:25",
      text: "Three text cards appear one at a time: Fixed costs, Variable costs, Your margin. Voiceover explains each in one short sentence.",
    },
    close: {
      time: "0:25-0:30",
      text: "Pivotly's price calculator on screen. \"Find out what to charge. Free at Pivotly.\"",
    },
  },
  {
    id: "video-2",
    title: "3 pricing mistakes small shops make",
    duration: "0:30",
    hook: {
      time: "0:00-0:05",
      text: "Hand crossing out a price on a chalkboard. Voiceover: \"Most small shops make at least one of these pricing mistakes.\"",
    },
    middle: {
      time: "0:05-0:25",
      text: "Three text cards appear one at a time. Copying a competitor's price: \"Their costs are not your costs.\" Forgetting fixed costs: \"Rent and wages come out of every sale.\" Pricing without a margin: \"If you don't choose your profit, you don't get one.\"",
    },
    close: {
      time: "0:25-0:30",
      text: "Pivotly's price calculator on screen. \"Fix your price in a minute. Free at Pivotly.\"",
    },
  },
  {
    id: "video-3",
    title: "Stable, Review or Attention?",
    duration: "0:30",
    hook: {
      time: "0:00-0:05",
      text: "Three circles (green, yellow, orange) light up one by one. Voiceover: \"Is your price healthy? This is how to read the result.\"",
    },
    middle: {
      time: "0:05-0:25",
      text: "Each color gets one card. Stable (green): \"Your margin is comfortable, 20% or more.\" Review (yellow): \"Your margin is tight, between 5% and 20%. Take another look.\" Attention (orange): \"Your margin is almost zero, or you're losing money.\"",
    },
    close: {
      time: "0:25-0:30",
      text: "Result card on screen. \"See where your price lands. Try the Pivotly price calculator.\"",
    },
  },
];

const CALENDAR = [
  { day: 1, type: "Post", topic: "Meet Pivotly" },
  { day: 2, type: "Post", topic: "A full register is not a full pocket" },
  { day: 3, type: "Post", topic: "Are you pricing by gut feeling?" },
  { day: 4, type: "Video", topic: "3 numbers every café owner should know" },
  { day: 5, type: "Post", topic: "Fixed vs. variable costs, explained" },
  { day: 6, type: "Post", topic: "Stable, Review or Attention?" },
  { day: 7, type: "Rest", topic: "Check the A/B votes and note which version is winning" },
  { day: 8, type: "Post", topic: "No accounting degree needed" },
  { day: 9, type: "Video", topic: "3 pricing mistakes small shops make" },
  { day: 10, type: "Post", topic: "Price for the slow days too" },
  { day: 11, type: "Post", topic: "What margin do you actually want?" },
  { day: 12, type: "Video", topic: "Stable, Review or Attention?" },
  { day: 13, type: "Post", topic: "A popular product can still lose money" },
  { day: 14, type: "Post", topic: "Find out what to charge" },
];

const POST_STYLES = {
  forest: "bg-forest text-white",
  cream: "bg-cream text-forest border-b border-black/5",
  yellow: "bg-review/20 text-black",
  orange: "bg-attention/15 text-black",
};

function videoToText(v) {
  return (
    v.title +
    " (" + v.duration + ")\n" +
    "Hook (" + v.hook.time + "): " + v.hook.text + "\n" +
    "Middle (" + v.middle.time + "): " + v.middle.text + "\n" +
    "Close (" + v.close.time + "): " + v.close.text
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function BrandMark({ light }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={
          "font-display text-lg tracking-tight " + (light ? "text-white" : "text-forest")
        }
      >
        Pivotly
      </span>
      <span className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-stable" />
        <span className="h-2 w-2 rounded-full bg-review" />
        <span className="h-2 w-2 rounded-full bg-attention" />
      </span>
    </span>
  );
}

function ActionButtons({ onCopy, onSave, copied, saveState }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        onClick={onCopy}
        className="rounded-lg border border-forest px-4 py-1.5 text-xs font-medium text-forest transition hover:bg-forest hover:text-white"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saveState === "saving"}
        className="rounded-lg bg-forest px-4 py-1.5 text-xs font-medium text-white transition hover:bg-forest-dark disabled:opacity-50"
      >
        {saveState === "saving" ? "Saving…" : "Save"}
      </button>
      {saveState === "saved" && <span className="text-xs text-stable">✅ Saved</span>}
      {saveState === "error" && (
        <span className="text-xs text-attention">Couldn't save</span>
      )}
    </div>
  );
}

function PostCard({ post, copied, saveState, onCopy, onSave }) {
  const light = post.bg === "forest";
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest font-display text-sm text-white">
          P
        </span>
        <span className="text-sm font-medium text-black">pivotly</span>
        <span className="ml-auto text-xs text-black/30">Social post</span>
      </div>

      {/* Square visual */}
      <div
        className={
          "flex aspect-square flex-col items-center justify-center gap-4 px-8 text-center " +
          POST_STYLES[post.bg]
        }
      >
        {post.brand && <BrandMark light={light} />}
        <p className="font-display text-2xl leading-tight sm:text-3xl">{post.headline}</p>
      </div>

      {/* Actions + caption */}
      <div className="px-4 pb-4 pt-3">
        <div className="flex gap-3 text-black/60">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22l-4-9-9-4z" />
          </svg>
        </div>
        <p className="mt-2 text-sm text-black/70">
          <span className="font-medium text-black">pivotly </span>
          {post.caption}
        </p>
        <ActionButtons
          onCopy={onCopy}
          onSave={onSave}
          copied={copied}
          saveState={saveState}
        />
      </div>
    </div>
  );
}

function VideoCard({ video, open, onToggle, copied, saveState, onCopy, onSave }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest font-display text-sm text-white">
          P
        </span>
        <span className="text-sm font-medium text-black">pivotly</span>
        <span className="ml-auto rounded-full bg-forest/10 px-2 py-0.5 text-xs text-forest-light">
          Video script
        </span>
      </div>

      <div className="relative flex h-52 flex-col items-center justify-center bg-forest px-6 text-center text-white">
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? "Hide script" : "Show script"}
          className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <p className="font-display text-xl leading-tight">{video.title}</p>
        <span className="absolute bottom-3 right-4 rounded bg-black/40 px-2 py-0.5 text-xs">
          {video.duration}
        </span>
      </div>

      <div className="px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={onToggle}
          className="text-xs font-medium text-forest underline"
        >
          {open ? "Hide script" : "Show script"}
        </button>

        {open && (
          <div className="mt-3 space-y-3 text-sm text-black/70">
            <p>
              <span className="font-medium text-black">Hook ({video.hook.time}): </span>
              {video.hook.text}
            </p>
            <p>
              <span className="font-medium text-black">Middle ({video.middle.time}): </span>
              {video.middle.text}
            </p>
            <p>
              <span className="font-medium text-black">Close ({video.close.time}): </span>
              {video.close.text}
            </p>
          </div>
        )}

        <ActionButtons
          onCopy={onCopy}
          onSave={onSave}
          copied={copied}
          saveState={saveState}
        />
      </div>
    </div>
  );
}

function VoteBlock({ test, counts, voteState, onVote }) {
  const total = (counts.A || 0) + (counts.B || 0);
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-forest-light">
        A/B test · {test.id === "headline" ? "Headline" : "Button text"}
      </p>
      <p className="mb-4 font-display text-xl text-black">{test.question}</p>

      <div className="space-y-3">
        {["A", "B"].map((v) => {
          const n = counts[v] || 0;
          const pct = total === 0 ? 0 : Math.round((n / total) * 100);
          return (
            <div key={v} className="rounded-xl border border-black/10 p-4">
              <p className="text-sm text-black">
                <span className="mr-2 font-semibold text-forest">Version {v}</span>
                {test.variants[v]}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onVote(test.id, v)}
                  disabled={voteState === "saving"}
                  className="rounded-lg bg-forest px-4 py-1.5 text-xs font-medium text-white transition hover:bg-forest-dark disabled:opacity-50"
                >
                  Vote for {v}
                </button>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-forest" style={{ width: pct + "%" }} />
                </div>
                <span className="w-24 text-right text-xs text-black/60">
                  {n} vote{n === 1 ? "" : "s"} ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {voteState === "error" && (
        <p className="mt-3 text-xs text-attention">Couldn't save your vote. Try again.</p>
      )}
      <p className="mt-3 text-xs text-black/40">
        Votes are anonymous and saved. Total votes: {total}.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function MarketingEngine() {
  const [votes, setVotes] = useState([]);
  const [voteState, setVoteState] = useState({});
  const [assets, setAssets] = useState([]);
  const [assetsState, setAssetsState] = useState("loading");
  const [copiedId, setCopiedId] = useState(null);
  const [saveStates, setSaveStates] = useState({});
  const [openVideo, setOpenVideo] = useState(null);

  async function loadVotes() {
    const { data, error } = await supabase.from("ab_votes").select("*");
    if (!error) setVotes(data || []);
  }

  async function loadAssets() {
    setAssetsState("loading");
    const { data, error } = await supabase
      .from("marketing_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) {
      setAssetsState("error");
      return;
    }
    setAssets(data || []);
    setAssetsState("ready");
  }

  useEffect(() => {
    loadVotes();
    loadAssets();
  }, []);

  function countsFor(testId) {
    const counts = { A: 0, B: 0 };
    votes.forEach((row) => {
      if (row.test_name === testId && counts[row.variant] !== undefined) {
        counts[row.variant] += 1;
      }
    });
    return counts;
  }

  async function handleVote(testId, variant) {
    setVoteState((s) => ({ ...s, [testId]: "saving" }));
    const { error } = await supabase
      .from("ab_votes")
      .insert({ test_name: testId, variant: variant });
    if (error) {
      setVoteState((s) => ({ ...s, [testId]: "error" }));
      return;
    }
    setVoteState((s) => ({ ...s, [testId]: "idle" }));
    loadVotes();
  }

  async function handleCopy(id, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      setCopiedId(null);
    }
  }

  async function handleSave(id, assetType, title, content) {
    setSaveStates((s) => ({ ...s, [id]: "saving" }));
    const { error } = await supabase
      .from("marketing_assets")
      .insert({ asset_type: assetType, title: title, content: content });
    if (error) {
      setSaveStates((s) => ({ ...s, [id]: "error" }));
      return;
    }
    setSaveStates((s) => ({ ...s, [id]: "saved" }));
    loadAssets();
  }

  return (
    <div className="space-y-16">
      {/* A/B tests */}
      <section>
        <h2 className="mb-2 font-display text-2xl text-black">A/B tests</h2>
        <p className="mb-6 max-w-xl text-sm text-black/60">
          Two versions of the same message. Ask friends to vote for the one they
          like better, and the winner shows up in the counts.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {AB_TESTS.map((t) => (
            <VoteBlock
              key={t.id}
              test={t}
              counts={countsFor(t.id)}
              voteState={voteState[t.id]}
              onVote={handleVote}
            />
          ))}
        </div>
      </section>

      {/* Social posts */}
      <section>
        <h2 className="mb-2 font-display text-2xl text-black">10 social posts</h2>
        <p className="mb-6 max-w-xl text-sm text-black/60">
          Ready to copy and paste. Copy puts the caption on your clipboard, and
          Save keeps it in your saved assets below.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              copied={copiedId === p.id}
              saveState={saveStates[p.id]}
              onCopy={() => handleCopy(p.id, p.caption)}
              onSave={() => handleSave(p.id, "social_post", p.headline, p.caption)}
            />
          ))}
        </div>
      </section>

      {/* Video scripts */}
      <section>
        <h2 className="mb-2 font-display text-2xl text-black">3 video scripts</h2>
        <p className="mb-6 max-w-xl text-sm text-black/60">
          These are written scripts, not finished videos. Press play to read the
          full script.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              open={openVideo === v.id}
              onToggle={() => setOpenVideo(openVideo === v.id ? null : v.id)}
              copied={copiedId === v.id}
              saveState={saveStates[v.id]}
              onCopy={() => handleCopy(v.id, videoToText(v))}
              onSave={() => handleSave(v.id, "video_script", v.title, videoToText(v))}
            />
          ))}
        </div>
      </section>

      {/* Calendar */}
      <section>
        <h2 className="mb-2 font-display text-2xl text-black">14-day campaign calendar</h2>
        <p className="mb-6 max-w-xl text-sm text-black/60">
          A plan only. Nothing is published automatically.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5 text-black/40">
                <th className="pb-2 pr-4 font-medium">Day</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium">Topic</th>
              </tr>
            </thead>
            <tbody>
              {CALENDAR.map((row) => (
                <tr key={row.day} className="border-b border-black/5 last:border-0">
                  <td className="py-2 pr-4 text-black/70">{row.day}</td>
                  <td className="py-2 pr-4">
                    <span className="rounded-full bg-forest/10 px-2 py-0.5 text-xs text-forest-light">
                      {row.type}
                    </span>
                  </td>
                  <td className="py-2 text-black/70">{row.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Saved assets */}
      <section>
        <h2 className="mb-2 font-display text-2xl text-black">Saved assets</h2>
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          {assetsState === "loading" && <p className="text-sm text-black/40">Loading…</p>}
          {assetsState === "error" && (
            <p className="text-sm text-attention">Couldn't load saved assets.</p>
          )}
          {assetsState === "ready" && assets.length === 0 && (
            <p className="text-sm text-black/40">
              Nothing saved yet. Press Save on any post or script above.
            </p>
          )}
          {assetsState === "ready" && assets.length > 0 && (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 text-black/40">
                  <th className="pb-2 pr-4 font-medium">Date</th>
                  <th className="pb-2 pr-4 font-medium">Type</th>
                  <th className="pb-2 font-medium">Title</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b border-black/5 last:border-0">
                    <td className="py-2 pr-4 text-black/70">
                      {new Date(a.created_at).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-2 pr-4 text-black/70">
                      {a.asset_type === "video_script" ? "Video script" : "Social post"}
                    </td>
                    <td className="py-2 text-black/70">{a.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
