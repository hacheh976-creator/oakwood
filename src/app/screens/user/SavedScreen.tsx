import { useNavigate } from "react-router";
import { Heart, Trash2 } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/format";

export default function SavedScreen() {
  const navigate = useNavigate();
  const { products, savedProductIds, toggleSaved } = useApp();

  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  if (savedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EDE3] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#4A3829] mb-2">
              No Saved Items
            </h2>
            <p className="text-gray-600">Items you save will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EDE3]">
      <div className="p-4">
        <h1 className="text-xl font-black text-[#4A3829] mb-4">Saved</h1>
        <div className="space-y-3">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#F0EAE4] shadow-sm p-3 flex gap-3"
            >
              <button
                onClick={() => navigate(`/user/product/${product.id}`)}
                className="w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base text-[#2C1810] mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-[#8B6F47] mb-2">
                  {product.category}
                </p>
                <p className="text-base font-black text-[#4A3829]">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <button
                onClick={() => toggleSaved(product.id)}
                className="self-start p-2"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
