import Link from 'next/link';
import { ArrowRight, Building2, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';

const metricCards = [
  { label: 'Active supplier feeds', value: '3', icon: Building2 },
  { label: 'Merged hotels', value: '128', icon: MapPinned },
  { label: 'Best offers tracked', value: '94%', icon: Sparkles },
  { label: 'Review confidence', value: '0.91', icon: ShieldCheck },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Hotel merge and rank engine</div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Unify messy hotel listings into one trusted catalogue.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">Nexusstay consolidates duplicate supplier records, compares offers, and surfaces the strongest match using a transparent review workflow.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogue" className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-medium text-white hover:bg-primary-600">Explore catalogue <ArrowRight size={16} /></Link>
              <Link href="/review" className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50">Review matches</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {metricCards.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{label}</span>
                    <div className="rounded-lg bg-primary-50 p-2 text-primary-600"><Icon size={16} /></div>
                  </div>
                  <div className="mt-4 text-3xl font-bold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { title: 'Supplier feed monitoring', text: 'Track raw listings from three suppliers with search and filtering across each channel.', href: '/feeds' },
          { title: 'Consolidated catalogue', text: 'Review merged hotels and the best offer recommendation for every property.', href: '/catalogue' },
          { title: 'Human review & accuracy', text: 'Verify uncertain merges and compare engine quality against the naive baseline.', href: '/accuracy' },
        ].map((item) => (
          <Link key={item.title} href={item.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:border-primary-200 hover:shadow-lg">
            <div className="text-lg font-semibold text-slate-900">{item.title}</div>
            <p className="mt-3 text-sm text-slate-600">{item.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
