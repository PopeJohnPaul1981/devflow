
"use client";

import { useEffect, useState } from "react";

type Appearance = "Light" | "Dark" | "System";
type TaskPriority = "Low" | "Medium" | "High";

type UserSettings = {
  name: string;
  email: string;
  appearance: Appearance;
  defaultPriority: TaskPriority;
};

const SETTINGS_KEY = "devflowSettings";

const DEFAULT_SETTINGS: UserSettings = {
  name: "",
  email: "",
  appearance: "System",
  defaultPriority: "Medium",
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(SETTINGS_KEY);

        if (saved) {
          const parsed: unknown = JSON.parse(saved);

          if (parsed && typeof parsed === "object") {
            const data = parsed as Partial<UserSettings>;

            setSettings({
              name: typeof data.name === "string" ? data.name : "",
              email: typeof data.email === "string" ? data.email : "",
              appearance:
                data.appearance === "Light" ||
                data.appearance === "Dark" ||
                data.appearance === "System"
                  ? data.appearance
                  : "System",
              defaultPriority:
                data.defaultPriority === "Low" ||
                data.defaultPriority === "Medium" ||
                data.defaultPriority === "High"
                  ? data.defaultPriority
                  : "Medium",
            });
          }
        }
      } catch {
        setMessage("Could not load saved settings.");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Settings could not be saved in this browser.");
    }
  }

  function exportData() {
    try {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        settings,
        projects: JSON.parse(
          localStorage.getItem("devflowProjects") || "[]",
        ),
        tasks: JSON.parse(
          localStorage.getItem("devflowTasks") || "[]",
        ),
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "devflow-backup.json";
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Your DevFlow backup has been exported.");
    } catch {
      setMessage("Export failed. Check your saved project and task data.");
    }
  }

  function resetProjectAndTaskData() {
    const confirmed = window.confirm(
      "Are you sure? This will permanently clear your saved DevFlow projects and tasks from this browser. Export a backup first if you need one.",
    );

    if (!confirmed) return;

    try {
      localStorage.removeItem("devflowProjects");
      localStorage.removeItem("devflowTasks");
      setMessage("Project and task data have been reset.");
    } catch {
      setMessage("Could not reset the saved project and task data.");
    }
  }

  if (!loaded) {
    return (
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <p className="text-sm text-slate-500">Loading settings...</p>
      </main>
    );
  }

  const initials =
    settings.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "U";

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Manage your profile, preferences, and DevFlow data.
        </p>
      </header>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
        >
          {message}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Profile
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update the profile details stored on this device.
          </p>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <div
            aria-label={`Avatar initials: ${initials}`}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="break-words font-medium text-slate-900">
              {settings.name || "Your name"}
            </p>
            <p className="break-words text-sm text-slate-500">
              {settings.email || "Your email address"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              type="text"
              value={settings.name}
              onChange={(event) =>
                updateSetting("name", event.target.value)
              }
              placeholder="Enter your name"
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              value={settings.email}
              onChange={(event) =>
                updateSetting("email", event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose your preferred appearance for future theme integration.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Theme preference
          <select
            value={settings.appearance}
            onChange={(event) =>
              updateSetting(
                "appearance",
                event.target.value as Appearance,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 sm:max-w-sm"
          >
            <option value="System">Use system preference</option>
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </label>
        <p className="mt-2 text-xs text-slate-500">
          This saves your choice; applying the theme across every page
          will require a separate integration step.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Task preferences
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose the default priority you prefer when creating tasks.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Default task priority
          <select
            value={settings.defaultPriority}
            onChange={(event) =>
              updateSetting(
                "defaultPriority",
                event.target.value as TaskPriority,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 sm:max-w-sm"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <p className="mt-2 text-xs text-slate-500">
          This preference is saved here. The task creation form will need
          to be connected to it separately.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Data management
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Export a local backup or clear saved projects and tasks.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={exportData}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Export backup
          </button>

          <button
            type="button"
            onClick={resetProjectAndTaskData}
            className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Reset projects and tasks
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Resetting removes only the devflowProjects and devflowTasks
          entries from this browser. Export a backup before resetting.
        </p>
      </section>

      <div className="flex justify-stretch sm:justify-end">
        <button
          type="button"
          onClick={saveSettings}
          className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:w-auto"
        >
          Save settings
        </button>
      </div>
    </main>
  );
}