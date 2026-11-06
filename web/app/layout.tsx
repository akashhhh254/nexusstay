import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nexusstay',
  description: 'Hotel merge and ranking engine',
};

const navItems = [
  { href: '/feeds', label: 'Feeds' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/review', label: 'Review' },
  { href: '/accuracy', label: 'Accuracy' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-lg font-bold text-white">N</div>
                <div>
                  <div className="text-lg font-semibold">Nexusstay</div>
                  <div className="text-xs text-slate-500">Hotel intelligence</div>
                </div>
              </Link>
              <nav className="hidden items-center gap-6 md:flex">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-primary-600">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
              <p>© 2026 Nexusstay. Synthetic hotel data for demo purposes.</p>
              <p>Built for hotel merge, ranking, and review workflows.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
