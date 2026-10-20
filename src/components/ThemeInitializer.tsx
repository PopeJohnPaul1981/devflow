
"use client";

import { useEffect } from "react";

type Appearance = "Light" | "Dark" | "System";

type UserSettings = {
  appearance?: Appearance;
};

const SETTINGS_KEY = "devflowSettings";

export default function ThemeInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      let appearance: Appearance = "System";

      try {
        const saved = localStorage.getItem(SETTINGS_KEY);

        if (saved) {
          const settings = JSON.parse(saved) as UserSettings;

          if (
            settings.appearance === "Light" ||
            settings.appearance === "Dark" ||
            settings.appearance === "System"
          ) {
            appearance = settings.appearance;
          }
        }
      } catch {
        appearance = "System";
      }

      const isDark =
        appearance === "Dark" ||
        (appearance === "System" && media.matches);

      document.documentElement.dataset.theme = isDark ? "dark" : "light";
    };

    updateTheme();

    media.addEventListener("change", updateTheme);
    window.addEventListener("storage", updateTheme);
    window.addEventListener("devflow-theme-change", updateTheme);

    return () => {
      media.removeEventListener("change", updateTheme);
      window.removeEventListener("storage", updateTheme);
      window.removeEventListener("devflow-theme-change", updateTheme);
    };
  }, []);

  return <>{children}</>;
}