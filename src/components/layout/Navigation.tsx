
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  onNavigate?: () => void;
}

const Navigation = ({ onNavigate }: NavigationProps) => {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive =
      pathname === href ||
      (href !== "/" && pathname.startsWith(`${href}/`));

    return [
      "block rounded-lg px-3 py-2.5 font-medium transition-colors",
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    ].join(" ");
  };

  return (
    <nav aria-label="Main navigation" className="p-4">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Workspace
      </p>

      <div className="space-y-1">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          aria-current={pathname === "/dashboard" ? "page" : undefined}
          className={linkClass("/dashboard")}
        >
          Dashboard
        </Link>

        <Link
          href="/projects"
          onClick={onNavigate}
          aria-current={pathname.startsWith("/projects") ? "page" : undefined}
          className={linkClass("/projects")}
        >
          Projects
        </Link>

        <Link
          href="/tasks"
          onClick={onNavigate}
          aria-current={pathname.startsWith("/tasks") ? "page" : undefined}
          className={linkClass("/tasks")}
        >
          Tasks
        </Link>

        <Link
          href="/team"
          onClick={onNavigate}
          aria-current={pathname.startsWith("/team") ? "page" : undefined}
          className={linkClass("/team")}
        >
          Team
        </Link>

        <Link
          href="/reports"
          onClick={onNavigate}
          aria-current={pathname.startsWith("/reports") ? "page" : undefined}
          className={linkClass("/reports")}
        >
          Reports
        </Link>
      </div>

      <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        System
      </p>

      <Link
        href="/settings"
        onClick={onNavigate}
        aria-current={pathname.startsWith("/settings") ? "page" : undefined}
        className={linkClass("/settings")}
      >
        Settings
      </Link>
    </nav>
  );
};

export default Navigation;