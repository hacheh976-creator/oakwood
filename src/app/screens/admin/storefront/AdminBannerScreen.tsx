import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useApp } from "../../../contexts/AppContext";
import type { HomeBanner } from "../../../types";

export default function AdminBannerScreen() {
  const navigate = useNavigate();
  const { banners, addBanner, updateBanner, deleteBanner } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    mediaUrl: "",
    ctaText: "",
    isActive: true,
  });

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      subtitle: "",
      mediaUrl: "",
      ctaText: "",
      isActive: true,
    });
    setEditingBanner(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (banner: HomeBanner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      mediaUrl: banner.mediaUrl,
      ctaText: banner.ctaText,
      isActive: banner.isActive,
    });
    setEditingBanner(banner);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
    } else {
      addBanner({
        id: Date.now(),
        ...formData,
      });
    }
    setIsAddModalOpen(false);
  };

  const handleToggleActive = (banner: HomeBanner) => {
    updateBanner(banner.id, { isActive: !banner.isActive });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/storefront")}>
            <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
          </button>
          <h1 className="text-lg sm:text-[22px] font-black text-[#2C1810]">Home Banners</h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#4A3829] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#3A2819] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      <div className="p-4 space-y-3">
        {banners.length === 0 ? (
          <div className="text-center py-12 text-black/60">
            <p className="text-sm font-semibold">No banners yet. Add your first banner!</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-[#F5EFE7] rounded-[18px] border border-[#D4C4B0] shadow-sm p-4"
            >
              <div className="flex gap-3">
                <img
                  src={banner.mediaUrl}
                  alt={banner.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-black/87">{banner.title}</h3>
                  <p className="text-xs font-semibold text-black/60 mt-1">{banner.subtitle}</p>
                  <p className="text-xs text-black/50 mt-1">CTA: {banner.ctaText}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className="flex items-center gap-1 text-xs font-semibold"
                    >
                      {banner.isActive ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-green-600" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-black/40" />
                          <span className="text-black/40">Inactive</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 hover:bg-[#EDE3D7] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-[#4A3829]" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
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
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black/87 mb-1">
                  Call-to-Action Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D4C4B0] rounded-lg bg-white"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-black/87">
                  Active (visible to users)
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
                  {editingBanner ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
