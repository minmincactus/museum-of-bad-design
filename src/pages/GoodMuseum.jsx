import { useMemo } from "react";
import { GoodCard } from "../components/ExhibitCard.jsx";
import { EXHIBITS } from "../data.js";
import { getOrCreateExhibitOrder } from "../study/dataStore.js";

export default function GoodMuseum() {
  // 🔀 stable random order for the “good” condition
  const randomizedExhibits = useMemo(() => {
    const ids = EXHIBITS.map(e => e.id);
    const order = getOrCreateExhibitOrder("good", ids);
    const map = new Map(EXHIBITS.map(e => [e.id, e]));
    return order.map(id => map.get(id)).filter(Boolean);
  }, []);

  return (
    <main>
      {/* accessible layout */}
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
            An accessible gallery with descriptive alt text, clear focus
            indicators, and semantic structure.
          </p>
        </div>
      </header>

      <section id="main" role="main" className="mx-auto max-w-5xl px-4 py-8">
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomizedExhibits.map(e => (
            <GoodCard key={e.id} item={e} />
          ))}
        </div>
      </section>
    </main>
  );
}
