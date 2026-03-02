import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, Plus, MoreVertical } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency, formatDate } from "../../utils/format";

// Sales Management Screen - Navigate to /admin/sales/:saleId for receipt
export default function SalesManagementScreen() {
  const navigate = useNavigate();
  const { sales, categories, addSale, updateSale, deleteSale } = useApp();
  const [range, setRange] = useState<"Week" | "Month" | "Year" | "Custom">("Week");
  const [customMonth, setCustomMonth] = useState<Date | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<typeof sales[0] | null>(null);
  const [showEditMenu, setShowEditMenu] = useState<number | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Filter sales by date range
  const now = new Date();
  let filteredSales = sales;

  if (range === "Week") {
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredSales = sales.filter((s) => {
      const saleDate = typeof s.date === 'string' ? new Date(s.date) : s.date;
      return saleDate >= start;
    });
  } else if (range === "Month") {
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredSales = sales.filter((s) => {
      const saleDate = typeof s.date === 'string' ? new Date(s.date) : s.date;
      return saleDate >= start;
    });
  } else if (range === "Year") {
    const start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    filteredSales = sales.filter((s) => {
      const saleDate = typeof s.date === 'string' ? new Date(s.date) : s.date;
      return saleDate >= start;
    });
  } else if (range === "Custom" && customMonth) {
    const start = new Date(customMonth.getFullYear(), customMonth.getMonth(), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    filteredSales = sales.filter((s) => {
      const saleDate = typeof s.date === 'string' ? new Date(s.date) : s.date;
      return saleDate >= start && saleDate <= end;
    });
  }

  // Filter by category
  if (categoryFilter !== "All") {
    filteredSales = filteredSales.filter((s) => s.category === categoryFilter);
  }

  // Filter by payment type
  if (paymentFilter !== "All") {
    if (paymentFilter === "Pending (not fully paid)") {
      filteredSales = filteredSales.filter((s) => {
        const remaining = s.paymentType === "Discount" 
          ? s.amount - (s.amount - s.discountAmount)
          : s.amount - s.paidAmount;
        return remaining > 0;
      });
    } else {
      filteredSales = filteredSales.filter((s) => s.paymentType === paymentFilter);
    }
  }

  // Calculate totals
  const totalSales = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const totalPaid = filteredSales.reduce((sum, s) => {
    if (s.paymentType === "Discount") {
      return sum + (s.amount - s.discountAmount);
    }
    return sum + s.paidAmount;
  }, 0);
  const totalRemaining = totalSales - totalPaid;

  const categoryList = [...new Set(["All", ...categories.map((c) => c.name), "Materials", "Decor"])];

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-[22px] font-black text-[#2C1810]">Sales Management</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="text-[13px] font-semibold text-black/87">
          Record sales, track payments, and tap a sale to see all details or print a receipt.
        </p>

        {/* Sales Summary Card */}
        <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4 space-y-3">
          <h2 className="font-extrabold text-black/87">Sales Summary</h2>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-black/70 mb-1">Total Sales</p>
              <p className="text-lg font-black text-black/87">{formatCurrency(totalSales)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-black/70 mb-1">Paid</p>
              <p className="text-lg font-black text-black/87">{formatCurrency(totalPaid)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-black/70 mb-1">Remaining</p>
              <p className="text-lg font-black text-red-600">{formatCurrency(totalRemaining)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[13px] font-medium text-black/70">For: {range}</span>
            <div className="flex items-center gap-2">
              {(["Week", "Month", "Year"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    range === r
                      ? "bg-white border border-black/20 text-black/87"
                      : "bg-transparent border border-transparent text-black/60"
                  }`}
                >
                  {r}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded-lg text-xs font-medium text-black/70 flex items-center gap-1.5"
                onClick={() => setShowMonthPicker(true)}
              >
                <Calendar className="w-3.5 h-3.5" />
                Pick month
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4 space-y-3">
          <h2 className="font-extrabold text-black/87">Filters</h2>
          
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
              >
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Payment</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
              >
                <option value="All">All</option>
                <option value="Full Payment">Full Payment</option>
                <option value="Advance">Advance</option>
                <option value="Installment">Installment</option>
                <option value="Discount">Discount</option>
                <option value="Pending (not fully paid)">Pending (not fully paid)</option>
              </select>
            </div>
          </div>

          <p className="text-xs font-bold text-black/70">{filteredSales.length} sales found</p>
        </div>

        {/* Sales History */}
        <h2 className="font-extrabold text-black/87">Sales History</h2>

        {filteredSales.length === 0 ? (
          <p className="text-center text-sm font-medium text-black/60 py-8">
            No sales found for this period and filters.
          </p>
        ) : (
          <div className="space-y-2.5">
            {filteredSales.map((sale) => {
              const remaining = sale.paymentType === "Discount"
                ? sale.amount - (sale.amount - sale.discountAmount)
                : sale.amount - sale.paidAmount;
              const isFullyPaid = remaining <= 0;
              const hasDiscount = sale.paymentType === "Discount" && sale.discountAmount > 0;

              return (
                <div
                  key={sale.id}
                  className="relative w-full bg-[#F5EFE7] rounded-[14px] border border-[#D4C4B0] p-3"
                >
                  <div
                    onClick={() => setSelectedSale(sale)}
                    className="flex gap-3 cursor-pointer"
                  >
                    <div className="w-[46px] h-[46px] bg-[#EDE3D7] rounded-[10px] flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-black text-black/87 text-center leading-tight">
                        {formatDate(sale.date).substring(5)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-black text-black/87">{sale.customer}</p>
                      <p className="text-xs font-semibold text-black/60 mt-0.5">{sale.product}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#EDE3D7] text-black/70 rounded-md">
                          {sale.category}
                        </span>
                        <span className="text-[11px] font-semibold text-black/60">
                          Qty: {sale.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <p className="text-base font-black text-black/87">{formatCurrency(sale.amount)}</p>
                      <p className="text-[11px] font-bold text-black/60">
                        Paid: {formatCurrency(sale.paymentType === "Discount" ? sale.amount - sale.discountAmount : sale.paidAmount)}
                      </p>
                      {hasDiscount ? (
                        <p className="text-[11px] font-bold text-[#8A6B00]">
                          Disc: {sale.discountPercent.toFixed(1)}% ({formatCurrency(sale.discountAmount)})
                        </p>
                      ) : (
                        <p className="text-[11px] font-bold text-red-600">
                          Remain: {formatCurrency(remaining)}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            sale.paymentType === "Discount"
                              ? "bg-green-100 text-green-700"
                              : isFullyPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {sale.paymentType === "Discount" ? "Discount" : isFullyPaid ? "Full Paid" : sale.paymentType}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditMenu(showEditMenu === sale.id ? null : sale.id);
                    }}
                    className="absolute top-3 right-3 p-1"
                  >
                    <MoreVertical className="w-4 h-4 text-black/60" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Sale FAB */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-6 right-6 bg-[#4A3829] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-black"
      >
        <Plus className="w-5 h-5" />
        Add Sale
      </button>

      {/* Add Sale Dialog */}
      {showAddDialog && (
        <AddSaleDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={(newSale) => {
            addSale(newSale);
            setShowAddDialog(false);
          }}
          categories={categoryList.filter((c) => c !== "All")}
        />
      )}

      {/* Sale Details Bottom Sheet */}
      {selectedSale && (
        <SaleDetailsSheet
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          onViewReceipt={() => {
            navigate(`/admin/sales/${selectedSale.id}`);
          }}
          onEdit={() => {
            // Open edit dialog
            setSelectedSale(null);
          }}
        />
      )}

      {/* Month Picker */}
      {showMonthPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[20px] w-full max-w-[480px] max-h-[85vh] overflow-y-auto">
            <div className="p-5 space-y-3.5">
              <h2 className="text-xl font-black text-black/87">Pick Month</h2>

              <input
                type="month"
                value={customMonth ? formatDate(customMonth, "yyyy-MM") : ""}
                onChange={(e) => setCustomMonth(new Date(e.target.value))}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowMonthPicker(false)}
                  className="flex-1 px-4 py-3 rounded-[12px] font-bold text-black/70"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setRange("Custom");
                    setShowMonthPicker(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-[12px] bg-[#4A3829] text-white font-bold"
                >
                  Set Month
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AddSaleDialogProps {
  onClose: () => void;
  onAdd: (sale: any) => void;
  categories: string[];
}

function AddSaleDialog({ onClose, onAdd, categories }: AddSaleDialogProps) {
  const [saleId, setSaleId] = useState("");
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [totalAmount, setTotalAmount] = useState("0");
  const [paymentType, setPaymentType] = useState("Full Payment");
  const [paidAmount, setPaidAmount] = useState("0");
  const [date, setDate] = useState(formatDate(new Date()));
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!customer || !product || !category) return;

    onAdd({
      customer,
      product,
      category,
      quantity: parseInt(quantity) || 1,
      amount: parseFloat(totalAmount) || 0,
      paidAmount: parseFloat(paidAmount) || 0,
      discountPercent: 0,
      discountAmount: 0,
      paymentType: paymentType as any,
      status: "Completed",
      invoiceUrl,
      notes,
      date: new Date(date),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-[480px] max-h-[85vh] overflow-y-auto">
        <div className="p-5 space-y-3.5">
          <h2 className="text-xl font-black text-black/87">New Sale</h2>

          <input
            type="text"
            value={saleId}
            onChange={(e) => setSaleId(e.target.value)}
            placeholder="Sale ID (ex: S006)"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer name"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Product"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Sofa/Chair/Custom...)"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <select
            value=""
            onChange={(e) => e.target.value && setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E] text-black/60"
          >
            <option value="">Quick select category (optional)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Total Amount (₹)</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-black/70 mb-1.5 block">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
            >
              <option value="Full Payment">Full Payment</option>
              <option value="Advance">Advance</option>
              <option value="Installment">Installment</option>
              <option value="Discount">Discount (price reduced)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-black/70 mb-1.5 block">Paid Amount (₹)</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
            />
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-[12px] border border-black/20 bg-gray-50">
            <Calendar className="w-4 h-4 text-black/60" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
            />
          </div>

          <input
            type="text"
            value={invoiceUrl}
            onChange={(e) => setInvoiceUrl(e.target.value)}
            placeholder="Invoice URL (image/PDF, optional)"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={3}
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E] resize-none"
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-[12px] font-bold text-black/70"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-[12px] bg-[#4A3829] text-white font-bold"
            >
              Add Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SaleDetailsSheetProps {
  sale: any;
  onClose: () => void;
  onViewReceipt: () => void;
  onEdit: () => void;
}

function SaleDetailsSheet({ sale, onClose, onViewReceipt, onEdit }: SaleDetailsSheetProps) {
  const paidAmount = sale.paymentType === "Discount" ? sale.amount - sale.discountAmount : sale.paidAmount;
  const remaining = sale.amount - paidAmount;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-[#F5EFE7] rounded-t-[20px] w-full max-h-[85vh] overflow-y-auto">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-black/87">{sale.customer}</h2>
              <p className="text-xs font-medium text-black/60 mt-1">
                Sale ID: {sale.id} • {formatDate(sale.date)}
              </p>
            </div>
            <p className="text-xl font-black text-black/87">{formatCurrency(sale.amount)}</p>
          </div>

          {/* Chips */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              {sale.paymentType}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              {sale.category}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              Qty: {sale.quantity}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              {sale.status}
            </span>
          </div>

          <div className="h-px bg-black/10" />

          {/* Product */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-1">Product</h3>
            <p className="text-sm font-semibold text-black/60">{sale.product}</p>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-2">Payment Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Total Amount</span>
                <span className="font-bold text-black/87">{formatCurrency(sale.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Paid Amount</span>
                <span className="font-bold text-black/87">{formatCurrency(paidAmount)}</span>
              </div>
              {sale.paymentType === "Discount" && sale.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-black/60">Discount</span>
                  <span className="font-bold text-[#8A6B00]">
                    {sale.discountPercent.toFixed(1)}% ({formatCurrency(sale.discountAmount)})
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black/60">Remaining</span>
                <span className="font-bold text-red-600">{formatCurrency(remaining)}</span>
              </div>
            </div>
          </div>

          {/* Extra */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-2">Extra</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Invoice URL</span>
                <span className="font-medium text-black/87">{sale.invoiceUrl || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Notes</span>
                <span className="font-medium text-black/87">{sale.notes || "—"}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-black/10">
            <button
              onClick={() => {
                console.log('Navigating to:', `/admin/sales/${sale.id}`);
                onViewReceipt();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-bold text-black/87"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              View / Print receipt
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-bold text-black/87"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit this sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}