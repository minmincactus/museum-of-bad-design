export function BadCard({ item }) {
  function select() {
    if (window.__selectExhibitForStudy) window.__selectExhibitForStudy(item.id);
  }

  return (
    <div
      className="rounded-2xl border border-neutral-300 bg-white/60 shadow-sm overflow-hidden cursor-pointer"
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select()}
    >
      <div className="relative overflow-hidden">
        <img
          src={item.img}             // ✅ show image
          alt=""                     // 🚫 no alt text (bad design)
          className="h-56 w-full object-cover blur-md brightness-50" // subtle blur, darker
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>
    </div>
  );
}

export function GoodCard({ item }) {
  function select() {
    if (window.__selectExhibitForStudy) window.__selectExhibitForStudy(item.id);
  }

  return (
    <article
      className="rounded-2xl border border-neutral-200 bg-white shadow-md overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-neutral-900"
      aria-labelledby={`title-${item.id}`}
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select()}
    >
      {/* 🧠 Alt text is read by screen readers, but not shown visually */}
      <img
        src={item.img}
        alt={item.alt}
        className="h-56 w-full object-cover"
      />

      {/* 🫥 Hide visual title/desc, but keep them for accessibility */}
      <div className="p-4 sr-only">
        <h3 id={`title-${item.id}`}>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
    </article>
  );
}

