interface ProjectCardProps {
  name: string;
  description: string;
  status: "Active" | "In Progress" | "Completed";
  progress: number;
  tasksRemaining: number;
  members: number;
}

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Completed: "bg-blue-100 text-blue-700",
};

const ProjectCard = ({
  name,
  description,
  status,
  progress,
  tasksRemaining,
  members,
}: ProjectCardProps) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900">
            {name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Progress
          </span>

          <span className="font-medium text-slate-700">
            {progress}%
          </span>
        </div>

        <div className="mt-2 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {tasksRemaining} tasks remaining
        </span>

        <span className="font-medium text-slate-700">
          {members} members
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;