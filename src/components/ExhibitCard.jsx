/* src/components/ExhibitCard.jsx */
import React, { useRef, useState } from "react";

/** ---- Tiny speech helper ---- */
let currentUtterance = null;

function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {}
  currentUtterance = null;
}

function speak(text, { rate = 1, pitch = 1, lang = "en-US" } = {}) {
  stopSpeaking();
  if (!("speechSynthesis" in window)) {
    alert("Text-to-speech not supported in this browser.");
    return;
  }
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = rate;
  utt.pitch = pitch;
  utt.lang = lang;
  currentUtterance = utt;
  window.speechSynthesis.speak(utt);
}

/** Optional hook for study logging */
function logListen(itemId, variant) {
  if (typeof window.__logListenForStudy === "function") {
    try {
      window.__logListenForStudy({ itemId, variant, ts: Date.now() });
    } catch {}
  }
}

/** ---------------- Bad card (intentionally inaccessible) ---------------- */
export function BadCard({ item }) {
  function select() {
    if (window.__selectExhibitForStudy) window.__selectExhibitForStudy(item.id);
  }

  // Message to simulate poor/missing alt text
  // You can also set item.badAlt on specific items in data.js
  const badMessage = item.badAlt ?? "…No description available.";

  function onListen(e) {
    e.stopPropagation(); // don't trigger select
    // Option A (frustrating): speak vague/empty text
    speak(badMessage, { rate: 1, pitch: 1 });
    logListen(item.id, "bad");
  }

  function onStop(e) {
    e.stopPropagation();
    stopSpeaking();
  }

  return (
    <div
      className="
        rounded-2xl border border-neutral-300 bg-white/60 shadow-sm overflow-hidden cursor-pointer
        transition-all
        hover:ring-2 hover:ring-neutral-400
        focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-white
      "
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select()}
      aria-label="Exhibit card"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.img}
          alt="" /* 🚫 intentionally missing alt text */
          className="h-56 w-full object-cover blur-md brightness-50"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* Control strip (visually present, but still not great semantics) */}
      <div className="flex items-center gap-2 p-3 text-sm">
        <button
          onClick={onListen}
          className="px-2 py-1 rounded-md border bg-white hover:bg-neutral-50 active:scale-[0.99]"
          aria-label="Listen to description (inaccessible)"
        >
          🔊 Listen
        </button>
        <button
          onClick={onStop}
          className="px-2 py-1 rounded-md border bg-white hover:bg-neutral-50"
          aria-label="Stop audio"
        >
          🛑 Stop
        </button>
      </div>
    </div>
  );
}

/** ---------------- Good card (accessible) ---------------- */
export function GoodCard({ item }) {
  function select() {
    if (window.__selectExhibitForStudy) window.__selectExhibitForStudy(item.id);
  }

  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  function onListen(e) {
    e.stopPropagation();
    if (!item.alt) {
      speak("No description available.");
      logListen(item.id, "good-missing");
      return;
    }
    speak(item.alt);
    speakingRef.current = true;
    setSpeaking(true);
    logListen(item.id, "good");
  }

  function onStop(e) {
    e.stopPropagation();
    stopSpeaking();
    speakingRef.current = false;
    setSpeaking(false);
  }

  return (
    <article
      className="
        rounded-2xl border border-neutral-200 bg-white shadow-md overflow-hidden cursor-pointer
        transition-all
        hover:ring-4 hover:ring-neutral-900
        focus:outline-none focus:ring-4 focus:ring-neutral-900 focus:ring-offset-2 focus:ring-offset-white
      "
      aria-labelledby={`title-${item.id}`}
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select()}
    >
      {/* ✅ Proper alt text for screen readers */}
      <img
        src={item.img}
        alt={item.alt}
        className="h-56 w-full object-cover"
      />

      {/* Visually minimal, still accessible content */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onListen}
            className="px-2 py-1 rounded-md border bg-white hover:bg-neutral-50 active:scale-[0.99]"
            aria-label={`Listen to description: ${item.title}`}
          >
            🔊 Listen
          </button>
          <button
            onClick={onStop}
            className="px-2 py-1 rounded-md border bg-white hover:bg-neutral-50"
            aria-label="Stop audio"
          >
            🛑 Stop
          </button>
        </div>

        {/* Keep description accessible; you can visually hide if you prefer */}
        <p className="sr-only">{item.desc}</p>
      </div>
    </article>
  );
}
