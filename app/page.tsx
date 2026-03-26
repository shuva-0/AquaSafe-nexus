import Link from 'next/link';
import { domainConfigs, domainList } from '@/lib/domains';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm text-slate-300">
              Deterministic Risk Analysis
            </span>
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            AquaSafe Nexus{' '}
            <span className="bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
              X&#8734;
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-slate-400">
            A fully explainable, auditable risk intelligence platform. Compute
            real-time risk scores for Water, Infrastructure, and Environment
            domains using pure mathematics - no ML black boxes.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/analyze">
              <Button size="lg" className="bg-sky-500 px-8 font-semibold text-white hover:bg-sky-600">
                Start Analysis
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8 font-semibold">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Domain Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            Three Domains
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Comprehensive risk monitoring across critical systems
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {domainList.map((domain) => {
              const config = domainConfigs[domain];
              return (
                <div
                  key={domain}
                  className="group relative overflow-hidden rounded-xl border border-slate-700 bg-[#1e293b] p-6 transition-all duration-300 hover:border-slate-600"
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 100%, ${config.color}15, transparent 60%)`,
                    }}
                  />

                  <div className="relative">
                    <div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-white">
                      {config.label}
                    </h3>

                    <p className="mb-4 text-sm text-slate-400">
                      {domain === 'water' &&
                        'Monitor pH, turbidity, dissolved oxygen, and other water quality parameters.'}
                      {domain === 'infrastructure' &&
                        'Track load stress, vibration, crack index, and structural integrity metrics.'}
                      {domain === 'environment' &&
                        'Analyze AQI, PM2.5, CO2 levels, and environmental quality indicators.'}
                    </p>

                    <div className="text-sm text-slate-500">
                      {config.parameters.length} parameters monitored
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Deterministic',
                description:
                  'Pure mathematical calculations. No ML uncertainty or black boxes.',
              },
              {
                title: 'Explainable',
                description:
                  'XAI contribution bars show exactly why each decision was made.',
              },
              {
                title: 'Auditable',
                description:
                  'Full transparency into all formulas and threshold configurations.',
              },
              {
                title: 'Real-time',
                description:
                  'Instant client-side computation with live simulation mode.',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <h3 className="mb-2 font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formula Section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">The Math</h2>
          <div className="rounded-xl border border-slate-700 bg-[#1e293b] p-8">
            <div className="mb-4 font-mono text-2xl text-slate-200">
              R = &#931;(w&#7522; &#215; penalty&#7522;) / &#931;(w&#7522;)
            </div>
            <p className="text-sm text-slate-400">
              Risk Index is the weighted average of all parameter penalties,
              bounded between 0 and 100. Each parameter&apos;s penalty is calculated
              based on its deviation from safe ranges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
