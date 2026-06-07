import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiTrendingUp, FiCalendar, FiSearch } from "react-icons/fi";

export default function Report() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [weekEnd, setWeekEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/sales");
        setSales(res.data || []);
      } catch (err) {
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const parseNum = (raw) => {
    if (raw === null || raw === undefined) return 0;
    const s = String(raw).replace(/,/g, "").trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const saleValue = (sale) => parseNum(sale.selling_price ?? sale.price ?? 0);

  const monthYearOptions = useMemo(() => {
    const months = new Set();
    sales.forEach((s) => {
      const d = new Date(s.sales_date || s.sale_date || s.saleDate);
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        months.add(`${y}-${m}`);
      }
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [sales]);

  useEffect(() => {
    if (!selectedMonth && monthYearOptions.length) {
      setSelectedMonth(monthYearOptions[0]);
    }
  }, [monthYearOptions, selectedMonth]);

  const filteredSales = useMemo(() => {
    if (!search) return sales;
    return sales.filter((s) =>
      (s.item_name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search]);

  const { dailyWindow, weeklyWindow, monthlyWindow } = useMemo(() => {
    const end = new Date(weekEnd + "T23:59:59");
    const validEnd = isNaN(end.getTime()) ? new Date() : end;

    const dayStart = new Date(validEnd);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const weeklyStart = new Date(dayStart);
    weeklyStart.setDate(dayStart.getDate() - 6);
    const weeklyEnd = new Date(dayEnd);

    let monthStart, monthEnd;
    if (selectedMonth) {
      const [yStr, mStr] = selectedMonth.split("-");
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10) - 1;
      monthStart = new Date(y, m, 1);
      monthEnd = new Date(y, m + 1, 1);
    } else {
      const y = validEnd.getFullYear();
      const m = validEnd.getMonth();
      monthStart = new Date(y, m, 1);
      monthEnd = new Date(y, m + 1, 1);
    }

    return {
      dailyWindow: { start: dayStart, end: dayEnd },
      weeklyWindow: { start: weeklyStart, end: weeklyEnd },
      monthlyWindow: { start: monthStart, end: monthEnd },
    };
  }, [weekEnd, selectedMonth]);

  const totals = useMemo(() => {
    let daily = 0, weekly = 0, monthly = 0;
    filteredSales.forEach((s) => {
      const d = new Date(s.sales_date || s.sale_date || s.saleDate);
      if (isNaN(d.getTime())) return;
      const val = saleValue(s);
      if (d >= dailyWindow.start && d < dailyWindow.end) daily += val;
      if (d >= weeklyWindow.start && d < weeklyWindow.end) weekly += val;
      if (d >= monthlyWindow.start && d < monthlyWindow.end) monthly += val;
    });
    return { daily, weekly, monthly };
  }, [filteredSales, dailyWindow, weeklyWindow, monthlyWindow]);

  const grouped = useMemo(() => {
    return filteredSales.reduce((acc, s) => {
      const d = new Date(s.sales_date || s.sale_date || s.saleDate);
      const key = isNaN(d.getTime()) ? "Unknown" : d.toLocaleDateString();
      if (!acc[key]) acc[key] = { items: [], total: 0 };
      acc[key].items.push(s);
      acc[key].total += saleValue(s);
      return acc;
    }, {});
  }, [filteredSales]);

  const fmt = (n) =>
    Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const fadeUp = {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-pink-500 font-bold text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 py-10 px-6">
      <motion.h1 {...fadeUp} className="text-4xl font-bold text-gray-800 mb-10 flex items-center gap-3">
        <FiTrendingUp className="text-pink-600" /> Sales Report
      </motion.h1>

      {/* Filters */}
      <motion.div {...fadeUp} className="grid md:grid-cols-3 gap-6 mb-10">
        <div>
          <label className="text-sm text-gray-600">Week End Date</label>
          <input
            type="date"
            value={weekEnd}
            onChange={(e) => setWeekEnd(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Select Month</label>
          <select
            value={selectedMonth || ""}
            onChange={(e) => setSelectedMonth(e.target.value || null)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Auto (current)</option>
            {monthYearOptions.map((m) => {
              const [y, mm] = m.split("-");
              const label = new Date(`${y}-${mm}-01`).toLocaleString(undefined, {
                month: "long",
                year: "numeric",
              });
              return <option key={m} value={m}>{label}</option>;
            })}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Search Items</label>
          <div className="relative">
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>
      </motion.div>

      {/* Totals */}
      <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-pink-500 text-white p-6 rounded-3xl shadow-lg text-center">
          <div className="text-sm opacity-90">Daily</div>
          <div className="text-3xl font-extrabold">{fmt(totals.daily)} ETB</div>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-3xl shadow-lg text-center">
          <div className="text-sm opacity-90">Weekly (7 days)</div>
          <div className="text-3xl font-extrabold">{fmt(totals.weekly)} ETB</div>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-3xl shadow-lg text-center">
          <div className="text-sm opacity-90">Monthly</div>
          <div className="text-3xl font-extrabold">{fmt(totals.monthly)} ETB</div>
        </div>
      </motion.div>

      {/* Grouped Sales */}
      <div className="space-y-8">
        {Object.entries(grouped).length === 0 ? (
          <div className="text-center text-gray-600 text-lg bg-white p-8 rounded-2xl shadow">
            No sales found.
          </div>
        ) : (
          Object.entries(grouped).map(([date, grp], idx) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-lg border border-pink-100"
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiCalendar className="text-pink-500" /> {date}
                </h2>
                <span className="font-semibold text-pink-600">
                  Total: {fmt(grp.total)} ETB
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grp.items.map((s, j) => {
                  const isFromLoan = (s.notes || "").startsWith("Loan repayment");
                  return (
                    <motion.div
                      key={j}
                      whileHover={{ scale: 1.04 }}
                      className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all"
                    >
                      {/* Item name + loan badge */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {s.item_name}
                        </h3>
                        {isFromLoan && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                            📋 From Loan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Qty: {s.quantity_sold ?? s.quantity ?? 0}
                      </p>
                      <p className="text-sm font-semibold text-pink-600 mt-1">
                        Sale Value: {fmt(saleValue(s))} ETB
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}