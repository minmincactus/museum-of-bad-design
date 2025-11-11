import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import BadMuseum from "./pages/BadMuseum.jsx";
import GoodMuseum from "./pages/GoodMuseum.jsx";
import Tutorial from "./pages/Tutorial.jsx";
import StudyHUD from "./study/StudyHUD.jsx";

export default function App() {
  const loc = useLocation();

  // optional nudges from Tutorial; not required for auto-start
  const stateStart = loc.state?.autoStart === true;
  const qsStart = new URLSearchParams(loc.search).get("start") === "1";
  const lsStart = localStorage.getItem("museum-start-now") === "1";
  const autoStart = stateStart || qsStart || lsStart;
  if (lsStart) localStorage.removeItem("museum-start-now");

  const onMuseumPage = loc.pathname === "/bad" || loc.pathname === "/good";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />
      {onMuseumPage && <StudyHUD autoStart={autoStart} />}

      <Routes>
        <Route path="/" element={<Navigate to="/tutorial" replace />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/bad" element={<BadMuseum />} />
        <Route path="/good" element={<GoodMuseum />} />
        <Route path="*" element={<div className="p-8">Not Found</div>} />
      </Routes>
    </div>
  );
}
