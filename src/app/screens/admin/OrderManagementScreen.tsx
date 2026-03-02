import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, MoreVertical } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function OrderManagementScreen() {
  const navigate = useNavigate();
  const { orders, addOrder, updateOrder, deleteOrder } = useApp();
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All time");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Apply filters
  let filteredOrders = orders;

  if (statusFilter !== "All") {
    filteredOrders = filteredOrders.filter((o) => o.status === statusFilter);
  }

  if (typeFilter !== "All") {
    filteredOrders = filteredOrders.filter((o) => o.orderType === typeFilter);
  }

  // Sort by date (newest first) - handle both Date objects and ISO strings
  filteredOrders.sort((a, b) => {
    const dateA = typeof a.orderDate === 'string' ? new Date(a.orderDate) : a.orderDate;
    const dateB = typeof b.orderDate === 'string' ? new Date(b.orderDate) : b.orderDate;
    return dateB.getTime() - dateA.getTime();
  });

  // Calculate summary
  const totalOrders = filteredOrders.length;
  const totalOrderValue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const remainingAmount = filteredOrders.reduce((sum, o) => sum + (o.totalAmount - o.advanceAmount), 0);

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-[22px] font-black text-[#2C1810]">Order Management</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="text-[13px] font-semibold text-black/87">
          Create new product orders, attach agreement and reference image, and tap an order to see details or print.
        </p>

        {/* Order Summary Card */}
        <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4">
          <h2 className="font-extrabold text-black/87 mb-3">Order Summary</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-black/70 mb-1">Total Orders</p>
              <p className="text-lg font-black text-black/87">{totalOrders}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-black/70 mb-1">Total Order Value</p>
              <p className="text-lg font-black text-black/87">{formatCurrency(totalOrderValue)}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-black/70 mb-1">Remaining Amount</p>
              <p className="text-lg font-black text-red-600">{formatCurrency(remainingAmount)}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4 space-y-3">
          <h2 className="font-extrabold text-black/87">Filters</h2>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Order Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
              >
                <option value="All">All</option>
                <option value="Standard">Standard</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
            >
              <option value="All time">All time</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
            <p className="text-xs font-bold text-black/70">{filteredOrders.length} orders</p>
          </div>
        </div>

        {/* Orders */}
        <h2 className="font-extrabold text-black/87">Orders</h2>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-sm font-medium text-black/60 py-8">No orders found.</p>
        ) : (
          <div className="space-y-2.5">
            {filteredOrders.map((order) => {
              const remaining = order.totalAmount - order.advanceAmount;

              return (
                <div
                  key={order.id}
                  className="relative w-full bg-[#F5EFE7] rounded-[14px] border border-[#D4C4B0] p-3"
                >
                  <div 
                    onClick={() => setSelectedOrder(order)}
                    className="flex gap-3 cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {order.orderImage ? (
                        <img
                          src={order.orderImage}
                          alt={order.product}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#EDE3D7]" />
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-black/87">{order.customer}</p>
                      <p className="text-xs font-semibold text-black/60 mt-0.5">{order.product}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-black/60">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#EDE3D7] text-black/70 rounded-md">
                          {order.orderType}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#EDE3D7] text-black/70 rounded-md">
                          {order.category}
                        </span>
                        <span>Qty: {order.quantity}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-black/60 mt-1">
                        Order: {formatDate(order.orderDate)} • Delivery: {formatDate(order.expectedDelivery)}
                      </p>
                    </div>

                    {/* Price & Status */}
                    <div className="text-right flex flex-col items-end justify-between">
                      <p className="text-base font-black text-black/87">{formatCurrency(order.totalAmount)}</p>
                      <div className="text-[11px] font-bold text-right">
                        <p className="text-black/60">Advance: {formatCurrency(order.advanceAmount)}</p>
                        <p className="text-red-600">Remain: {formatCurrency(remaining)}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Ready"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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

      {/* New Order FAB */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-6 right-6 bg-[#4A3829] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-black"
      >
        <Plus className="w-5 h-5" />
        New Order
      </button>

      {/* Order Details Bottom Sheet */}
      {selectedOrder && (
        <OrderDetailsSheet
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onViewReceipt={() => {
            navigate(`/admin/orders/${selectedOrder.id}`);
          }}
          onEdit={() => {
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Add Order Dialog */}
      {showAddDialog && (
        <AddOrderDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={(newOrder) => {
            addOrder(newOrder);
            setShowAddDialog(false);
          }}
        />
      )}
    </div>
  );
}

interface OrderDetailsSheetProps {
  order: any;
  onClose: () => void;
  onViewReceipt: () => void;
  onEdit: () => void;
}

function OrderDetailsSheet({ order, onClose, onViewReceipt, onEdit }: OrderDetailsSheetProps) {
  const remaining = order.totalAmount - order.advanceAmount;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-[#F5EFE7] rounded-t-[20px] w-full max-h-[85vh] overflow-y-auto">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-black/87">{order.customer}</h2>
              <p className="text-xs font-medium text-black/60 mt-1">
                Order ID: {String(order.id).padStart(4, "0")} • {formatDate(order.orderDate)}
              </p>
              <p className="text-xs font-medium text-black/60">
                Expected delivery: {formatDate(order.expectedDelivery)}
              </p>
            </div>
            <p className="text-xl font-black text-black/87">{formatCurrency(order.totalAmount)}</p>
          </div>

          {/* Chips */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              {order.orderType}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              {order.category}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              Qty: {order.quantity}
            </span>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-md ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="h-px bg-black/10" />

          {/* Product */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-1">Product</h3>
            <p className="text-sm font-semibold text-black/60">{order.product}</p>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-2">Payment</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Total Amount</span>
                <span className="font-bold text-black/87">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Advance Paid</span>
                <span className="font-bold text-black/87">{formatCurrency(order.advanceAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Remaining</span>
                <span className="font-bold text-red-600">{formatCurrency(remaining)}</span>
              </div>
            </div>
          </div>

          {/* Files */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-2">Files</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Order Image</span>
                <span className="font-medium text-black/87 text-xs break-all">
                  {order.orderImage || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Agreement</span>
                <span className="font-medium text-black/87">{order.agreementUrl || "—"}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-1">Notes</h3>
            <p className="text-sm font-medium text-black/60">{order.notes || "—"}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-black/10">
            <button
              onClick={onViewReceipt}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-bold text-black/87"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              View / Print order
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-bold text-black/87"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddOrderDialogProps {
  onClose: () => void;
  onAdd: (order: any) => void;
}

function AddOrderDialog({ onClose, onAdd }: AddOrderDialogProps) {
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [orderType, setOrderType] = useState("Standard");
  const [quantity, setQuantity] = useState("1");
  const [totalAmount, setTotalAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [orderDate, setOrderDate] = useState(formatDate(new Date()));
  const [expectedDelivery, setExpectedDelivery] = useState(formatDate(new Date()));
  const [orderImage, setOrderImage] = useState("");
  const [agreementUrl, setAgreementUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("New");

  const handleSubmit = () => {
    if (!customer || !product) return;

    onAdd({
      customer,
      product,
      category: category || "Furniture",
      orderType: orderType as any,
      quantity: parseInt(quantity) || 1,
      totalAmount: parseFloat(totalAmount) || 0,
      advanceAmount: parseFloat(advanceAmount) || 0,
      status: status as any,
      orderDate: new Date(orderDate),
      expectedDelivery: new Date(expectedDelivery),
      orderImage,
      agreementUrl,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-[500px] max-h-[85vh] overflow-y-auto">
        <div className="p-5 space-y-3.5">
          <h2 className="text-xl font-black text-black/87">New Order</h2>

          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer Name"
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
            placeholder="Category (e.g., Custom Sofa, Dining)"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              >
                <option value="Standard">Standard</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Total Amount (₹)</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Advance (₹)</label>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Order Date</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Expected Delivery</label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-black/70 mb-1.5 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <input
            type="text"
            value={orderImage}
            onChange={(e) => setOrderImage(e.target.value)}
            placeholder="Order Image URL (optional)"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <input
            type="text"
            value={agreementUrl}
            onChange={(e) => setAgreementUrl(e.target.value)}
            placeholder="Agreement URL (optional)"
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
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-[12px] font-bold text-black/70">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-[12px] bg-[#4A3829] text-white font-bold"
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}