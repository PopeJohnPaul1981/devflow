
"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type TaskStatus = "To Do" | "In Progress" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

type Task = {
  id: string;
  title: string;
  description: string;
  projectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
};

type ProjectOption = {
  name: string;
};

const TASKS_STORAGE_KEY = "devflowTasks";
const PROJECTS_STORAGE_KEY = "devflowProjects";

const isTaskArray = (data: unknown): data is Task[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((item: unknown) => {
    if (typeof item !== "object" || item === null) {
      return false;
    }

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
      ["Low", "Medium", "High"].includes(
        task.priority as string
      ) &&
      typeof task.dueDate === "string"
    );
  });
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");

  // Load saved tasks and project names in the browser.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedTasks = window.localStorage.getItem(
        TASKS_STORAGE_KEY
      );

      if (savedTasks !== null) {
        const parsedTasks: unknown = JSON.parse(savedTasks);

        if (isTaskArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          setFeedback(
            "Saved task data is invalid. Please check your backup if you need to recover it."
          );
        }
      }

      const savedProjects = window.localStorage.getItem(
        PROJECTS_STORAGE_KEY
      );

      if (savedProjects !== null) {
        const parsedProjects: unknown = JSON.parse(savedProjects);

        if (Array.isArray(parsedProjects)) {
          const validProjects = parsedProjects.filter(
            (project: unknown): project is ProjectOption =>
              typeof project === "object" &&
              project !== null &&
              "name" in project &&
              typeof project.name === "string" &&
              project.name.trim().length > 0
          );

          setProjects(validProjects);
        }
      }
    } catch {
      setFeedback(
        "Some saved data could not be read. Check your browser storage."
      );
    } finally {
      setStorageLoaded(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Automatically save tasks after their initial load.
  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Could not save DevFlow tasks:", error);
    }
  }, [tasks, storageLoaded]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setProjectName("");
    setStatus("To Do");
    setPriority("Medium");
    setDueDate("");
    setEditingTaskId(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setFeedback("Please enter a task title.");
      return;
    }

    if (
      projectName &&
      !projects.some((project) => project.name === projectName)
    ) {
      setFeedback(
        "The selected project is no longer available. Please select another project."
      );
      return;
    }

    if (editingTaskId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: trimmedTitle,
                description: trimmedDescription,
                projectName,
                status,
                priority,
                dueDate,
              }
            : task
        )
      );

      setFeedback("Task updated successfully.");
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        description: trimmedDescription,
        projectName,
        status,
        priority,
        dueDate,
      };

      setTasks((currentTasks) => [...currentTasks, newTask]);
      setFeedback("Task created successfully.");
    }

    resetForm();
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setProjectName(task.projectName);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setFeedback("");
  };

  const handleDelete = (task: Task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.id !== task.id)
    );

    if (editingTaskId === task.id) {
      resetForm();
    }

    setFeedback("Task deleted successfully.");
  };

  const handleStatusChange = (
    taskId: string,
    nextStatus: TaskStatus
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: nextStatus }
          : task
      )
    );

    setFeedback("Task status updated.");
  };

  const todoCount = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Tasks
        </h1>

        <p className="mt-2 text-slate-500">
          Create, assign, and track your tasks.
        </p>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
        >
          <p>{feedback}</p>

          <button
            type="button"
            onClick={() => setFeedback("")}
            aria-label="Dismiss message"
            className="font-semibold text-slate-500 hover:text-slate-900"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">To Do</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {todoCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {inProgressCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {completedCount}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingTaskId ? "Edit Task" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Task Title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Design the login page"
              required
              maxLength={150}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what needs to be done"
              rows={3}
              maxLength={2000}
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-project"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Assign to Project
              </label>

              <select
                id="task-project"
                value={projectName}
                onChange={(event) =>
                  setProjectName(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Unassigned</option>

                {projects.map((project, index) => (
                  <option
                    key={`${project.name}-${index}`}
                    value={project.name}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              {projects.length === 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  No saved projects found. You can still create an unassigned task.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="task-due-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Due Date
              </label>

              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-status"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {editingTaskId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 sm:w-auto"
            >
              {editingTaskId ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            All Tasks
          </h2>

          <p className="text-sm text-slate-500">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>

        {!storageLoaded ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Loading tasks...
          </p>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="font-semibold text-slate-800">
              No tasks yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create your first task using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-semibold text-slate-900">
                      {task.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-600">
                      {task.description || "No description provided."}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <p>
                    <span className="font-medium text-slate-700">
                      Project:
                    </span>{" "}
                    {task.projectName || "Unassigned"}
                  </p>

                  <p>
                    <span className="font-medium text-slate-700">
                      Due date:
                    </span>{" "}
                    {task.dueDate || "Not set"}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <label
                    htmlFor={`status-${task.id}`}
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Task Status
                  </label>

                  <select
                    id={`status-${task.id}`}
                    value={task.status}
                    onChange={(event) =>
                      handleStatusChange(
                        task.id,
                        event.target.value as TaskStatus
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleEdit(task)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(task)}
                    className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TasksPage;