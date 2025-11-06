import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BadMuseum from "./pages/BadMuseum.jsx";
import GoodMuseum from "./pages/GoodMuseum.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/bad" replace />} />
        <Route path="/bad" element={<BadMuseum />} />
        <Route path="/good" element={<GoodMuseum />} />
        {/* 404 */}
        <Route path="*" element={<div className="p-8">Not Found</div>} />
      </Routes>
    </div>
  );
}
