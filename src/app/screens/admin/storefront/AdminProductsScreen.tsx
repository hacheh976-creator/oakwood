import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Edit2, Trash2, Star } from "lucide-react";
import { useApp } from "../../../contexts/AppContext";
import { formatCurrency } from "../../../utils/format";
import type { Product } from "../../../types";

export default function AdminProductsScreen() {
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct, deleteProduct } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    image: "",
    gallery: [""],
    description: "",
    isFeatured: false,
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      category: categories[0]?.name || "",
      price: 0,
      stock: 0,
      image: "",
      gallery: [""],
      description: "",
      isFeatured: false,
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      gallery: product.gallery,
      description: product.description,
      isFeatured: product.isFeatured,
    });
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      gallery: formData.gallery.filter((url) => url.trim() !== ""),
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct({
        id: Date.now(),
        ...productData,
      });
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleGalleryChange = (index: number, value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData({ ...formData, gallery: newGallery });
  };

  const addGalleryField = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ""] });
  };

  const removeGalleryField = (index: number) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery });
  };

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/storefront")}>
            <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
          </button>
          <h1 className="text-lg sm:text-[22px] font-black text-[#2C1810]">Products</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#4A3829] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#3A2819] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="p-4 space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-12 text-black/60">
            <p className="text-sm font-semibold">No products yet. Add your first product!</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-[#F5EFE7] rounded-[18px] border border-[#D4C4B0] shadow-sm p-4"
            >
              <div className="flex gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <h3 className="text-base font-black text-black/87">{product.name}</h3>
                    {product.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-black/60 mt-1">{product.category}</p>
                  <p className="text-sm font-black text-[#4A3829] mt-1">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-xs text-black/60 mt-1">Stock: {product.stock} units</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="p-2 hover:bg-[#EDE3D7] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-[#4A3829]" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F5EFE7] rounded-[18px] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-[#2C1810] mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">
                  Product Name
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
                <label className="block text-sm font-semibold text-black/87 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-black/87 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black/87 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">
                  Main Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">
                  Gallery Images
                </label>
                {formData.gallery.map((url, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleGalleryChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                      placeholder="Image URL"
                    />
                    {formData.gallery.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGalleryField(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addGalleryField}
                  className="text-sm font-semibold text-[#4A3829] hover:underline"
                >
                  + Add Gallery Image
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  rows={3}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isFeatured" className="text-sm font-semibold text-black/87">
                  Featured Product
                </label>
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
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
