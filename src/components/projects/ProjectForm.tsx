
"use client";

import { FormEvent, useState } from "react";

type Project = {
  name: string;
  description: string;
  status: "Active" | "In Progress" | "Completed";
  progress: number;
  tasksRemaining: number;
  members: number;
  dueDate?: string;
};

interface ProjectFormProps {
  onClose: () => void;
  onCreate: (project: Project) => void;
}

const ProjectForm = ({ onClose, onCreate }: ProjectFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "Active" | "In Progress" | "Completed"
  >("Active");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProject: Project = {
      name: name.trim(),
      description: description.trim(),
      status,
      progress: 0,
      tasksRemaining: 0,
      members: Number(members) || 0,
      dueDate,
    };

    onCreate(newProject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create New Project
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a new project to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div>
            <label
              htmlFor="project-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter project name"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the project"
              rows={3}
              required
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="project-status"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <select
                id="project-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "Active"
                      | "In Progress"
                      | "Completed"
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="project-due-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Due Date
              </label>
              <input
                id="project-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="project-members"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Team Members
            </label>
            <input
              id="project-members"
              type="number"
              min="0"
              step="1"
              value={members}
              onChange={(event) => setMembers(event.target.value)}
              placeholder="Number of team members"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 sm:w-auto"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;