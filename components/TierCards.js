export const TIERS = [
  {
    name: "Compass",
    price: "$0",
    period: "/mo",
    tagline: "Your starting point to understand your numbers.",
    features: [
      { label: "Financial diagnosis", included: true },
      { label: "Price calculator (Core)", included: true },
      { label: "Saved history", included: true, note: "up to 1 result" },
      { label: "Research & Benchmarking", included: false },
      { label: "Short courses", included: false },
      { label: "Downloadable reports", included: false },
    ],
  },
  {
    name: "Pivot",
    price: "$99",
    period: "/mo",
    tagline: "When your business needs to adjust course.",
    features: [
      { label: "Financial diagnosis", included: true },
      { label: "Price calculator (Core)", included: true },
      { label: "Saved history", included: true, note: "unlimited" },
      { label: "Research & Benchmarking", included: true },
      { label: "Short courses", included: true },
      { label: "Downloadable reports", included: false },
    ],
  },
  {
    name: "Momentum",
    price: "$249",
    period: "/mo",
    tagline: "For businesses with traction who want to accelerate.",
    features: [
      { label: "Financial diagnosis", included: true },
      { label: "Price calculator (Core)", included: true },
      { label: "Saved history", included: true, note: "unlimited" },
      { label: "Research & Benchmarking", included: true },
      { label: "Short courses", included: true },
      { label: "Downloadable reports", included: true, note: "monthly" },
    ],
  },
];

export default function TierCards({ showCta = false }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {TIERS.map((tier) => (
        <div
          key={tier.name}
          className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <h3 className="font-display text-2xl text-black">{tier.name}</h3>
          <p className="mt-1 text-sm text-black/50">{tier.tagline}</p>
          <p className="mt-4">
            <span className="font-display text-3xl text-forest">{tier.price}</span>
            <span className="text-sm text-black/40">{tier.period}</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {tier.features.map((f) => (
              <li key={f.label} className="flex items-start gap-2">
                <span className={f.included ? "text-stable" : "text-black/20"}>
                  {f.included ? "✅" : "❌"}
                </span>
                <span className={f.included ? "text-black/80" : "text-black/40"}>
                  {f.label}
                  {f.note ? ` (${f.note})` : ""}
                </span>
              </li>
            ))}
          </ul>
          {showCta && (
            <button
              type="button"
              className="mt-6 rounded-lg bg-forest px-4 py-2.5 text-sm text-white transition hover:bg-forest-dark"
            >
              Choose {tier.name}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
