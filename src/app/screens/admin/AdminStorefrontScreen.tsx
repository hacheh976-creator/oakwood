import { useNavigate } from "react-router";
import { ArrowLeft, Image, Grid3x3, Package, MessageSquare } from "lucide-react";

export default function AdminStorefrontScreen() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Home Banners",
      subtitle: "Edit advertisements and promotional banners",
      icon: <Image />,
      path: "/admin/storefront/banners",
    },
    {
      title: "Categories",
      subtitle: "Add, edit, rename or remove product categories",
      icon: <Grid3x3 />,
      path: "/admin/storefront/categories",
    },
    {
      title: "Products",
      subtitle: "Manage all products with price, stock and images",
      icon: <Package />,
      path: "/admin/storefront/products",
    },
    {
      title: "User Comments",
      subtitle: "View and manage customer reviews and feedback",
      icon: <MessageSquare />,
      path: "/admin/storefront/comments",
    },
  ];

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-lg sm:text-[22px] font-black text-[#2C1810]">Storefront Editor</h1>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-[13px] font-semibold text-black/87">
          Manage all user-facing content from the admin panel.
        </p>

        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full bg-[#F5EFE7] rounded-[18px] border border-[#D4C4B0] shadow-sm p-4 flex items-center gap-3.5 text-left hover:bg-[#EDE3D7] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#4A3829] flex items-center justify-center flex-shrink-0 text-white">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black text-black/87">{item.title}</h3>
              <p className="text-xs font-semibold text-black/60">{item.subtitle}</p>
            </div>
            <svg className="w-6 h-6 text-black/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
