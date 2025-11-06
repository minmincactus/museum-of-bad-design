import { GoodCard } from "../components/ExhibitCard.jsx";
import { EXHIBITS } from "../data.js";

export default function GoodMuseum() {
  return (
    <main>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:bg-white focus:text-neutral-900 focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>

      <header role="banner" className="bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            The Restored Collection
          </h1>
          <p className="mt-1 text-neutral-600 max-w-2xl">
            An accessible gallery with descriptive alt text, clear focus indicators, and semantic
            structure.
          </p>
        </div>
      </header>

      <section id="main" role="main" className="mx-auto max-w-5xl px-4 py-8">
        <form aria-label="Search exhibits" className="flex items-center gap-3">
          <label htmlFor="q" className="text-sm text-neutral-800">
            Search
          </label>
          <input
            id="q"
            name="q"
            className="w-64 rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="Type to filter..."
          />
        </form>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXHIBITS.map((e) => (
            <GoodCard key={e.id} item={e} />
          ))}
        </div>

        <nav aria-label="Pagination" className="mt-10">
          <button
            className="px-3 py-2 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
            aria-label="Show more exhibits"
          >
            Show more
          </button>
        </nav>
      </section>

      <footer role="contentinfo" className="mt-8 border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-neutral-600">
          © 2025 Museum of Bad Design — Restored Edition
        </div>
      </footer>
    </main>
  );
}
