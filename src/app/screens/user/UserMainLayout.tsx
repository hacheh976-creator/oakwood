import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Grid3x3, Bookmark, User } from "lucide-react";

export default function UserMainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/user", label: "Home", icon: Home },
    { path: "/user/category", label: "Category", icon: Grid3x3 },
    { path: "/user/saved", label: "Saved", icon: Bookmark },
    { path: "/user/account", label: "Account", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/user") {
      return location.pathname === "/user";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F5EDE3] flex flex-col pb-16">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#EFE7DD] border-t border-[#5C3B1E]/10 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  active ? "text-[#5C3B1E]" : "text-[#5C3B1E]/60"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}