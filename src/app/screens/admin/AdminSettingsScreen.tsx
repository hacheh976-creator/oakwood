import { useNavigate } from "react-router";
import { ArrowLeft, LogOut } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export default function AdminSettingsScreen() {
  const navigate = useNavigate();
  const { themes, selectedTheme, setTheme, setAdminLoggedIn } = useApp();

  const handleLogout = () => {
    setAdminLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-lg font-black text-[#2C1810]">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile */}
        <div className="bg-[#F5EFE7] rounded-2xl border border-[#D4C4B0] p-[18px]">
          <h2 className="text-lg font-black text-[#2C1810] mb-3">Profile</h2>
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#D4C4B0] flex items-center justify-center">
              <span className="text-[22px] font-black text-[#2C1810]">AD</span>
            </div>
            <div>
              <p className="font-black text-[#2C1810]">Admin User</p>
              <p className="text-sm text-[#6B5442]">admin@store.com</p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-[#F5EFE7] rounded-2xl border border-[#D4C4B0] p-[18px]">
          <h2 className="text-lg font-black text-[#2C1810] mb-3">Appearance</h2>
          <div className="space-y-2.5">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => setTheme(theme.value)}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                  selectedTheme === theme.value
                    ? "bg-[#6B5442] border-[#6B5442] text-white"
                    : "bg-white border-black/12"
                }`}
              >
                <div
                  className="w-[34px] h-[34px] rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="flex-1 text-left font-black">{theme.name}</span>
                {selectedTheme === theme.value && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="bg-[#F5EFE7] rounded-2xl border border-[#D4C4B0] p-[18px]">
          <h2 className="text-lg font-black text-[#2C1810] mb-2">
            About OAKWOOD
          </h2>
          <p className="text-sm leading-relaxed text-black/80 mb-3">
            OAKWOOD is a premium furniture store offering handcrafted, luxury
            pieces for modern homes.
          </p>
          <p className="text-xs text-[#6B5442]">Version 1.0.0 • © 2026 OAKWOOD</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#FFE5E5] rounded-2xl p-4 flex items-center gap-3"
        >
          <LogOut className="w-5 h-5 text-[#D32F2F]" />
          <span className="text-base font-black text-[#D32F2F]">Logout</span>
        </button>
      </div>
    </div>
  );
}
