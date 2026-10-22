
"use client";

import { useState } from "react";
import Navigation from "./Navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
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
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700"
              aria-label="User profile"
            >
              JP
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto border-r border-slate-200 bg-white shadow-lg md:hidden"
        >
          <Navigation onNavigate={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;