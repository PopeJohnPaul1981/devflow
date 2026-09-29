import Link from "next/link";

interface NavigationProps {
  onNavigate?: () => void;
}

const Navigation = ({ onNavigate }: NavigationProps) => {
  return (
    <nav className="p-4">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Workspace
      </p>

      <div className="space-y-1">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="block rounded-lg bg-blue-50 px-3 py-2.5 font-medium text-blue-600"
        >
          Dashboard
        </Link>

        <Link
          href="/projects"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100"
        >
          Projects
        </Link>

        <Link
          href="/tasks"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100"
        >
          Tasks
        </Link>

        <Link
          href="/team"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100"
        >
          Team
        </Link>

        <Link
          href="/reports"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100"
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
        className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100"
      >
        Settings
      </Link>
    </nav>
  );
};

export default Navigation;