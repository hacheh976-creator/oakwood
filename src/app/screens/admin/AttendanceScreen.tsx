import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, Plus, ChevronLeft, ChevronRight, User, Award } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatDate } from "../../utils/format";

export default function AttendanceScreen() {
  const navigate = useNavigate();
  const { employees, attendance, updateAttendance, addEmployee } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"mark" | "history" | "performance">("mark");
  const [showAddWorkerDialog, setShowAddWorkerDialog] = useState(false);
  const [performanceFilter, setPerformanceFilter] = useState<"month" | "year" | "all">("month");

  const dateKey = formatDate(selectedDate);

  // Navigate dates
  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Calculate attendance history
  const attendanceHistory = useMemo(() => {
    const history: Array<{ date: string; employees: Array<{ id: string; name: string; status: string }> }> = [];
    const dateSet = new Set<string>();

    // Collect all unique dates
    Object.keys(attendance).forEach((key) => {
      const date = key.split("-")[0] + "-" + key.split("-")[1] + "-" + key.split("-")[2];
      dateSet.add(date);
    });

    // Sort dates (newest first)
    const sortedDates = Array.from(dateSet).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    sortedDates.forEach((date) => {
      const dayEmployees = employees.map((emp) => {
        const key = `${date}-${emp.id}`;
        const entry = attendance[key];
        return {
          id: emp.id,
          name: emp.name,
          status: entry?.status || "Not Marked",
        };
      });

      history.push({ date, employees: dayEmployees });
    });

    return history;
  }, [attendance, employees]);

  // Calculate performance statistics
  const performanceStats = useMemo(() => {
    const now = new Date();
    const stats: Array<{ id: string; name: string; present: number; absent: number; total: number; percentage: number }> = [];

    employees.forEach((emp) => {
      let present = 0;
      let absent = 0;
      let total = 0;

      Object.keys(attendance).forEach((key) => {
        const [dateStr, empId] = key.split("-").slice(0, 4).join("-").split("-" + key.split("-")[3]);
        const date = new Date(dateStr);

        // Apply filter
        if (performanceFilter === "month") {
          if (date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear()) {
            return;
          }
        } else if (performanceFilter === "year") {
          if (date.getFullYear() !== now.getFullYear()) {
            return;
          }
        }

        if (key.endsWith(emp.id)) {
          const entry = attendance[key];
          if (entry) {
            total++;
            if (entry.status === "Present") {
              present++;
            } else {
              absent++;
            }
          }
        }
      });

      if (total > 0) {
        stats.push({
          id: emp.id,
          name: emp.name,
          present,
          absent,
          total,
          percentage: (present / total) * 100,
        });
      }
    });

    // Sort by percentage (highest first)
    stats.sort((a, b) => b.percentage - a.percentage);

    return stats;
  }, [attendance, employees, performanceFilter]);

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-[22px] font-black text-[#2C1810]">Attendance Management</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="text-[13px] font-semibold text-black/87">
          Mark daily attendance, view history, and track employee performance.
        </p>

        {/* View Mode Tabs */}
        <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] p-1 flex gap-1">
          <button
            onClick={() => setViewMode("mark")}
            className={`flex-1 py-2 rounded-[12px] text-sm font-bold transition-colors ${
              viewMode === "mark" ? "bg-white text-black/87 shadow-sm" : "text-black/60"
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`flex-1 py-2 rounded-[12px] text-sm font-bold transition-colors ${
              viewMode === "history" ? "bg-white text-black/87 shadow-sm" : "text-black/60"
            }`}
          >
            History
          </button>
          <button
            onClick={() => setViewMode("performance")}
            className={`flex-1 py-2 rounded-[12px] text-sm font-bold transition-colors ${
              viewMode === "performance" ? "bg-white text-black/87 shadow-sm" : "text-black/60"
            }`}
          >
            Performance
          </button>
        </div>

        {/* Mark Attendance View */}
        {viewMode === "mark" && (
          <div className="space-y-4">
            {/* Date Selector */}
            <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-black/87">Select Date</h2>
                <button
                  onClick={goToToday}
                  className="text-xs font-bold text-[#5C3B1E] hover:underline"
                >
                  Today
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={goToPreviousDay}
                  className="p-2 rounded-lg bg-white hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5 text-black/70" />
                </button>
                <div className="flex-1 flex items-center justify-center gap-2 bg-white rounded-lg py-2 px-3">
                  <Calendar className="w-5 h-5 text-[#6B5442]" />
                  <input
                    type="date"
                    value={formatDate(selectedDate)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="font-bold text-black/87 bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  onClick={goToNextDay}
                  className="p-2 rounded-lg bg-white hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5 text-black/70" />
                </button>
              </div>
            </div>

            {/* Add Worker Button */}
            <div className="flex justify-between items-center">
              <h2 className="font-extrabold text-black/87">
                Employees ({employees.length})
              </h2>
              <button
                onClick={() => setShowAddWorkerDialog(true)}
                className="bg-[#4A3829] text-white px-4 py-2 rounded-[12px] flex items-center gap-2 font-black text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Worker
              </button>
            </div>

            {/* Employee List */}
            {employees.length === 0 ? (
              <p className="text-center text-sm font-medium text-black/60 py-8">
                No employees added yet. Click "Add Worker" to get started.
              </p>
            ) : (
              <div className="space-y-2.5">
                {employees.map((employee) => {
                  const key = `${dateKey}-${employee.id}`;
                  const entry = attendance[key];
                  const isPresent = entry?.status === "Present";
                  const isAbsent = entry?.status === "Absent";

                  return (
                    <div
                      key={employee.id}
                      className="bg-[#F5EFE7] rounded-[14px] border border-[#D4C4B0] p-3 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#EDE3D7] flex items-center justify-center flex-shrink-0">
                        <span className="font-black text-black/87 text-lg">
                          {employee.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-black/87">{employee.name}</p>
                        <p className="text-xs font-semibold text-black/60">ID: {employee.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateAttendance({
                              employeeId: employee.id,
                              date: dateKey,
                              status: "Present",
                              note: "",
                            })
                          }
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            isPresent
                              ? "bg-green-600 text-white shadow-md"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() =>
                            updateAttendance({
                              employeeId: employee.id,
                              date: dateKey,
                              status: "Absent",
                              note: "",
                            })
                          }
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            isAbsent
                              ? "bg-red-600 text-white shadow-md"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* History View */}
        {viewMode === "history" && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-black/87">Attendance History</h2>

            {attendanceHistory.length === 0 ? (
              <p className="text-center text-sm font-medium text-black/60 py-8">
                No attendance records found. Start marking attendance to see history.
              </p>
            ) : (
              <div className="space-y-3">
                {attendanceHistory.map((day) => {
                  const presentCount = day.employees.filter((e) => e.status === "Present").length;
                  const absentCount = day.employees.filter((e) => e.status === "Absent").length;
                  const notMarkedCount = day.employees.filter((e) => e.status === "Not Marked").length;

                  return (
                    <div
                      key={day.date}
                      className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-black/60" />
                          <h3 className="font-black text-black/87">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </h3>
                        </div>
                        <div className="flex gap-3 text-xs font-bold">
                          <span className="text-green-600">
                            Present: {presentCount}
                          </span>
                          <span className="text-red-600">
                            Absent: {absentCount}
                          </span>
                          {notMarkedCount > 0 && (
                            <span className="text-gray-600">
                              Not Marked: {notMarkedCount}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {day.employees.map((emp) => (
                          <div
                            key={emp.id}
                            className="flex items-center justify-between py-2 border-t border-black/5"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#EDE3D7] flex items-center justify-center">
                                <span className="font-black text-black/87 text-sm">
                                  {emp.name[0].toUpperCase()}
                                </span>
                              </div>
                              <span className="font-semibold text-black/87">{emp.name}</span>
                            </div>
                            <span
                              className={`text-xs font-black px-3 py-1 rounded-full ${
                                emp.status === "Present"
                                  ? "bg-green-100 text-green-700"
                                  : emp.status === "Absent"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {emp.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Performance View */}
        {viewMode === "performance" && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="bg-[#F5EFE7] rounded-[16px] border border-[#D4C4B0] shadow-sm p-4">
              <h2 className="font-extrabold text-black/87 mb-3">Time Period</h2>
              <div className="flex gap-2">
                {(["month", "year", "all"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPerformanceFilter(filter)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                      performanceFilter === filter
                        ? "bg-[#4A3829] text-white"
                        : "bg-white text-black/70"
                    }`}
                  >
                    {filter === "month" ? "This Month" : filter === "year" ? "This Year" : "All Time"}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <h2 className="font-extrabold text-black/87 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Top Performers
            </h2>

            {performanceStats.length === 0 ? (
              <p className="text-center text-sm font-medium text-black/60 py-8">
                No attendance data for this period.
              </p>
            ) : (
              <div className="space-y-2.5">
                {performanceStats.map((stat, index) => (
                  <div
                    key={stat.id}
                    className="bg-[#F5EFE7] rounded-[14px] border border-[#D4C4B0] p-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Badge */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0 ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : index === 1
                            ? "bg-gray-200 text-gray-700"
                            : index === 2
                            ? "bg-orange-100 text-orange-700"
                            : "bg-[#EDE3D7] text-black/70"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Name */}
                      <div className="flex-1">
                        <p className="font-black text-black/87">{stat.name}</p>
                        <p className="text-xs font-semibold text-black/60">
                          {stat.present} Present • {stat.absent} Absent
                        </p>
                      </div>

                      {/* Percentage */}
                      <div className="text-right">
                        <p className="text-2xl font-black text-black/87">
                          {stat.percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs font-semibold text-black/60">
                          {stat.total} days
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          stat.percentage >= 90
                            ? "bg-green-600"
                            : stat.percentage >= 75
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Worker Dialog */}
      {showAddWorkerDialog && (
        <AddWorkerDialog
          onClose={() => setShowAddWorkerDialog(false)}
          onAdd={(id, name) => {
            addEmployee({ id, name });
            setShowAddWorkerDialog(false);
          }}
        />
      )}
    </div>
  );
}

interface AddWorkerDialogProps {
  onClose: () => void;
  onAdd: (id: string, name: string) => void;
}

function AddWorkerDialog({ onClose, onAdd }: AddWorkerDialogProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!employeeId || !name) {
      alert("Please fill in all fields");
      return;
    }
    onAdd(employeeId, name);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-[400px]">
        <div className="p-5 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4A3829] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-black/87">Add Worker</h2>
          </div>

          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID (e.g., E006)"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
          />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Employee Name"
            className="w-full px-4 py-3 rounded-[12px] border border-black/20 focus:outline-none focus:border-[#5C3B1E]"
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
              Add Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}