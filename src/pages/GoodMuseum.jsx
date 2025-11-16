// src/pages/GoodMuseum.jsx
import { useMemo } from "react";
import { GoodCard } from "../components/ExhibitCard.jsx";
import { EXHIBITS } from "../data.js";
import { getOrCreateExhibitOrder } from "../study/dataStore.js"; // ⬅️ add this

export default function GoodMuseum() {
  // ⬇️ get a stable randomized order for GOOD
  const order = useMemo(
    () => getOrCreateExhibitOrder("good", EXHIBITS.map(e => e.id)),
    []
  );
  const randomized = order.map(id => EXHIBITS.find(e => e.id === id));

  return (
    <main>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:bg-white focus:text-neutral-900 focus:px-3 focus:py-2 focus:rounded"
      >
      </a>


      <section id="main" role="main" className="mx-auto max-w-6xl px-4 py-8 pt-20">
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomized.map((e) => (
            <GoodCard key={e.id} item={e} />
          ))}
        </div>
      </section>
    </main>
  );
}
