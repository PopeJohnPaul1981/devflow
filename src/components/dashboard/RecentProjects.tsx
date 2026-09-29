interface Project {
  name: string;
  tasksRemaining: number;
  status: "Active" | "In Progress" | "Completed";
}

const projects: Project[] = [
  {
    name: "E-Commerce Platform",
    tasksRemaining: 18,
    status: "Active",
  },
  {
    name: "Mobile Application",
    tasksRemaining: 7,
    status: "In Progress",
  },
  {
    name: "API Development",
    tasksRemaining: 0,
    status: "Completed",
  },
];

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Completed: "bg-blue-100 text-blue-700",
};

const RecentProjects = () => {
  return (
    <section className="mt-8 rounded-xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Projects
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your latest project activity.
        </p>
      </div>

      <div className="divide-y">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-medium text-slate-900">
                {project.name}
              </h3>

              <p className="text-sm text-slate-500">
                {project.tasksRemaining} tasks remaining
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[project.status]}`}
            >
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;