import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export default function AdminLoginScreen() {
  const navigate = useNavigate();
  const { setAdminLoggedIn } = useApp();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setAdminLoggedIn(true);
      navigate("/admin");
    } else {
      setError("Invalid admin password");
    }
  };

  return (
    <div className="min-h-screen bg-[#D4C4B0] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="bg-[#F5EFE7] rounded-[24px] shadow-md p-5">
          <form onSubmit={handleSubmit} className="space-y-[18px]">
            <div className="space-y-1.5">
              <h1 className="text-lg font-black text-[#2C1810]">
                Enter Admin Password
              </h1>
              <p className="text-[13px] text-[#6B5442]">
                Only authorized staff can access the management dashboard.
              </p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-[14px] border border-gray-300 focus:outline-none focus:border-[#5C3B1E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#2C1810] text-white font-black text-base py-[14px] rounded-[14px] hover:bg-[#4A3829] transition-colors"
            >
              Login
            </button>
          </form>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full text-center text-sm font-medium text-[#6B5442] hover:text-[#2C1810]"
        >
          ← Back to role selection
        </button>
      </div>
    </div>
  );
}