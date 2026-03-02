import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function OrderReceiptScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders } = useApp();

  const order = orders.find((o) => o.id === Number(id));
  if (!order) {
    return (
      <div className="min-h-screen bg-white p-4">
        <p>Order not found</p>
      </div>
    );
  }

  const remaining = order.totalAmount - order.advanceAmount;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-lg font-black text-[#2C1810]">Order Receipt</h1>
      </div>

      <div className="max-w-[600px] mx-auto p-6">
        <div className="border border-black/20 rounded-xl p-6 space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black text-black/87 tracking-tight">
                OAKWOOD FURNITURE
              </h1>
              <p className="text-sm font-semibold text-black/70 mt-0.5">
                Order Confirmation
              </p>
            </div>
            <div className="text-right text-xs text-black/70">
              <p>Order ID: {String(order.id).padStart(4, "0")}</p>
              <p>Date: {formatDate(order.orderDate)}</p>
              <p>Expected: {formatDate(order.expectedDelivery)}</p>
            </div>
          </div>

          <div className="h-px bg-black/20" />

          {/* Customer */}
          <div>
            <h2 className="font-extrabold text-black/87 mb-1">Customer</h2>
            <p className="text-sm font-semibold text-black/70">{order.customer}</p>
          </div>

          {/* Order Item */}
          <div>
            <h2 className="font-extrabold text-black/87 mb-2">Order Item</h2>
            <div className="space-y-2">
              <div className="flex text-xs font-bold text-black/87 pb-1 border-b border-black/10">
                <div className="flex-1">Description</div>
                <div className="w-16 text-center">Qty</div>
                <div className="w-24 text-right">Amount</div>
              </div>
              <div className="flex text-sm">
                <div className="flex-1 text-black/87">
                  {order.product} ({order.category})
                </div>
                <div className="w-16 text-center text-black/70">{order.quantity}</div>
                <div className="w-24 text-right font-bold text-black/87">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-black/20" />

          {/* Payment Summary */}
          <div>
            <h2 className="font-extrabold text-black/87 mb-2">Payment Summary</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-black/70">Total Amount</span>
                <span className="font-bold text-black/87">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/70">Advance Paid</span>
                <span className="font-bold text-black/87">{formatCurrency(order.advanceAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/70">Remaining Amount</span>
                <span className="font-bold text-red-600">{formatCurrency(remaining)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/70">Order Type</span>
                <span className="font-bold text-black/87">{order.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/70">Status</span>
                <span className="font-bold text-black/87">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Files & Notes */}
          <div>
            <h2 className="font-extrabold text-black/87 mb-2">Files & Notes</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-black/70">Order Image</span>
                <span className="font-medium text-black/87 text-xs break-all max-w-[60%] text-right">
                  {order.orderImage || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/70">Agreement</span>
                <span className="font-medium text-black/87">{order.agreementUrl || "—"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-black/70">Notes</span>
                <span className="font-medium text-black/87 max-w-[60%] text-right">
                  {order.notes || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-black/20" />

          {/* Footer */}
          <div className="text-xs text-black/60 space-y-2">
            <p>Thank you for your order with OAKWOOD Furniture.</p>
            <p className="text-[10px] text-black/40">
              To print this page, use your device or browser print option (Ctrl + P).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
