import { createFileRoute, Link } from '@tanstack/react-router'
import { Sparkles, Wand2, Zap, Shield } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Describe your vision and watch as our AI crafts an advertising poster in seconds.',
  },
  {
    icon: Wand2,
    title: 'Creative Control',
    description: 'Precise prompt crafting gives you full creative direction over the output.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Download and use your generated advertising creatives immediately.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your prompts and generated images are tied to your account only.',
  },
]

function HomePage() {
  return (
    <main className="page-wrap">
      {/* Hero */}
      <section className="rise-in pt-20 pb-16 text-center">
        <span className="island-kicker mb-6 inline-block">AI Advertising Studio</span>
        <h1
          className="display-title mb-6 text-5xl font-bold leading-tight tracking-tight text-(--sea-ink) sm:text-6xl lg:text-7xl"
        >
          Generate stunning{' '}
          <span
            className="bg-[linear-gradient(135deg,var(--lagoon),var(--palm))] bg-clip-text text-transparent"
          >
            ad creatives
          </span>
          <br />in seconds
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-(--sea-ink-soft)">
          Describe your brand and campaign. Our AI generates professional advertising posters
          and captions ready for launch — no design skills needed.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 rounded-full 
             bg-(--) text-(--) 
             px-6 py-3 text-sm font-semibold 
             shadow-lg shadow-[rgba(50,143,151,0.3)] 
             transition hover:scale-105 hover:shadow-xl active:scale-100"
          >
            <Wand2 className="h-4 w-4 text-(--)" />
            Start Generating
          </Link>

          <a
            href="http://localhost:3000/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-6 py-3 text-sm font-semibold text-(--sea-ink) transition hover:bg-(--link-bg-hover) no-underline"
          >
            View API Docs
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="feature-card island-shell rounded-2xl border border-(--line) p-6 transition"
            >
              <div className="mb-3 inline-flex items-center justify-center rounded-xl border border-(--chip-line) bg-(--chip-bg) p-2.5">
                <Icon className="h-5 w-5 text-(--lagoon-deep)" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-(--sea-ink)">{title}</h3>
              <p className="text-sm leading-relaxed text-(--sea-ink-soft)">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
