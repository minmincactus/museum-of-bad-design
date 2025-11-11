import { NavLink, useNavigate } from "react-router-dom";

function hasConsent() {
  try {
    return !!JSON.parse(localStorage.getItem("museum-consent") || "null")?.consent;
  } catch { return false; }
}

export default function Navbar() {
  const nav = useNavigate();
  const consent = hasConsent();

  function safeNav(path) {
    if (!consent) {
      nav("/consent");
    } else {
      nav(path);
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex gap-4">
        <button className="text-sm" onClick={() => nav("/tutorial")}>Tutorial</button>
      </div>
    </nav>
  );
}
