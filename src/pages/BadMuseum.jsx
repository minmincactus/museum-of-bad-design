import { useEffect, useMemo } from "react";
import { BadCard } from "../components/ExhibitCard.jsx";
import { EXHIBITS } from "../data.js";
import { getOrCreateExhibitOrder } from "../study/dataStore.js";

export default function BadMuseum() {
  // accessibility-breaking extras
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `*:focus{outline:none !important}`;
    document.head.appendChild(style);

    const audio = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8d2bbf73f1.mp3?filename=soft-piano-ambient-110427.mp3"
    );
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().catch(() => {});
    return () => {
      document.head.removeChild(style);
      audio.pause();
    };
  }, []);

  // 🔀 stable random order for the “bad” condition
  const randomizedExhibits = useMemo(() => {
    const ids = EXHIBITS.map(e => e.id);
    const order = getOrCreateExhibitOrder("bad", ids);
    const map = new Map(EXHIBITS.map(e => [e.id, e]));
    return order.map(id => map.get(id)).filter(Boolean);
  }, []);

  return (
    <main>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-serif text-[#c9c9c9]">
          The Museum of Bad Design
        </h1>
        <p className="mt-2 text-[#bdbdbd]">
          Minimalism so minimal you can barely read it.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {randomizedExhibits.map(e => (
            <BadCard key={e.id} item={e} />
          ))}
        </div>
      </section>
    </main>
  );
}
