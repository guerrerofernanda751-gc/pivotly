const SEGMENTS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 9l-2 5-5 2 2-5 5-2z"
        />
      </svg>
    ),
    title: "Business just getting started",
    description:
      "Just launched, low and irregular sales, very tight budget. Still doesn't know if the business is profitable.",
    bullets: [
      "Needs the basic financial diagnosis",
      "Likely stays on the Compass (free) tier for a while",
      "Prioritizes understanding their numbers over paying for tools",
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 17l5-5 4 4 8-9"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h6v6" />
      </svg>
    ),
    title: "Established business looking to grow",
    description:
      "Already has steady sales and some track record, but still doesn't fully understand margins or what to charge.",
    bullets: [
      "More willing to pay for tools that save time",
      "The natural candidate for the Pivot or Momentum tiers",
      "Values history, courses, and downloadable reports",
    ],
  },
];

export default function CustomerSegments() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {SEGMENTS.map((s) => (
        <div
          key={s.title}
          className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
            <span className="h-5 w-5">{s.icon}</span>
          </div>
          <h3 className="mt-4 font-display text-xl text-black">{s.title}</h3>
          <p className="mt-2 text-sm text-black/60">{s.description}</p>
          <ul className="mt-4 space-y-2 text-sm text-black/70">
            {s.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="text-forest-light">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
