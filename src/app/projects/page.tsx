
"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";

type Project = {
  name: string;
  description: string;
  status: "Active" | "In Progress" | "Completed";
  progress: number;
  tasksRemaining: number;
  members: number;
  dueDate?: string;
};

const STORAGE_KEY = "devflowProjects";

const initialProjects: Project[] = [
  {
    name: "E-Commerce Platform",
    description: "Online shopping platform development.",
    status: "Active",
    progress: 72,
    tasksRemaining: 18,
    members: 8,
  },
  {
    name: "Mobile Application",
    description: "Cross-platform mobile application.",
    status: "In Progress",
    progress: 45,
    tasksRemaining: 7,
    members: 5,
  },
  {
    name: "API Development",
    description: "Backend API and service development.",
    status: "Completed",
    progress: 100,
    tasksRemaining: 0,
    members: 4,
  },
];

function isProjectArray(data: unknown): data is Project[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((project: unknown) => {
    if (
      typeof project !== "object" ||
      project === null
    ) {
      return false;
    }

    const item = project as Record<string, unknown>;

    return (
      typeof item.name === "string" &&
      item.name.trim().length > 0 &&
      typeof item.description === "string" &&
      ["Active", "In Progress", "Completed"].includes(
        item.status as string
      ) &&
      typeof item.progress === "number" &&
      Number.isFinite(item.progress) &&
      item.progress >= 0 &&
      item.progress <= 100 &&
      typeof item.tasksRemaining === "number" &&
      Number.isInteger(item.tasksRemaining) &&
      item.tasksRemaining >= 0 &&
      typeof item.members === "number" &&
      Number.isInteger(item.members) &&
      item.members >= 0 &&
      (item.dueDate === undefined ||
        typeof item.dueDate === "string")
    );
  });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

   /* eslint-disable react-hooks/set-state-in-effect */
  // Load saved projects after the page mounts in the browser.
  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(STORAGE_KEY);

      if (savedData !== null) {
        const parsedData: unknown = JSON.parse(savedData);

        if (isProjectArray(parsedData)) {
          setProjects(parsedData);
        } else {
          setProjects(initialProjects);
          setFeedback(
            "Saved project data was invalid. The sample projects have been restored."
          );
        }
      }
    } catch {
      setProjects(initialProjects);
      setFeedback(
        "Saved projects could not be read. Default projects are being used."
      );
    } finally {
      setStorageLoaded(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Save project changes, but only after the initial load has finished.
  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
      );
    } catch (error) {
      console.error("DevFlow projects could not be saved:", error);
    }
      }, [projects, storageLoaded]);

  const handleCreateProject = (project: Project) => {
    setProjects((currentProjects) => [
      ...currentProjects,
      project,
    ]);
    setIsFormOpen(false);
    setFeedback("Project created successfully.");
  };

  const handleExport = () => {
    try {
      const json = JSON.stringify(projects, null, 2);
      const blob = new Blob([json], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `devflow-projects-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setFeedback("Project backup exported successfully.");
    } catch {
      setFeedback("Export failed. Please try again.");
    }
  };

  const handleImport = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const fileContents = await file.text();
      const importedData: unknown = JSON.parse(fileContents);

      if (!isProjectArray(importedData)) {
        setFeedback(
          "Import rejected: the file does not contain a valid DevFlow project backup."
        );
        return;
      }

      if (
        !window.confirm(
          `Import ${importedData.length} project(s) and replace your current ${projects.length} project(s)? Export a backup first if you want to keep the current projects.`
        )
      ) {
        setFeedback("Import cancelled. Your projects were not changed.");
        return;
      }

      setProjects(importedData);
      setFeedback(
        `${importedData.length} project(s) imported successfully.`
      );
    } catch {
      setFeedback(
        "Import failed. Please select a valid DevFlow JSON backup file."
      );
    } finally {
      input.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your projects.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handleExport}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
          >
            Export Backup
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
          >
            Import Backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
            aria-label="Choose a DevFlow JSON backup file"
          />

          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
          >
            + New Project
          </button>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{feedback}</p>
            <button
              type="button"
              onClick={() => setFeedback("")}
              aria-label="Dismiss message"
              className="shrink-0 font-semibold text-slate-500 hover:text-slate-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {!storageLoaded ? (
        <p className="mt-8 text-sm text-slate-500">
          Loading projects...
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.name}-${index}`}
              name={project.name}
              description={project.description}
              status={project.status}
              progress={project.progress}
              tasksRemaining={project.tasksRemaining}
              members={project.members}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <ProjectForm
          onClose={() => setIsFormOpen(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
}