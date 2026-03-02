import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { useApp } from "../../../contexts/AppContext";
import type { Category } from "../../../types";

export default function AdminCategoriesScreen() {
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      imageUrl: "",
    });
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setFormData({
      name: category.name,
      imageUrl: category.imageUrl,
    });
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory({
        id: Date.now(),
        ...formData,
      });
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/storefront")}>
            <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
          </button>
          <h1 className="text-lg sm:text-[22px] font-black text-[#2C1810]">Categories</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#4A3829] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#3A2819] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-black/60">
            <p className="text-sm font-semibold">No categories yet. Add your first category!</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#F5EFE7] rounded-[18px] border border-[#D4C4B0] shadow-sm overflow-hidden"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-black text-black/87 mb-2">{category.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(category)}
                    className="flex-1 p-2 bg-[#4A3829] text-white rounded-lg hover:bg-[#3A2819] transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F5EFE7] rounded-[18px] p-6 max-w-lg w-full">
            <h2 className="text-xl font-black text-[#2C1810] mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-[#D4C4B0] rounded-lg font-semibold text-black/87 hover:bg-[#EDE3D7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#4A3829] text-white rounded-lg font-semibold hover:bg-[#3A2819] transition-colors"
                >
                  {editingCategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
