const SEGMENTS = [
  {
    title: "Negocio que apenas empieza",
    description:
      "Acaba de arrancar, ventas bajas e irregulares, presupuesto muy ajustado. Todavía no sabe si su negocio es rentable.",
    bullets: [
      "Necesita el diagnóstico financiero básico",
      "Probablemente se queda en el tier Compass (gratis) por un tiempo",
      "Prioriza entender sus números antes que pagar por herramientas",
    ],
  },
  {
    title: "Negocio ya establecido buscando crecer",
    description:
      "Ya tiene ventas estables y cierta trayectoria, pero sigue sin entender bien sus márgenes o cuánto debería cobrar.",
    bullets: [
      "Más dispuesto a pagar por herramientas que le ahorren tiempo",
      "Es el candidato natural para los tiers Pivot o Momentum",
      "Valora el historial, los cursos y los reportes descargables",
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
          <h3 className="font-display text-xl text-black">{s.title}</h3>
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
