import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency } from "../../utils/format";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BusinessReportScreen() {
  const navigate = useNavigate();
  const { sales, expenses } = useApp();

  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
  const profit = totalSales - totalExpenses;

  const salesData = sales.slice(0, 7).map((s, i) => ({
    name: `Day ${i + 1}`,
    value: s.amount,
  }));

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-[22px] font-black text-[#2C1810]">
          Business Report
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-3 overflow-x-auto">
          <div className="min-w-[220px] bg-[#F5EFE7] rounded-2xl border border-[#D4C4B0] p-3.5">
            <p className="text-sm font-extrabold text-[#8B6F47] mb-2">
              Total Sales
            </p>
            <p className="text-lg font-black text-[#2C1810]">
              {formatCurrency(totalSales)}
            </p>
          </div>
          <div className="min-w-[220px] bg-[#F5EFE7] rounded-2xl border border-[#D4C4B0] p-3.5">
            <p className="text-sm font-extrabold text-[#8B6F47] mb-2">
              Total Expenses
            </p>
            <p className="text-lg font-black text-[#2C1810]">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="min-w-[220px] bg-[#F5EFE7] rounded-2xl border border-[#D4C4B0] p-3.5">
            <p className="text-sm font-extrabold text-[#8B6F47] mb-2">Profit</p>
            <p className="text-lg font-black text-[#2C1810]">
              {formatCurrency(profit)}
            </p>
          </div>
        </div>

        <div className="bg-[#F5EFE7] rounded-2xl border border-[#D4C4B0] p-4">
          <h2 className="font-black text-[#4A3829] mb-3">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD3" />
              <XAxis dataKey="name" stroke="#6B5442" />
              <YAxis stroke="#6B5442" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5C3B1E"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
