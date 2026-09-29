"use client";

import { useState } from "react";
import Navigation from "./Navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              D
            </div>

            <span className="text-xl font-bold text-slate-800">
              DevFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-slate-500 hover:text-slate-800"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700">
              JP
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-b bg-white md:hidden">
          <Navigation onNavigate={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;