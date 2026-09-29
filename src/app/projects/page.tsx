"use client";

import { useState } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";

const projects = [
  {
    name: "E-Commerce Platform",
    description: "Online shopping platform development.",
    status: "Active" as const,
    progress: 72,
    tasksRemaining: 18,
    members: 8,
  },
  {
    name: "Mobile Application",
    description: "Cross-platform mobile application.",
    status: "In Progress" as const,
    progress: 45,
    tasksRemaining: 7,
    members: 5,
  },
  {
    name: "API Development",
    description: "Backend API and service development.",
    status: "Completed" as const,
    progress: 100,
    tasksRemaining: 0,
    members: 4,
  },
];

const ProjectsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
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

        <button
        type="button"
        onClick={() => setIsFormOpen(true)}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
        + New Project
        </button>
        </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            name={project.name}
            description={project.description}
            status={project.status}
            progress={project.progress}
            tasksRemaining={project.tasksRemaining}
            members={project.members}
          />
        ))}
      </div>
        {isFormOpen && (
    <ProjectForm onClose={() => setIsFormOpen(false)} />
    )}
    </div>
  );
};

export default ProjectsPage;