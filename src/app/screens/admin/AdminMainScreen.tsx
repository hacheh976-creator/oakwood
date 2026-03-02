import { useNavigate } from "react-router";
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  Store,
  Settings,
} from "lucide-react";

interface AdminTileProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function AdminTile({ title, subtitle, icon, onClick }: AdminTileProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#F5EFE7] rounded-[18px] shadow-sm hover:shadow-md transition-all p-3.5 flex flex-col items-start h-full group"
    >
      <div className="w-[46px] h-[46px] rounded-[14px] bg-[#4A3A2A]/10 flex items-center justify-center mb-3">
        <div className="text-[#4A3A2A] [&>svg]:w-6 [&>svg]:h-6">{icon}</div>
      </div>
      <h3 className="text-base font-black text-[#4A3A2A] mb-1.5">{title}</h3>
      <p className="text-xs font-semibold text-[#4A3A2A]/75 mb-auto">{subtitle}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-sm font-black text-[#4A3A2A]">Open</span>
        <svg className="w-[18px] h-[18px] text-[#4A3A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default function AdminMainScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <header className="bg-[#F5EFE7] border-b border-black/5">
        <div className="px-4 py-4">
          <h1 className="text-center text-xl font-black text-[#4A3A2A]">
            Admin Panel
          </h1>
        </div>
      </header>

      <main className="p-3.5">
        <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto">
          <AdminTile
            title="Business Report"
            subtitle="Summary & Stats"
            icon={<BarChart3 />}
            onClick={() => navigate("/admin/business-report")}
          />
          <AdminTile
            title="Sales"
            subtitle="Orders & Bills"
            icon={<TrendingUp />}
            onClick={() => navigate("/admin/sales")}
          />
          <AdminTile
            title="Order Management"
            subtitle="Customer Orders & Agreements"
            icon={<ShoppingCart />}
            onClick={() => navigate("/admin/orders")}
          />
          <AdminTile
            title="Inventory"
            subtitle="Products & Stock"
            icon={<Package />}
            onClick={() => navigate("/admin/inventory")}
          />
          <AdminTile
            title="Expenses"
            subtitle="Costs & Payments"
            icon={<Receipt />}
            onClick={() => navigate("/admin/expenses")}
          />
          <AdminTile
            title="Attendance"
            subtitle="Staff Records"
            icon={<Users />}
            onClick={() => navigate("/admin/attendance")}
          />
          <AdminTile
            title="Storefront"
            subtitle="Edit User App UI"
            icon={<Store />}
            onClick={() => navigate("/admin/storefront")}
          />
          <AdminTile
            title="Settings"
            subtitle="Theme / Logout"
            icon={<Settings />}
            onClick={() => navigate("/admin/settings")}
          />
        </div>
      </main>
    </div>
  );
}
