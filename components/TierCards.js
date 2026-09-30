export const TIERS = [
  {
    name: "Compass",
    price: "$0",
    period: "/mes",
    tagline: "Tu punto de partida para entender tus números.",
    features: [
      { label: "Diagnóstico financiero", included: true },
      { label: "Calculadora de precios (Core)", included: true },
      { label: "Historial guardado", included: true, note: "hasta 1 resultado" },
      { label: "Research & Benchmarking", included: false },
      { label: "Cursos cortos", included: false },
      { label: "Reportes descargables", included: false },
    ],
  },
  {
    name: "Pivot",
    price: "$99",
    period: "/mes",
    tagline: "Cuando tu negocio ya necesita ajustar el rumbo.",
    features: [
      { label: "Diagnóstico financiero", included: true },
      { label: "Calculadora de precios (Core)", included: true },
      { label: "Historial guardado", included: true, note: "ilimitado" },
      { label: "Research & Benchmarking", included: true },
      { label: "Cursos cortos", included: true },
      { label: "Reportes descargables", included: false },
    ],
  },
  {
    name: "Momentum",
    price: "$249",
    period: "/mes",
    tagline: "Para negocios con tracción que quieren acelerar.",
    features: [
      { label: "Diagnóstico financiero", included: true },
      { label: "Calculadora de precios (Core)", included: true },
      { label: "Historial guardado", included: true, note: "ilimitado" },
      { label: "Research & Benchmarking", included: true },
      { label: "Cursos cortos", included: true },
      { label: "Reportes descargables", included: true, note: "mensuales" },
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
