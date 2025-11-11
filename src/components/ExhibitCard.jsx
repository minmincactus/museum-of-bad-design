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
      <div className="relative">
        {/* use item.img, not item.image */}
        <img
          src={item.img}
          alt="" /* intentionally empty for the bad version */
          className="h-56 w-full object-cover blur-sm brightness-75"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#bdbdbd]">{item.title}</h3>
        <div className="mt-3 text-sm text-neutral-400">{item.desc}</div>
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
      {/* use item.img, not item.image */}
      <img src={item.img} alt={item.alt} className="h-56 w-full object-cover" />
      <div className="p-4">
        <h3 id={`title-${item.id}`} className="text-lg font-semibold text-neutral-900">
          {item.title}
        </h3>
        <p className="mt-3 text-sm text-neutral-700">{item.desc}</p>
      </div>
    </article>
  );
}
