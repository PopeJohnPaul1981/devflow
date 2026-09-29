import Navigation from "./Navigation";

const Sidebar = () => {
  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r bg-white md:block">
      <Navigation />
    </aside>
  );
};

export default Sidebar;