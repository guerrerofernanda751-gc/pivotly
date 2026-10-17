const worries = [
  {
    dot: "bg-attention",
    title: "“I sell every day, but I never have money left.”",
    text: "Sales look good, yet the cash disappears. Pivotly shows where it goes.",
  },
  {
    dot: "bg-review",
    title: "“I set my prices by guessing.”",
    text: "Add your costs and get a price that actually covers them and leaves a profit.",
  },
  {
    dot: "bg-stable",
    title: "“I don't know if my business is healthy.”",
    text: "Get a simple green, yellow or red signal, with no accounting degree needed.",
  },
];

export function FamiliarSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-forest-light">
        Sound familiar?
      </p>
      <h2 className="font-display text-3xl leading-tight text-black sm:text-4xl">
        Most small business owners think this at least once
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {worries.map((w) => (
          <div
            key={w.title}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <span className={`mb-4 block h-3 w-3 rounded-full ${w.dot}`} />
            <p className="font-display text-lg leading-snug text-black">{w.title}</p>
            <p className="mt-3 text-sm text-black/60">{w.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ClosingBand() {
  return (
    <section className="bg-forest">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
            Ready to see your real numbers?
          </h2>
          <p className="mt-2 text-white/70">Start with the price calculator. It's free.</p>
        </div>
        <a
          href="/core"
          className="inline-block rounded-lg bg-cream px-6 py-3 text-forest transition hover:bg-white"
        >
          Try the price calculator
        </a>
      </div>
    </section>
  );
}
