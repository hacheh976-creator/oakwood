import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, Plus, MoreVertical } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency, formatDate, formatMonth } from "../../utils/format";

const EXPENSE_CATEGORIES = [
  "Marketing",
  "Materials",
  "Payroll",
  "Utilities",
  "Rent",
  "Maintenance",
  "Others",
];

export default function ExpensesScreen() {
  const navigate = useNavigate();
  const { expenses, addExpense, updateExpense, deleteExpense } = useApp();
  const [range, setRange] = useState<"Week" | "Month" | "Year" | "Custom">("Week");
  const [customMonth, setCustomMonth] = useState<Date | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<typeof expenses[0] | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Filter expenses by date range
  const now = new Date();
  let filteredExpenses = expenses;

  if (range === "Week") {
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredExpenses = expenses.filter((e) => {
      const expenseDate = typeof e.date === 'string' ? new Date(e.date) : e.date;
      return expenseDate >= start;
    });
  } else if (range === "Month") {
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredExpenses = expenses.filter((e) => {
      const expenseDate = typeof e.date === 'string' ? new Date(e.date) : e.date;
      return expenseDate >= start;
    });
  } else if (range === "Year") {
    const start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    filteredExpenses = expenses.filter((e) => {
      const expenseDate = typeof e.date === 'string' ? new Date(e.date) : e.date;
      return expenseDate >= start;
    });
  } else if (range === "Custom" && customMonth) {
    filteredExpenses = expenses.filter((e) => {
      const expenseDate = typeof e.date === 'string' ? new Date(e.date) : e.date;
      return expenseDate.getFullYear() === customMonth.getFullYear() && expenseDate.getMonth() === customMonth.getMonth();
    });
  }

  // Filter by category
  if (categoryFilter !== "All") {
    filteredExpenses = filteredExpenses.filter((e) => e.category === categoryFilter);
  }

  // Sort by date (newest first) - handle both Date objects and ISO strings
  filteredExpenses.sort((a, b) => {
    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
    return dateB.getTime() - dateA.getTime();
  });

  // Calculate total
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.cost, 0);

  const rangeLabel = range === "Custom" && customMonth ? formatMonth(customMonth) : range;

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-[22px] font-black text-[#2C1810]">Expenses Management</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="text-[13px] font-semibold text-black/87">
          Track and review all your expenses with simple filters.
        </p>

        {/* Total Expense Card */}
        <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4 space-y-3">
          <h2 className="font-extrabold text-black/87">Total Expense</h2>
          <p className="text-[26px] font-black text-black/87">{formatCurrency(totalExpense)}</p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[13px] font-medium text-black/70">For: {rangeLabel}</span>
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
                onClick={() => setShowMonthPicker(true)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-black/70 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Pick month
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-extrabold text-black/87">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-black/20 bg-white text-sm font-medium focus:outline-none focus:border-[#5C3B1E]"
          >
            <option value="All">All</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span className="text-xs font-bold text-black/70">{filteredExpenses.length} items</span>
        </div>

        {/* Expense History */}
        <h2 className="font-extrabold text-black/87">Expense History</h2>

        {filteredExpenses.length === 0 ? (
          <p className="text-center text-sm font-medium text-black/60 py-8">
            No expenses found for this period.
          </p>
        ) : (
          <div className="space-y-2.5">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="relative w-full bg-[#F5EFE7] rounded-[14px] border border-[#D4C4B0] p-3"
              >
                <div
                  onClick={() => setSelectedExpense(expense)}
                  className="flex gap-3 cursor-pointer"
                >
                  <div className="w-[46px] h-[46px] bg-[#EDE3D7] rounded-[10px] flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-black text-black/87 text-center leading-tight">
                      {formatDate(expense.date).substring(5)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-black/87">{expense.item}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#EDE3D7] text-black/70 rounded-md">
                        {expense.category}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#EDE3D7] text-black/87 rounded-md">
                        {expense.paymentMethod}
                      </span>
                      <span className="text-[11px] font-semibold text-black/60">Qty: {expense.quantity}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end justify-between">
                    <p className="text-base font-black text-black/87">{formatCurrency(expense.cost)}</p>
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
            ))}
          </div>
        )}
      </div>

      {/* Add Expense FAB */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-6 right-6 bg-[#6B5442] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-black"
      >
        <Plus className="w-5 h-5" />
        Add Expense
      </button>

      {/* Month Picker Modal */}
      {showMonthPicker && (
        <div onClick={() => setShowMonthPicker(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[20px] p-6 w-[90%] max-w-[320px]">
            <h2 className="text-lg font-black text-black/87 mb-4">Select Month</h2>
            <input
              type="month"
              value={customMonth ? formatDate(customMonth, "yyyy-MM") : ""}
              onChange={(e) => {
                if (e.target.value) {
                  const [year, month] = e.target.value.split("-").map(Number);
                  setCustomMonth(new Date(year, month - 1, 1));
                }
              }}
              className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowMonthPicker(false)}
                className="flex-1 px-4 py-3 rounded-[12px] font-bold text-black/70"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customMonth) {
                    setRange("Custom");
                  }
                  setShowMonthPicker(false);
                }}
                className="flex-1 px-4 py-3 rounded-[12px] bg-[#6B5442] text-white font-bold"
              >
                Set Month
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Dialog */}
      {showAddDialog && (
        <AddExpenseDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={(newExpense) => {
            addExpense(newExpense);
            setShowAddDialog(false);
          }}
        />
      )}

      {/* Expense Details Bottom Sheet */}
      {selectedExpense && (
        <ExpenseDetailsSheet
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onEdit={() => {
            setSelectedExpense(null);
            // TODO: Open edit dialog
          }}
          onDelete={() => {
            deleteExpense(selectedExpense.id);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
}

interface AddExpenseDialogProps {
  onClose: () => void;
  onAdd: (expense: any) => void;
}

function AddExpenseDialog({ onClose, onAdd }: AddExpenseDialogProps) {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSubmit = () => {
    if (!item || !category || !cost) return;

    onAdd({
      item,
      category,
      quantity: parseInt(quantity) || 1,
      cost: parseFloat(cost) || 0,
      paymentMethod,
      date: new Date(date),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-[480px] max-h-[85vh] overflow-y-auto">
        <div className="p-5 space-y-3.5">
          <h2 className="text-xl font-black text-black/87">Add Expense</h2>

          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Item"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full px-4 py-3 rounded-[12px] border border-black/20 text-left text-black/60 flex items-center justify-between"
            >
              <span>Quick select category (optional)</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-[12px] border border-black/20 shadow-lg overflow-hidden">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 text-black/87"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <label className="text-xs font-medium text-black/70 mb-1.5 block">Cost</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
              />
            </div>
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

          <div>
            <label className="text-xs font-medium text-black/70 mb-1.5 block">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-[12px] font-bold text-black/70">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-[12px] bg-[#6B5442] text-white font-bold"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExpenseDetailsSheetProps {
  expense: any;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ExpenseDetailsSheet({ expense, onClose, onEdit, onDelete }: ExpenseDetailsSheetProps) {
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-[#F5EFE7] rounded-t-[20px] w-full max-h-[85vh] overflow-y-auto">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-black/87">{expense.item}</h2>
              <p className="text-xs font-medium text-black/60 mt-1">{formatDate(expense.date)}</p>
            </div>
            <p className="text-xl font-black text-black/87">{formatCurrency(expense.cost)}</p>
          </div>

          {/* Chips */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              {expense.category}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/87 rounded-md">
              {expense.paymentMethod}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 bg-[#EDE3D7] text-black/70 rounded-md">
              Qty: {expense.quantity}
            </span>
          </div>

          <div className="h-px bg-black/10" />

          {/* Details */}
          <div>
            <h3 className="font-extrabold text-black/87 mb-2">Details</h3>
            <div className="space-y-1 text-sm">
              <DetailRow label="Item" value={expense.item} />
              <DetailRow label="Category" value={expense.category} />
              <DetailRow label="Quantity" value={expense.quantity.toString()} />
              <DetailRow label="Payment Method" value={expense.paymentMethod} />
              <DetailRow label="Date" value={formatDate(expense.date)} />
              <DetailRow label="Amount" value={formatCurrency(expense.cost)} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-black/10">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-bold text-black/87"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] font-bold text-red-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="w-32 text-black/60">{label}</span>
      <span className="font-medium text-black/87">{value}</span>
    </div>
  );
}