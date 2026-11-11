import Link from "next/link";

const links = [
  ["Home", "/"],
  ["Chat", "/chat"],
  ["Demo", "/demo"],
  ["Dashboard", "/dashboard"],
  ["Docs", "/docs"],
];

const PROMPTS = [
  {
    title: "Guided chat (Pivi)",
    tool: "/chat",
    text: "Build a rule-based chat assistant named Pivi. It asks 3 short questions: business type, main goal, and if the user knows their costs. Then it sends the user to the best Pivotly page. No AI model. Add a guardrail for unsafe or off-topic input. Save a short summary in Supabase.",
  },
  {
    title: "Price calculator",
    tool: "/core",
    text: "Build a price calculator. Inputs: fixed costs, variable cost, units sold, desired margin. Output: a suggested price. Use simple words. Save every result in the core_outputs table.",
  },
  {
    title: "Market research helper",
    tool: "/research",
    text: "Build a page where the user picks a business type, adds notes, and checks off the competitors they reviewed. Save each session in the research_sessions table.",
  },
  {
    title: "Pricing simulator",
    tool: "/pricing",
    text: "Build a simulator for the paid plans. The user enters total users and picks a scenario. Show monthly and annual revenue. Save each run in pricing_scenarios.",
  },
  {
    title: "Marketing engine",
    tool: "/marketing",
    text: "Build a page that makes simple marketing text for a small business. Add an A/B test with two versions. Save each asset in marketing_assets and each vote in ab_votes.",
  },
  {
    title: "Demo walkthrough",
    tool: "/demo",
    text: "Build a guided demo page with a 6-step stepper. Each step has a short Pivi message, a button to open one tool, and Back and Next buttons. Add an agent map, a practical impact check, and a Version 2 roadmap.",
  },
  {
    title: "Dashboard",
    tool: "/dashboard",
    text: "Build a dashboard that reads the 6 Supabase tables. For each tool show the record count, the last saved date, one useful detail, and a link to open the tool. Show the total records and a testing summary.",
  },
];

const LOGS = [
  {
    week: "Weeks 0 to 2",
    text: "Project setup. Next.js with Tailwind. Home page. Deployed on Vercel from GitHub.",
  },
  {
    week: "Weeks 3 and 4",
    text: "Built the price calculator, research helper, pricing simulator and marketing engine. Connected Supabase and added public read and insert rules.",
  },
  {
    week: "Week 5",
    text: "Built the guided chat with Pivi. Tested with 3 external users. Found 2 problems and fixed them.",
  },
  {
    week: "Week 6",
    text: "Added the /demo walkthrough and the /dashboard page. Added this docs page. Ran the full-site test and the final user tests.",
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      <nav className="flex flex-wrap gap-4 px-6 py-4 border-b border-forest/10">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="hover:underline">
            {label}
          </Link>
        ))}
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl mb-3">Docs</h1>
        <p className="text-forest-light mb-10">
          How Pivotly was built. Here you find the prompts we used and the build logs.
        </p>

        <h2 className="font-display text-2xl mb-4">Prompt library</h2>
        <div className="space-y-4 mb-12">
          {PROMPTS.map((p) => (
            <div key={p.title} className="bg-white rounded-xl p-5 border border-forest/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{p.title}</h3>
                <Link href={p.tool} className="text-sm text-forest-light hover:underline">
                  {p.tool}
                </Link>
              </div>
              <p className="text-sm text-forest-light">{p.text}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl mb-4">Build logs</h2>
        <div className="space-y-4">
          {LOGS.map((l) => (
            <div key={l.week} className="border-l-4 border-forest pl-4">
              <h3 className="font-semibold">{l.week}</h3>
              <p className="text-sm text-forest-light">{l.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
