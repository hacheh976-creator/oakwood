import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function SaleReceiptScreen() {
  const navigate = useNavigate();
  const { saleId } = useParams();
  const { sales } = useApp();

  const sale = sales.find((s) => s.id === Number(saleId));
  if (!sale) {
    return (
      <div className="min-h-screen bg-white p-4">
        <p>Sale not found</p>
      </div>
    );
  }

  const paidAmount = sale.paymentType === "Discount" ? sale.amount - sale.discountAmount : sale.paidAmount;
  const remaining = sale.amount - paidAmount;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-lg font-black text-[#2C1810]">Sale Receipt</h1>
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
                Sales Receipt
              </p>
            </div>
            <div className="text-right text-xs text-black/70">
              <p>Date: {formatDate(sale.date)}</p>
              <p>Sale ID: {sale.id}</p>
            </div>
          </div>

          <div className="h-px bg-black/20" />

          {/* Customer */}
          <div>
            <h2 className="font-extrabold text-black/87 mb-1">Customer</h2>
            <p className="text-sm font-semibold text-black/70">{sale.customer}</p>
          </div>

          {/* Item */}
          <div>
            <h2 className="font-extrabold text-black/87 mb-2">Item</h2>
            <div className="space-y-2">
              <div className="flex text-xs font-bold text-black/87 pb-1 border-b border-black/10">
                <div className="flex-1">Description</div>
                <div className="w-16 text-center">Qty</div>
                <div className="w-24 text-right">Amount</div>
              </div>
              <div className="flex text-sm">
                <div className="flex-1 text-black/87">
                  {sale.product} ({sale.category})
                </div>
                <div className="w-16 text-center text-black/70">{sale.quantity}</div>
                <div className="w-24 text-right font-bold text-black/87">
                  {formatCurrency(sale.amount)}
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
                <span className="font-bold text-black/87">{formatCurrency(sale.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/70">Paid Amount</span>
                <span className="font-bold text-black/87">{formatCurrency(paidAmount)}</span>
              </div>
              {sale.paymentType === "Discount" && sale.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-black/70">Discount</span>
                  <span className="font-bold text-[#8A6B00]">
                    {sale.discountPercent.toFixed(1)}% ({formatCurrency(sale.discountAmount)})
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black/70">Payment Type</span>
                <span className="font-bold text-black/87">{sale.paymentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/70">Status</span>
                <span className="font-bold text-black/87">{sale.status}</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(sale.invoiceUrl || sale.notes) && (
            <>
              <div className="h-px bg-black/20" />
              <div>
                <h2 className="font-extrabold text-black/87 mb-2">Additional Info</h2>
                <div className="space-y-1.5 text-sm">
                  {sale.invoiceUrl && (
                    <div className="flex justify-between">
                      <span className="text-black/70">Invoice URL</span>
                      <span className="font-medium text-black/87">{sale.invoiceUrl}</span>
                    </div>
                  )}
                  {sale.notes && (
                    <div className="flex justify-between">
                      <span className="text-black/70">Notes</span>
                      <span className="font-medium text-black/87">{sale.notes}</span>
                    </div>
                  )}
                  {!sale.invoiceUrl && !sale.notes && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-black/70">Invoice URL</span>
                        <span className="font-medium text-black/87">—</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/70">Notes</span>
                        <span className="font-medium text-black/87">—</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="h-px bg-black/20" />

          {/* Footer */}
          <div className="text-xs text-black/60 space-y-2">
            <p>Thank you for shopping with OAKWOOD Furniture.</p>
            <p className="text-[10px] text-black/40">
              For printing: open this page and use your browser or device print option (Ctrl + P).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}