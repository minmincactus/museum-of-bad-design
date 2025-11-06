/* Two variants of the same card:
   - BadCard: intentionally inaccessible
   - GoodCard: accessible, semantic, focus-visible
*/
export function BadCard({ item }) {
    return (
      <div className="rounded-2xl border border-neutral-300 bg-white/60 shadow-sm overflow-hidden">
        {/* Missing/meaningless alt text */}
        <img src={item.image} alt="image" className="h-56 w-full object-cover" />
  
        <div className="p-4">
          {/* Low contrast title */}
          <h3 className="text-lg font-semibold text-[#bdbdbd]">{item.title}</h3>
  
          {/* Vague tiny button, no aria-label */}
          <button className="mt-3 text-xs px-2 py-1 rounded bg-white border border-neutral-200">
            click
          </button>
  
          {/* Decorative text without semantics */}
          <div className="mt-3 text-sm text-neutral-400">{item.desc}</div>
        </div>
      </div>
    );
  }
  
  export function GoodCard({ item }) {
    return (
      <article
        className="rounded-2xl border border-neutral-200 bg-white shadow-md overflow-hidden"
        aria-labelledby={`title-${item.id}`}
      >
        {/* Descriptive alt text */}
        <img src={item.image} alt={item.alt} className="h-56 w-full object-cover" />
        <div className="p-4">
          <h3 id={`title-${item.id}`} className="text-lg font-semibold text-neutral-900">
            {item.title}
          </h3>
  
          {/* Large tap target, clear label, visible focus style */}
          <button
            className="mt-3 px-3 py-2 rounded-xl bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
            aria-label={`Open details for ${item.title}`}
          >
            View details
          </button>
  
          <p className="mt-3 text-sm text-neutral-700">{item.desc}</p>
        </div>
      </article>
    );
  }
  