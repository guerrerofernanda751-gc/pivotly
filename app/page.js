import SupabaseStatus from "@/components/SupabaseStatus";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Tools", href: "#tools" },
  { label: "Roadmap", href: "#roadmap" },
];

const tools = [
  {
    number: "01",
    title: "Financial diagnosis",
    description:
      "Answer a few questions about your sales, expenses, prices, inventory, debts, and customers.",
  },
  {
    number: "02",
    title: "Price calculator",
    description:
      "Find out if you're charging enough to cover your costs and actually make a profit.",
  },
  {
    number: "03",
    title: "Courses for your business",
    description:
      "Short, plain-language lessons picked for your specific result — no accounting degree needed.",
  },
];

const roadmap = [
  {
    stage: "This week",
    title: "Builder infrastructure",
    description:
      "Live site, navigation, and project foundation — the page you're looking at right now.",
    status: "current",
  },
  {
    stage: "Next",
    title: "Financial diagnosis flow",
    description:
      "The real questionnaire that produces your Stable / Review / Attention result.",
    status: "upcoming",
  },
  {
    stage: "Later",
    title: "Price calculator & courses",
    description: "Practical tools and short lessons matched to each diagnosis result.",
    status: "upcoming",
  },
];

export default function Home() {
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

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-forest-light">
            For small business owners in Mexico
          </p>
          <h1 className="font-display text-4xl leading-tight text-black sm:text-5xl">
            Understand your numbers and make better decisions
          </h1>
          <p className="mt-6 max-w-md text-lg text-black/60">
            A simple diagnosis to understand what your business needs — no
            advanced financial knowledge required.
          </p>
          <a
            href="#how-it-works"
            className="mt-8 inline-block rounded-lg bg-forest px-6 py-3 text-white transition hover:bg-forest-dark"
          >
            Start my diagnosis
          </a>
          <p className="mt-4 text-xs text-black/40">
            Diagnosis flow is coming soon — this button is a placeholder for now.
          </p>
          <SupabaseStatus />
        </div>

        {/* Traffic light preview card */}
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-medium text-black/50">
            Your financial traffic light
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-stable/10 p-4 text-center">
              <div className="mx-auto mb-2 h-6 w-6 rounded-full bg-stable" />
              <p className="text-sm font-medium text-black/70">Stable</p>
            </div>
            <div className="rounded-xl bg-review/10 p-4 text-center">
              <div className="mx-auto mb-2 h-6 w-6 rounded-full bg-review" />
              <p className="text-sm font-medium text-black/70">Review</p>
            </div>
            <div className="rounded-xl bg-attention/10 p-4 text-center">
              <div className="mx-auto mb-2 h-6 w-6 rounded-full bg-attention" />
              <p className="text-sm font-medium text-black/70">Attention</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-black/40">
            Example result — real results are calculated after your diagnosis.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section id="how-it-works" className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl text-black">How Pivotly helps</h2>
          <p id="tools" className="mt-3 max-w-xl text-black/60">
            Three simple steps — start with a diagnosis, then get matched with
            the right tools and lessons for where your business is right now.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.number}>
                <span className="font-display text-2xl text-forest-light">
                  {tool.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-black">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm text-black/60">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl text-black">Project roadmap</h2>
        <p className="mt-3 max-w-xl text-black/60">
          Pivotly is being built step by step. Here's where things stand.
        </p>
        <div className="mt-12 space-y-6">
          {roadmap.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 border-l-2 border-forest/20 pl-6 sm:flex-row sm:items-start sm:gap-6"
            >
              <span
                className={`w-24 shrink-0 text-xs font-semibold uppercase tracking-wide ${
                  item.status === "current" ? "text-forest" : "text-black/30"
                }`}
              >
                {item.stage}
              </span>
              <div>
                <h3 className="font-medium text-black">{item.title}</h3>
                <p className="mt-1 text-sm text-black/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-black/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Pivotly. Make smarter moves for your business.</p>
          <div className="flex gap-6">
            <a href="/docs" className="hover:text-forest">
              Docs
            </a>
            <a href="#how-it-works" className="hover:text-forest">
              How it works
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
