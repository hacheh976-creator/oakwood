import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/format";

export default function CategoryProductsScreen() {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { products } = useApp();

  const categoryProducts = products.filter((p) => p.category === categoryName);

  return (
    <div className="min-h-screen bg-[#F5EDE3]">
      <div className="bg-[#5C3B1E] p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white">{categoryName}</h1>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3.5">
        {categoryProducts.map((product) => {
          const isLowStock = product.stock < 10;
          return (
            <button
              key={product.id}
              onClick={() => navigate(`/user/product/${product.id}`)}
              className="bg-white rounded-[18px] shadow-sm overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {isLowStock && (
                  <div className="absolute left-2 bottom-2 px-2 py-1 bg-[#5C3B1E]/90 rounded-xl">
                    <span className="text-white text-[11px] font-semibold">
                      Low Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2.5 space-y-1">
                <h3 className="text-sm font-semibold text-[#5C3B1E] line-clamp-2 text-left">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-[#5C3B1E] text-left">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
