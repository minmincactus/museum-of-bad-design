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

/* ----------------------------------------------------------
   BAD CARD — reads badAlt, always blurry + empty alt
----------------------------------------------------------- */
export function BadCard({ item }) {
  function select() {
    if (window.__selectExhibitForStudy) window.__selectExhibitForStudy(item.id);
  }

  function onListen(e) {
    e.stopPropagation();
    const text = item.badAlt || "No description available.";
    speak(text, { rate: 1, pitch: 1 });
    logListen(item.id, "bad");
  }

  function onStop(e) {
    e.stopPropagation();
    stopSpeaking();
  }

  return (
    <div
      className="
        rounded-2xl border border-neutral-200 bg-white shadow-md overflow-hidden cursor-pointer
        transition
        hover:border-neutral-900 hover:shadow-lg
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900
        focus-visible:ring-offset-2 focus-visible:ring-offset-white
      "
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select()}
      aria-label={`Exhibit card (bad version): ${item.title}`}
    >
      <div className="h-56 w-full overflow-hidden">
        <img
          src={item.img}
          alt=""  /* bad museum: no useful alt text */
          className="h-full w-full object-cover blur-lg select-none brightness-50 contrast-50 "
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onListen}
            className="px-2 py-1 rounded-md border bg-white hover:bg-neutral-50 active:scale-[0.99]"
            aria-label={`Listen to bad description: ${item.title}`}
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
    </div>
  );
}

/* ----------------------------------------------------------
   GOOD CARD — reads alt, blur removed when study is done
----------------------------------------------------------- */
export function GoodCard({ item }) {
  function select() {
    if (window.__selectExhibitForStudy) window.__selectExhibitForStudy(item.id);
  }

  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  function onListen(e) {
    e.stopPropagation();
    speak(item.alt || "No description available.");
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
        transition
        hover:border-neutral-900 hover:shadow-lg
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900
        focus-visible:ring-offset-2 focus-visible:ring-offset-white
      "
      aria-labelledby={`title-${item.id}`}
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select()}
    >
      <div className="h-56 w-full overflow-hidden">
        <img
          src={item.img}
          alt={item.alt}
          className="h-full w-full object-cover blur-lg good-exhibit-img select-none brightness-50 contrast-50"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

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
      </div>
    </article>
  );
}
