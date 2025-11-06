import { useEffect } from "react";
import { BadCard } from "../components/ExhibitCard.jsx";
import { EXHIBITS } from "../data.js";

export default function BadMuseum() {
  // Intentionally bad behaviors: remove focus outlines, autoplay audio
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

  return (
    <main>
      {/* No skip link, no landmarks */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-serif text-[#c9c9c9]">The Museum of Bad Design</h1>
        <p className="mt-2 text-[#bdbdbd]">Minimalism so minimal you can barely read it.</p>

        {/* Unlabeled search */}
        <div className="mt-6">
          <input
            className="w-60 border-b border-neutral-200 bg-transparent text-neutral-400 placeholder-neutral-300"
            placeholder="search"
          />
        </div>

        {/* Grid of inaccessible cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXHIBITS.map((e) => (
            <BadCard key={e.id} item={e} />
          ))}
        </div>

        {/* Vague link */}
        <div className="mt-10">
          <a href="#" className="text-neutral-300">
            more
          </a>
        </div>
      </section>
    </main>
  );
}
