import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";

// API client
const api = axios.create({
  baseURL: "https://localhost:7011/api/employee", // change port if needed
  // withCredentials: true, // only if you use cookies/auth
});

// Real API calls
const getEmployees = async (filters = {}) => {
  const response = await api.get("/GetEmployeeList", {
    params: {
      id: filters.id,
      name: filters.name,
      department: filters.department,
      salary: filters.salary,
    },
  });
  return response.data || [];
};

const addEmployee = async (employee) => {
  await api.post("/AddEmployee", employee);
};

const updateEmployee = async (employee) => {
  await api.put("/UpdateEmployee", employee);
};

const deleteEmployee = async (id) => {
  await api.delete("/DeleteEmployee", {
    data: { id },
  });
};

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}>
      {type === "success" && <Check className="w-5 h-5" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Employee Form Dialog
function EmployeeFormDialog({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id ?? 0,
        name: initialData.name ?? "",
        department: initialData.department ?? "",
        salary: initialData.salary ?? "",
      });
    } else {
      setForm({ id: 0, name: "", department: "", salary: "" });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.department.trim() || !form.salary) return;

    onSave({
      ...form,
      salary: parseFloat(form.salary),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {form.id ? "Edit Employee" : "Add New Employee"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter employee name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Engineering, Marketing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Salary
            </label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter salary amount"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl"
            >
              {form.id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [toasts, setToasts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadEmployees = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getEmployees(filters);
      setEmployees(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleEditClick = (emp) => {
    setSelectedEmployee(emp);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteEmployee(id);
      await loadEmployees();
      showToast("Employee deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete employee", "error");
    }
  };

  const handleSave = async (employee) => {
    try {
      if (employee.id && employee.id !== 0) {
        await updateEmployee(employee);
        showToast("Employee updated successfully", "success");
      } else {
        const { id, ...newEmployee } = employee;
        await addEmployee(newEmployee);
        showToast("Employee added successfully", "success");
      }
      setDialogOpen(false);
      await loadEmployees();
    } catch (err) {
      console.error(err);
      showToast("Failed to save employee", "error");
    }
  };

  const handleSearch = async () => {
    await loadEmployees({
      name: searchName || undefined,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-slate-950 text-gray-100"
          : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top bar with theme toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={
              darkMode
                ? "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-800 border border-slate-600 text-gray-100 hover:bg-slate-700 transition"
                : "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            }
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Dark mode</span>
              </>
            )}
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">
              Employee Management
            </h1>
          </div>
          <p className={darkMode ? "text-gray-400 ml-16" : "text-gray-600 ml-16"}>
            Manage your team efficiently
          </p>
        </div>

        {/* Search and Add Section */}
        <div
          className={
            darkMode
              ? "bg-slate-900 rounded-2xl shadow-lg p-6 mb-6 border border-slate-700"
              : "bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
          }
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={handleKeyDown}
                className={
                  darkMode
                    ? "w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-950 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    : "w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                }
              />
            </div>
            <button
              onClick={handleSearch}
              className={
                darkMode
                  ? "px-6 py-3 bg-slate-800 text-gray-100 rounded-xl hover:bg-slate-700 transition font-medium flex items-center justify-center gap-2"
                  : "px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
              }
            >
              <Search className="w-5 h-5" />
              Search
            </button>
            <button
              onClick={handleAddClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div
          className={
            darkMode
              ? "bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-700"
              : "bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={
                  darkMode
                    ? "bg-slate-800 border-b border-slate-700"
                    : "bg-gray-50 border-b border-gray-200"
                }
              >
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  darkMode ? "divide-y divide-slate-800" : "divide-y divide-gray-200"
                }
              >
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-400">
                          Loading employees...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-16 h-16 text-gray-400" />
                        <p className="font-medium">
                          No employees found
                        </p>
                        <p className="text-sm text-gray-400">
                          Add your first employee to get started
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr
                      key={emp.id}
                      className={
                        darkMode
                          ? "hover:bg-slate-800 transition"
                          : "hover:bg-gray-50 transition"
                      }
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        #{emp.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {emp.name?.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        ₹{Number(emp.salary).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(emp)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(emp.id, emp.name)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee count footer */}
        {!loading && employees.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {employees.length} employee
            {employees.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Dialog */}
      <EmployeeFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={selectedEmployee}
      />

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
