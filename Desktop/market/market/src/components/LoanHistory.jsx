import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser, FiSmartphone,
  FiCalendar, FiDollarSign, FiTrash2, FiPackage
} from "react-icons/fi";

export default function LoanHistory() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/loans/all");
      const data = await res.json();
      // ✅ Filter out paid loans on frontend too as a safety net
      const unpaid = (Array.isArray(data) ? data : data.loans || []).filter(
        (loan) => loan.status !== "paid"
      );
      setLoans(unpaid);
    } catch (err) {
      console.log("Error fetching loan history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const parseLocalDate = (raw) => {
    if (!raw) return new Date(NaN);
    const str = String(raw).slice(0, 10);
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const handleMarkPaid = async (id) => {
    if (!window.confirm("Mark this loan as paid? This will record it as a sale.")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/loans/${id}/paid`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok) {
        setLoans((prev) => prev.filter((loan) => loan.id !== id));
        alert(data.message || "✅ Loan marked as paid and recorded as a sale!");
      } else {
        alert(data.message || "❌ Failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Try again!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this loan record permanently?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/loans/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLoans((prev) => prev.filter((loan) => loan.id !== id));
        alert("🗑️ Loan deleted successfully!");
      } else {
        alert("❌ Failed to delete loan.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Try again!");
    }
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      loan.item_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = loans.reduce(
    (sum, l) => sum + (parseFloat(l.amount) || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-indigo-500 font-bold text-2xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-100 py-14 px-4"
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-600">Loan History 📑</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loans.length} total loans —{" "}
            <span className="text-red-500 font-semibold">
              {totalPending.toFixed(2)} ETB pending
            </span>
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by customer or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
          />
        </div>

        {filteredLoans.length === 0 && (
          <div className="text-center text-gray-500 text-xl py-10">
            No loan records found ❗
          </div>
        )}

        <div className="space-y-5">
          {filteredLoans.map((loan, index) => {
            const dueDate = parseLocalDate(loan.due_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isOverdue = dueDate < today;

            return (
              <motion.div
                key={loan.id || index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="p-6 rounded-2xl bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Customer + actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-indigo-500 text-lg" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {loan.customer_name}
                      </h2>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FiSmartphone size={11} /> {loan.customer_phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkPaid(loan.id)}
                      className="flex items-center gap-1 text-sm text-green-500 hover:text-green-700 border border-green-200 hover:border-green-400 px-3 py-1.5 rounded-lg transition"
                    >
                      ✅ Mark Paid
                    </button>
                    <button
                      onClick={() => handleDelete(loan.id)}
                      className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-3">
                    <p className="text-xs text-indigo-400 font-semibold uppercase mb-1 flex items-center gap-1">
                      <FiPackage size={11} /> Item
                    </p>
                    <p className="font-bold text-gray-800 text-sm">{loan.item_name}</p>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-3">
                    <p className="text-xs text-indigo-400 font-semibold uppercase mb-1">Quantity</p>
                    <p className="font-bold text-gray-800 text-sm">{loan.quantity}</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-green-400 font-semibold uppercase mb-1 flex items-center gap-1">
                      <FiDollarSign size={11} /> Amount
                    </p>
                    <p className="font-bold text-green-700 text-sm">
                      {parseFloat(loan.amount).toFixed(2)} ETB
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs text-orange-400 font-semibold uppercase mb-1 flex items-center gap-1">
                      <FiCalendar size={11} /> Due Date
                    </p>
                    <p className="font-bold text-orange-700 text-sm">
                      {dueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Overdue badge */}
                {isOverdue && (
                  <div className="mt-3 text-xs text-red-500 font-semibold bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 inline-block">
                    ⚠️ Overdue
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}