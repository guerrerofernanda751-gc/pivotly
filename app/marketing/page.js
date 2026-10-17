import MarketingEngine from "@/components/MarketingEngine";

const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Tools", href: "/core" },
  { label: "Roadmap", href: "/#roadmap" },
];

export default function Marketing() {
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
          Marketing engine
        </p>
        <h1 className="font-display text-3xl leading-tight text-black sm:text-4xl">
          The content kit to launch Pivotly
        </h1>
        <p className="mt-4 max-w-xl text-black/60">
          Two A/B tests, 10 social posts, 3 video scripts and a 14-day campaign
          calendar, all written for small shop, café and salon owners in Mexico.
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <MarketingEngine />
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
