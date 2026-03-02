import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingBag, ArrowRight } from "lucide-react";
import oakwoodLogo from ""../assets/6d5cd73c5106dcd44ebfe7b3d0815fd92d5b5b0e.png";

export default function RoleSelectionScreen() {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState(0);

  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 5) {
      navigate("/admin-login");
      setTapCount(0);
    }

    // Reset count after 3 seconds of inactivity
    setTimeout(() => setTapCount(0), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#D4C4B0] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B6F47] rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[460px] space-y-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Logo - Tappable */}
          <button
            onClick={handleLogoTap}
            className="focus:outline-none transition-transform active:scale-95"
          >
            <img 
              src={oakwoodLogo} 
              alt="Oakwood Quality Concern" 
              className="w-64 sm:w-80 h-auto"
            />
          </button>

          {/* Subtitle */}
          <div className="text-center space-y-2">
            <p className="text-[#D4C4B0] text-base sm:text-lg font-semibold tracking-wider">
              Premium Furniture Collection
            </p>
            <p className="text-[#8B6F47] text-xs sm:text-sm font-medium">
              Crafted with excellence, designed for elegance
            </p>
          </div>
        </div>

        {/* Customer Entry Card */}
        <div className="space-y-6">
          <button
            onClick={() => navigate("/user")}
            className="group w-full bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8] rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 p-6 flex items-center gap-4 border border-[#D4C4B0]/30 hover:scale-[1.02]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#5C3B1E] to-[#3d2614] rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8 text-[#F5EFE7]" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-lg sm:text-xl font-black text-[#2C1810] mb-1">
                Browse Collection
              </h2>
              <p className="text-sm font-semibold text-[#6B5442]">
                Explore our premium furniture catalog
              </p>
            </div>
            <div className="bg-[#5C3B1E] rounded-full p-2 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-[#F5EFE7]" strokeWidth={3} />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-6 space-y-2">
          <p className="text-[10px] sm:text-[11px] font-semibold text-[#8B6F47] text-center tracking-wide">
            © 2026 OAKWOOD FURNITURE · All Rights Reserved
          </p>
          <p className="text-[9px] font-medium text-[#6B5442] text-center">
            Version 15.0.0 · Premium Edition
          </p>
        </div>
      </div>
    </div>
  );
}
