import { useNavigate } from "react-router";
import { useApp } from "../../contexts/AppContext";

export default function CategoryScreen() {
  const navigate = useNavigate();
  const { categories } = useApp();

  return (
    <div className="min-h-screen bg-[#F5EDE3] p-4">
      <h1 className="text-[22px] font-extrabold text-[#5C3B1E] mb-4">
        Categories
      </h1>
      <div className="grid grid-cols-2 gap-3.5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(`/user/category/${category.name}`)}
            className="relative aspect-[1.1] rounded-[18px] overflow-hidden group"
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-xl font-extrabold text-white">
                {category.name}
              </h2>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
