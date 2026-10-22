
import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />

      <div className="flex flex-1">
        <div className="hidden shrink-0 md:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;