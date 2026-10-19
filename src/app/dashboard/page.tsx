
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ProjectStatus = "Active" | "In Progress" | "Completed";
type TaskStatus = "To Do" | "In Progress" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

type Project = {
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  tasksRemaining: number;
  members: number;
  dueDate?: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  projectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};

const PROJECTS_STORAGE_KEY = "devflowProjects";
const TASKS_STORAGE_KEY = "devflowTasks";

function isProjectArray(data: unknown): data is Project[] {
  if (!Array.isArray(data)) return false;

  return data.every((item: unknown) => {
    if (typeof item !== "object" || item === null) return false;

    const project = item as Record<string, unknown>;

    return (
      typeof project.name === "string" &&
      project.name.trim().length > 0 &&
      typeof project.description === "string" &&
      ["Active", "In Progress", "Completed"].includes(
        project.status as string
      ) &&
      typeof project.progress === "number" &&
      Number.isFinite(project.progress) &&
      project.progress >= 0 &&
      project.progress <= 100 &&
      typeof project.tasksRemaining === "number" &&
      Number.isInteger(project.tasksRemaining) &&
      project.tasksRemaining >= 0 &&
      typeof project.members === "number" &&
      Number.isInteger(project.members) &&
      project.members >= 0 &&
      (project.dueDate === undefined ||
        typeof project.dueDate === "string")
    );
  });
}

function isTaskArray(data: unknown): data is Task[] {
  if (!Array.isArray(data)) return false;

  return data.every((item: unknown) => {
    if (typeof item !== "object" || item === null) return false;

    const task = item as Record<string, unknown>;

    return (
      typeof task.id === "string" &&
      task.id.length > 0 &&
      typeof task.title === "string" &&
      task.title.trim().length > 0 &&
      typeof task.description === "string" &&
      typeof task.projectName === "string" &&
      ["To Do", "In Progress", "Completed"].includes(
        task.status as string
      ) &&
      ["Low", "Medium", "High"].includes(task.priority as string) &&
      typeof task.dueDate === "string"
    );
  });
}

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [storageWarning, setStorageWarning] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedProjects = window.localStorage.getItem(
        PROJECTS_STORAGE_KEY
      );
      const savedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);

      let warning = "";

      if (savedProjects !== null) {
        const parsedProjects: unknown = JSON.parse(savedProjects);

        if (isProjectArray(parsedProjects)) {
          setProjects(parsedProjects);
        } else {
          warning = "Saved project data is invalid and was not counted.";
        }
      }

      if (savedTasks !== null) {
        const parsedTasks: unknown = JSON.parse(savedTasks);

        if (isTaskArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          warning = warning
            ? "Saved project or task data is invalid and was not counted."
            : "Saved task data is invalid and was not counted.";
        }
      }

      setStorageWarning(warning);
    } catch {
      setStorageWarning(
        "Some saved data could not be read. Check your browser storage."
      );
    } finally {
      setStorageLoaded(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) =>
      project.status === "Active" || project.status === "In Progress"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const openTasks = totalTasks - completedTasks;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const recentProjects = [...projects].slice(-3).reverse();

  const statistics = [
    {
      label: "Total Projects",
      value: totalProjects,
      description: `${completedProjects} completed`,
      icon: "📁",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      description: "Active or in progress",
      icon: "🚀",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      description: `${inProgressTasks} in progress`,
      icon: "📋",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      description: `${openTasks} open tasks remaining`,
      icon: "✅",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Welcome to your DevFlow workspace.
        </p>
      </div>

      {storageWarning && (
        <div
          role="status"
          className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
        >
          {storageWarning}
        </div>
      )}

      <section aria-label="Workspace statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((statistic) => (
            <article
              key={statistic.label}
              className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  {statistic.label}
                </p>
                <span aria-hidden="true" className="text-xl">
                  {statistic.icon}
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {storageLoaded ? statistic.value : "—"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {storageLoaded ? statistic.description : "Loading data..."}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Projects
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest saved projects.
            </p>
          </div>

          <Link
            href="/projects"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all projects →
          </Link>
        </div>

        {!storageLoaded ? (
          <p className="mt-5 text-sm text-slate-500">
            Loading projects...
          </p>
        ) : recentProjects.length === 0 ? (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center">
            <p className="font-medium text-slate-800">
              No projects yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Create a project to see it on your dashboard.
            </p>
            <Link
              href="/projects"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-slate-100">
            {recentProjects.map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="break-words font-medium text-slate-900">
                    {project.name}
                  </h3>
                  <p className="mt-1 break-words text-sm text-slate-500">
                    {project.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      project.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/projects"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Manage Projects</h2>
          <p className="mt-2 text-sm text-slate-500">
            Create projects, review progress, and manage backups.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
            Open Projects →
          </span>
        </Link>

        <Link
          href="/tasks"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <h2 className="font-semibold text-slate-900">Manage Tasks</h2>
          <p className="mt-2 text-sm text-slate-500">
            Track task status, priority, project assignment, and due dates.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
            Open Tasks →
          </span>
        </Link>
      </section>
    </div>
  );
};

export default DashboardPage;