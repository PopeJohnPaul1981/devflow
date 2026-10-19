
"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type ProjectStatus = "Active" | "In Progress" | "Completed";

type Project = {
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  tasksRemaining?: number;
  members?: number;
  dueDate?: string;
};

type TaskStatus = "To Do" | "In Progress" | "Completed";

type Task = {
  id: string;
  title: string;
  description?: string;
  projectName: string;
  status: TaskStatus;
  priority?: "Low" | "Medium" | "High";
  dueDate?: string;
};

type ReportData = {
  projects: Project[];
  tasks: Task[];
  projectsInvalid: boolean;
  tasksInvalid: boolean;
};

const initialData: ReportData = {
  projects: [],
  tasks: [],
  projectsInvalid: false,
  tasksInvalid: false,
};

function readStoredArray<T>(
  key: string,
  validate: (item: unknown) => item is T
): { items: T[]; invalid: boolean } {
  try {
    const stored = localStorage.getItem(key);

    if (stored === null) {
      return { items: [], invalid: false };
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      !Array.isArray(parsed) ||
      !parsed.every(validate)
    ) {
      return { items: [], invalid: true };
    }

    return { items: parsed, invalid: false };
  } catch {
    return { items: [], invalid: true };
  }
}

function isProject(item: unknown): item is Project {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const project = item as Record<string, unknown>;

  return (
    typeof project.name === "string" &&
    typeof project.status === "string" &&
    ["Active", "In Progress", "Completed"].includes(
      project.status
    ) &&
    typeof project.progress === "number" &&
    Number.isFinite(project.progress) &&
    project.progress >= 0 &&
    project.progress <= 100
  );
}

function isTask(item: unknown): item is Task {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const task = item as Record<string, unknown>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.projectName === "string" &&
    typeof task.status === "string" &&
    ["To Do", "In Progress", "Completed"].includes(
      task.status
    )
  );
}

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const safeValue = clampPercentage(value);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">
          {label}
        </span>
        <span className="shrink-0 text-slate-500">
          {Math.round(safeValue)}%
        </span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(safeValue)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function StatusRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage =
    total === 0 ? 0 : (count / total) * 100;

  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={`h-3 w-3 shrink-0 rounded-full ${color}`}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 text-sm text-slate-600">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-900">
        {count}
      </span>
      <span className="w-12 text-right text-xs text-slate-400">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}



const TASK_CHART_COLORS = {
  completed: "#10b981",
  inProgress: "#3b82f6",
  open: "#f59e0b",
};

function TaskPieChart({
  completed,
  inProgress,
  open,
}: {
  completed: number;
  inProgress: number;
  open: number;
}) {
  const data = [
    {
      name: "Completed",
      value: completed,
      color: TASK_CHART_COLORS.completed,
    },
    {
      name: "In Progress",
      value: inProgress,
      color: TASK_CHART_COLORS.inProgress,
    },
    {
      name: "To Do",
      value: open,
      color: TASK_CHART_COLORS.open,
    },
  ];

  const total = completed + inProgress + open;

  return (
    <div className="w-full">
      {total === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center text-center">
          <div className="h-36 w-36 rounded-full border-[22px] border-slate-200" />
          <p className="mt-4 text-sm text-slate-500">
            No tasks available to display.
          </p>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.filter((item) => item.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="46%"
                innerRadius={52}
                outerRadius={92}
                paddingAngle={3}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data
                  .filter((item) => item.value > 0)
                  .map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
                formatter={(value, name) => [
                  `${value} (${Math.round(
                    (Number(value) / total) * 100
                  )}%)`,
                  name,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const ReportsPage = () => {
    const [reportData, setReportData] =
      useState<ReportData | null>(null);

    
useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    const projectsResult = readStoredArray<Project>(
      "devflowProjects",
      isProject
    );

    const tasksResult = readStoredArray<Task>(
      "devflowTasks",
      isTask
    );

    setReportData({
      projects: projectsResult.items,
      tasks: tasksResult.items,
      projectsInvalid: projectsResult.invalid,
      tasksInvalid: tasksResult.invalid,
    });
  }, 0);

  return () => window.clearTimeout(timeoutId);
}, []);

  const isLoaded = reportData !== null;

  const { projects, tasks } = reportData ?? initialData;

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) =>
      project.status === "Active" ||
      project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const averageProgress =
    totalProjects === 0
      ? 0
      : projects.reduce(
          (sum, project) =>
            sum + clampPercentage(project.progress),
          0
        ) / totalProjects;

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const openTasks = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const taskCompletionRate =
    totalTasks === 0
      ? 0
      : (completedTasks / totalTasks) * 100;

  const projectProgressGroups = [
    {
      label: "Completed",
      count: completedProjects,
      color: "bg-emerald-500",
    },
    {
      label: "Active",
      count: projects.filter(
        (project) => project.status === "Active"
      ).length,
      color: "bg-blue-500",
    },
    {
      label: "In Progress",
      count: projects.filter(
        (project) => project.status === "In Progress"
      ).length,
      color: "bg-amber-500",
    },
  ];

  if (!isLoaded) {
    return (
      <main className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Reports
        </h1>
        <p className="text-slate-500">
          Loading project and task analytics...
        </p>
      </main>
    );
  }

  return (
    <main className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Reports
        </h1>
        <p className="mt-2 text-slate-500">
          View project progress, task activity, and team performance.
        </p>
      </div>

      {(reportData.projectsInvalid ||
        reportData.tasksInvalid) && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          Some saved report data could not be read. The
          affected statistics are shown as zero until the
          underlying project or task data is corrected.
          Existing saved data has not been changed.
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Project Overview
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={totalProjects}
            description="All saved projects"
          />
          <StatCard
            title="Active Projects"
            value={activeProjects}
            description="Active or in progress"
          />
          <StatCard
            title="Completed Projects"
            value={completedProjects}
            description="Projects marked completed"
          />
          <StatCard
            title="Average Progress"
            value={`${Math.round(averageProgress)}%`}
            description="Average across all projects"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Task Overview
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            description="All saved tasks"
          />
          <StatCard
            title="Completed Tasks"
            value={completedTasks}
            description="Tasks marked completed"
          />
          <StatCard
            title="In Progress"
            value={inProgressTasks}
            description="Tasks currently underway"
          />
          <StatCard
            title="Open Tasks"
            value={openTasks}
            description="Tasks waiting to start"
          />
        </div>
      </section>


      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Task Charts
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Task Status Distribution
            </h3>
            <p className="mt-1 mb-6 text-sm text-slate-500">
              See how tasks are distributed across statuses.
            </p>

            <TaskPieChart
              completed={completedTasks}
              inProgress={inProgressTasks}
              open={openTasks}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Project Status Breakdown
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            How your projects are distributed by status.
          </p>

          <div className="mt-6 space-y-5">
            {projectProgressGroups.map((group) => (
              <ProgressBar
                key={group.label}
                label={`${group.label} (${group.count})`}
                value={
                  totalProjects === 0
                    ? 0
                    : (group.count / totalProjects) * 100
                }
                color={group.color}
              />
            ))}
          </div>

          {totalProjects === 0 && (
            <p className="mt-4 text-sm text-slate-500">
              Add a project to see the project status breakdown.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Task Status Breakdown
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A summary of tasks by their current status.
          </p>

          <div className="mt-4 divide-y divide-slate-100">
            <StatusRow
              label="Completed"
              count={completedTasks}
              total={totalTasks}
              color="bg-emerald-500"
            />
            <StatusRow
              label="In Progress"
              count={inProgressTasks}
              total={totalTasks}
              color="bg-blue-500"
            />
            <StatusRow
              label="To Do / Open"
              count={openTasks}
              total={totalTasks}
              color="bg-amber-500"
            />
          </div>

          {totalTasks === 0 && (
            <p className="mt-3 text-sm text-slate-500">
              Add a task to see the task status breakdown.
            </p>
          )}

          <div className="mt-6 border-t border-slate-100 pt-5">
            <ProgressBar
              label="Overall Task Completion"
              value={taskCompletionRate}
              color="bg-emerald-500"
            />
            <p className="mt-2 text-sm text-slate-500">
              {completedTasks} of {totalTasks} tasks completed.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Individual Project Progress
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Progress percentages for your saved projects.
        </p>

        {totalProjects === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No projects are available to report yet.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <ProgressBar
                key={`${project.name}-${index}`}
                label={project.name}
                value={project.progress}
                color={
                  project.status === "Completed"
                    ? "bg-emerald-500"
                    : project.status === "In Progress"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                }
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ReportsPage;