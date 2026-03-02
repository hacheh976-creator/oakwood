import { useNavigate } from "react-router";
import { Palette, LogOut } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export default function AccountScreen() {
  const navigate = useNavigate();
  const { themes, selectedTheme, setTheme } = useApp();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F5EDE3] p-4">
      <h1 className="text-xl font-black text-[#4A3829] mb-4">
        Account Settings
      </h1>

      <div className="space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-[18px]">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B89968] to-[#8B7355] flex items-center justify-center">
              <span className="text-white text-[22px] font-black">RK</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-[#4A3829]">
                Rajesh Kumar
              </h2>
              <p className="text-[13px] font-semibold text-gray-500">
                rajesh.kumar@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Theme Chooser */}
        <div className="bg-white rounded-2xl p-[18px]">
          <div className="flex items-center gap-2.5 mb-3">
            <Palette className="w-5 h-5 text-[#4A3829]" />
            <h3 className="text-base font-black text-[#4A3829]">
              Choose Theme
            </h3>
          </div>
          <div className="space-y-2.5">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => setTheme(theme.value)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${
                  selectedTheme === theme.value
                    ? "bg-[#4A3829] text-white"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className="w-[26px] h-[26px] rounded-full"
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="flex-1 text-left font-extrabold">
                  {theme.name}
                </span>
                {selectedTheme === theme.value && (
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#FFE5E5] rounded-2xl p-4 flex items-center gap-3"
        >
          <LogOut className="w-5 h-5 text-[#D32F2F]" />
          <span className="text-base font-black text-[#D32F2F]">Log Out</span>
        </button>
      </div>
    </div>
  );
}
