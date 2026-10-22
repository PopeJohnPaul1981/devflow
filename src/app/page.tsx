
import StatCard from "@/components/dashboard/StatCard";
import RecentProjects from "@/components/dashboard/RecentProjects";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Welcome back to your DevFlow workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Projects" value="12" />
        <StatCard title="Open Tasks" value="48" />
        <StatCard title="Completed" value="126" />
        <StatCard title="Team Members" value="8" />
      </div>

      <RecentProjects />
    </div>
  );
}