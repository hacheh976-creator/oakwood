import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/format";

const PRODUCT_CATEGORIES = [
  "Sofa",
  "Chair",
  "Table",
  "Bed",
  "Wardrobe",
  "Decor",
  "Materials",
];

const QUICK_CATEGORIES = [
  "Modern Sofa",
  "Classic Chair",
  "Dining Table",
  "Bed",
  "Decor",
];

export default function InventoryScreen() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);

  // Calculate statistics
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const inStockCount = products.filter((p) => p.stock > 15).length;
  const mediumStockCount = products.filter((p) => p.stock > 5 && p.stock <= 15).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Apply filters
  let filteredProducts = products;

  if (categoryFilter !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.category === categoryFilter);
  }

  if (statusFilter === "In Stock") {
    filteredProducts = filteredProducts.filter((p) => p.stock > 15);
  } else if (statusFilter === "Medium") {
    filteredProducts = filteredProducts.filter((p) => p.stock > 5 && p.stock <= 15);
  } else if (statusFilter === "Low") {
    filteredProducts = filteredProducts.filter((p) => p.stock > 0 && p.stock <= 5);
  } else if (statusFilter === "Out of Stock") {
    filteredProducts = filteredProducts.filter((p) => p.stock === 0);
  }

  // Sort by stock priority
  filteredProducts.sort((a, b) => {
    const getPriority = (p: typeof products[0]) => {
      if (p.stock === 0) return 0;
      if (p.stock <= 5) return 1;
      if (p.stock <= 15) return 2;
      return 3;
    };
    const priorityDiff = getPriority(a) - getPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      {/* Header */}
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-lg sm:text-[22px] font-black text-[#2C1810]">Stock Management</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Header Section - Mobile Optimized */}
        <div className="space-y-3">
          <div>
            <h2 className="text-[14px] font-semibold text-black/87 mb-1">
              Overview of all stock items
            </h2>
            <p className="text-[12px] font-medium text-black/70">
              Add stock, monitor low stock and out-of-stock products easily.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddDialog(true);
            }}
            className="w-full sm:w-auto bg-[#4A3829] text-white px-4 py-2.5 rounded-[12px] flex items-center justify-center gap-2 font-black text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Stock Item
          </button>
        </div>

        {/* Statistics Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            icon={<StockIcon />}
            title="Total Products"
            value={totalProducts.toString()}
            subtitle="Unique items in stock list"
            bgColor="bg-[#F5EFE7]"
            iconBgColor="bg-[#EDE3D7]"
          />
          <StatCard
            icon={<UnitsIcon />}
            title="Total Units"
            value={totalUnits.toString()}
            subtitle="Total pieces across all items"
            bgColor="bg-[#F5EFE7]"
            iconBgColor="bg-[#EDE3D7]"
          />
          <StatCard
            icon={<RupeeIcon />}
            title="Total Stock Value"
            value={formatCurrency(totalStockValue)}
            subtitle="Based on selling price"
            bgColor="bg-[#F5EFE7]"
            iconBgColor="bg-[#EDE3D7]"
          />
        </div>

        {/* Status Cards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            icon={<CheckIcon />}
            title="In Stock (Safe)"
            value={inStockCount.toString()}
            subtitle="More than 15 units"
            bgColor="bg-[#F5EFE7]"
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon={<HourglassIcon />}
            title="Medium Stock"
            value={mediumStockCount.toString()}
            subtitle="6 to 15 units"
            bgColor="bg-[#F5EFE7]"
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon={<AlertIcon />}
            title="Low Stock"
            value={lowStockCount.toString()}
            subtitle="1 to 5 units"
            bgColor="bg-[#F5EFE7]"
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        {/* Out of Stock Card - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            icon={<ErrorIcon />}
            title="Out of Stock"
            value={outOfStockCount.toString()}
            subtitle="Need to restock"
            bgColor="bg-[#F5EFE7]"
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* Filters - Responsive */}
        <div className="bg-white rounded-[16px] border border-black/20 p-4">
          <h2 className="font-extrabold text-black/87 mb-3">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
              >
                <option value="All">All</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Stock status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
              >
                <option value="All">All</option>
                <option value="In Stock">In Stock (Safe)</option>
                <option value="Medium">Medium Stock</option>
                <option value="Low">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stock Items */}
        <h2 className="font-extrabold text-black/87">
          Stock Items ({filteredProducts.length})
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-sm font-medium text-black/60 py-8">
            No products found.
          </p>
        ) : (
          <div className="space-y-2.5">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;
              const isLowStock = product.stock > 0 && product.stock <= 5;
              const totalValue = product.price * product.stock;

              return (
                <div
                  key={product.id}
                  className="bg-[#F5EFE7] rounded-[14px] border border-[#D4C4B0] p-3"
                >
                  {/* Mobile Layout */}
                  <div className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[60px] h-[60px] rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-black text-black/87 text-sm sm:text-base">{product.name}</p>
                      <p className="text-xs font-semibold text-black/60">{product.category}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {isOutOfStock ? (
                          <span className="text-[10px] font-black px-2 py-0.5 bg-red-100 text-red-700 rounded-md">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[10px] font-black px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md">
                            Low Stock
                          </span>
                        ) : null}
                        <span className="text-[11px] font-semibold text-black/60">
                          Qty: {product.stock}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end justify-between">
                      <div>
                        <p className="text-sm sm:text-base font-black text-black/87">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-black/60">
                          Value: {formatCurrency(totalValue)}
                        </p>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddDialog(true);
                          }}
                          className="p-1.5 text-black/60 hover:text-black/87"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${product.name}?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Stock Dialog */}
      {showAddDialog && (
        <AddStockDialog
          product={editingProduct}
          onClose={() => {
            setShowAddDialog(false);
            setEditingProduct(null);
          }}
          onSave={(productData) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, productData);
            } else {
              addProduct(productData);
            }
            setShowAddDialog(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  bgColor: string;
  iconBgColor: string;
  iconColor?: string;
}

function StatCard({ icon, title, value, subtitle, bgColor, iconBgColor, iconColor = "text-black/87" }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-[16px] border border-[#D4C4B0] shadow-sm p-3 sm:p-4`}>
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div className={`${iconBgColor} rounded-[12px] p-2 sm:p-2.5 ${iconColor} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-black/70 mb-0.5">{title}</p>
          <p className="text-lg sm:text-xl font-black text-black/87 leading-tight mb-0.5">{value}</p>
          <p className="text-[9px] sm:text-[10px] font-medium text-black/60">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

interface AddStockDialogProps {
  product: any;
  onClose: () => void;
  onSave: (product: any) => void;
}

function AddStockDialog({ product, onClose, onSave }: AddStockDialogProps) {
  const isEdit = !!product;
  const [productId, setProductId] = useState(product?.id.toString() || "");
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "");
  const [stock, setStock] = useState(product?.stock.toString() || "0");
  const [price, setPrice] = useState(product?.price.toString() || "0");
  const [image, setImage] = useState(product?.image || "");

  const handleSubmit = () => {
    if (!name || !category) return;

    onSave({
      id: isEdit ? product.id : parseInt(productId) || Date.now(),
      name,
      category,
      stock: parseInt(stock) || 0,
      price: parseFloat(price) || 0,
      image: image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      gallery: product?.gallery || [],
      description: product?.description || "",
      isFeatured: product?.isFeatured || false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-[600px] max-h-[85vh] overflow-y-auto">
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5">
          <h2 className="text-lg sm:text-xl font-black text-black/87">
            {isEdit ? "Edit Stock Item" : "Add Stock Item"}
          </h2>

          {!isEdit && (
            <input
              type="number"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID (number)"
              className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
            />
          )}

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (Sofa/Chair/Table/Materials/...)"
            className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <select
            value=""
            onChange={(e) => {
              if (e.target.value) setCategory(e.target.value);
            }}
            className="w-full px-4 py-2.5 sm:py-3 rounded-[12px] border border-black/20 bg-white text-xs sm:text-sm text-black/60 focus:outline-none focus:border-[#5C3B1E]"
          >
            <option value="">Quick select category (optional)</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-black/70 mb-1.5 block">
                Stock quantity (0 for out of stock)
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-black/70 mb-1.5 block">
                Selling Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-black/70 mb-1.5 block">
              Image URL (stock picture)
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1616662881884..."
              className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-1.5 rounded-lg bg-[#F5EFE7] text-xs font-semibold text-black/70 hover:bg-[#EDE3D7]"
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-[9px] sm:text-[10px] text-black/50 text-center">
            Later we can connect real image upload (camera/gallery or Firebase).
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-[12px] font-bold text-sm sm:text-base text-black/70"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-[12px] bg-[#4A3829] text-white font-bold text-sm sm:text-base"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components
function StockIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function UnitsIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
