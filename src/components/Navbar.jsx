import { NavLink } from "react-router-dom";

const base =
  "px-3 py-2 rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900";
const active = ({ isActive }) =>
  isActive
    ? `${base} bg-neutral-900 text-white`
    : `${base} text-neutral-800 hover:bg-neutral-200`;

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
        <NavLink to="/bad" className={active}>
          Museum of Bad Design
        </NavLink>
        <NavLink to="/good" className={active}>
          Restored Collection
        </NavLink>
      </div>
    </nav>
  );
}
