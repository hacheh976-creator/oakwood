import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Heart, ShoppingBag } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/format";
import PWAInstallPrompt from "../../components/PWAInstallPrompt";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { products, categories, banners, savedProductIds, toggleSaved } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products.filter((p) => p.isFeatured)
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F5EDE3]">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black tracking-[1.5px] text-[#5C3B1E]">
            OAKWOOD
          </h1>
          <div className="w-9 h-9 rounded-full bg-[#5C3B1E] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Banner Carousel */}
        <div className="relative h-[190px] overflow-hidden">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {banners
              .filter((b) => b.isActive)
              .map((banner) => (
                <div
                  key={banner.id}
                  className="relative min-w-[95%] h-[190px] rounded-[18px] overflow-hidden snap-start flex-shrink-0"
                >
                  <img
                    src={banner.mediaUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/65 to-transparent" />
                  <div className="absolute inset-0 p-[18px] flex flex-col">
                    <h2 className="text-[22px] font-extrabold text-white">
                      {banner.title}
                    </h2>
                    <p className="text-[13px] text-white/70 mt-1.5 flex-1">
                      {banner.subtitle}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-4 py-2.5 bg-[#5C3B1E] text-white font-semibold rounded-[24px] text-sm">
                        {banner.ctaText}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-[24px] whitespace-nowrap font-semibold text-sm transition-colors ${
              selectedCategory === "All"
                ? "bg-[#5C3B1E] text-white"
                : "bg-white text-[#5C3B1E] shadow-sm"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-[24px] whitespace-nowrap font-semibold text-sm transition-colors ${
                selectedCategory === cat.name
                  ? "bg-[#5C3B1E] text-white"
                  : "bg-white text-[#5C3B1E] shadow-sm"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3.5 pb-4">
          {filteredProducts.map((product) => {
            const isSaved = savedProductIds.includes(product.id);
            const isLowStock = product.stock < 10;

            return (
              <div
                key={product.id}
                className="bg-white rounded-[18px] shadow-sm overflow-hidden"
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(`/user/product/${product.id}`)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                  >
                    <Heart
                      className={`w-[18px] h-[18px] ${
                        isSaved ? "fill-[#5C3B1E] text-[#5C3B1E]" : "text-[#5C3B1E]"
                      }`}
                    />
                  </button>
                  {isLowStock && (
                    <div className="absolute left-2 bottom-2 px-2 py-1 bg-[#5C3B1E]/90 rounded-xl">
                      <span className="text-white text-[11px] font-semibold">
                        Low Stock
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className="p-2.5 space-y-1 cursor-pointer"
                  onClick={() => navigate(`/user/product/${product.id}`)}
                >
                  <h3 className="text-sm font-semibold text-[#5C3B1E] line-clamp-2 text-left">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-[#5C3B1E] text-left">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div
                  className="px-2.5 pb-2.5 flex justify-end cursor-pointer"
                  onClick={() => navigate(`/user/product/${product.id}`)}
                >
                  <div className="w-[34px] h-[34px] rounded-full bg-[#5C3B1E] flex items-center justify-center">
                    <ShoppingBag className="w-[18px] h-[18px] text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}