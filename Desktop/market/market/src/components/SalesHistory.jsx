import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const parseDateSmart = (dateStr) => {
    if (!dateStr) return new Date(NaN);
    const raw = String(dateStr).trim();

    if (/^[0-9]+$/.test(raw)) return new Date(Number(raw));

    const isoMatch = raw.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?)?(?:([+-]\d{2}:?\d{2}|Z))?$/
    );
    if (isoMatch) {
      const year = Number(isoMatch[1]);
      const month = Number(isoMatch[2]);
      const day = Number(isoMatch[3]);
      const hour = Number(isoMatch[4] || 0);
      const minute = Number(isoMatch[5] || 0);
      const second = Number(isoMatch[6] ? parseFloat(isoMatch[6]) : 0);
      const tz = isoMatch[7];
      if (tz) return new Date(raw.replace(" ", "T"));
      return new Date(year, month - 1, day, hour, minute, Math.floor(second), Math.floor((second % 1) * 1000));
    }

    return new Date(raw);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchSales = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/sales");
        if (isMounted) setSales(res.data);
      } catch (err) {
        console.error("Error fetching sales:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSales();
    const interval = setInterval(fetchSales, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredSales = useMemo(() => {
    if (!search) return sales;
    return sales.filter((sale) =>
      sale.item_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search]);

  const groupedSales = useMemo(() => {
    const groups = filteredSales.reduce((acc, sale) => {
      const dateObj = parseDateSmart(sale.sale_date || sale.sales_date);
      const date = dateObj.toLocaleDateString();
      if (!acc[date]) acc[date] = { items: [], total: 0 };
      const price = parseFloat(sale.selling_price) || 0;
      const tax = parseFloat(sale.tax_fee) || 0;
      acc[date].items.push(sale);
      acc[date].total += price + tax;
      return acc;
    }, {});

    // ✅ Sort newest date first
    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a))
    );
  }, [filteredSales]);

  const formatExact = (dateStr) => {
    const d = parseDateSmart(dateStr);
    if (Number.isNaN(d.getTime())) return "Invalid date";
    const now = new Date();
    if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
      if (d.toDateString() === now.toDateString()) return "Today";
      return d.toLocaleDateString();
    }
    return d.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-blue-500 font-bold text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: "easeOut" },
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-8 px-4 gap-8">
      <motion.h1 {...fadeUp} className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        📝 Sales History
      </motion.h1>

      {/* Search */}
      <motion.div {...fadeUp} transition={{ duration: 1.3, delay: 0.2 }} className="w-full max-w-5xl mb-6">
        <input
          type="text"
          placeholder="Search by item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-lg placeholder-gray-400"
        />
      </motion.div>

      {/* Sales by date */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 1.4, delay: 0.4 }}
        className="flex flex-col w-full max-w-6xl gap-8"
      >
        {Object.keys(groupedSales).length === 0 ? (
          <div className="text-xl font-semibold text-gray-600 text-center mt-6">
            No sales found.
          </div>
        ) : (
          Object.entries(groupedSales).map(([date, data], i) => (
            <motion.div
              key={date}
              {...fadeUp}
              transition={{ duration: 1.2, delay: 0.5 + i * 0.2 }}
              className="bg-white p-6 rounded-3xl shadow-lg border-4 border-pink-400"
            >
              {/* Date & total */}
              <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                <h3 className="text-xl font-bold text-gray-800">{date}</h3>
                <span className="text-lg font-semibold text-gray-700">
                  Total: {data.total.toFixed(2)} ETB
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {data.items.map((sale, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6 + j * 0.05, ease: "easeOut" }}
                    className="bg-gradient-to-tr from-gray-50 to-gray-100 p-5 rounded-2xl shadow-md flex flex-col gap-2 hover:shadow-xl hover:scale-105 transition-all border-l-4 border-r-4 border-blue-400"
                  >
                    <span className="font-bold text-gray-800 text-lg">{sale.item_name}</span>
                    <span className="text-green-600 font-semibold">
                      Price: {parseFloat(sale.selling_price).toLocaleString()} ETB
                    </span>
                    <span className="text-gray-700">Quantity: {sale.quantity_sold}</span>
                    {sale.tax_fee && (
                      <span className="text-blue-500">
                        Tax: {parseFloat(sale.tax_fee).toLocaleString()} ETB
                      </span>
                    )}
                    {sale.notes && (
                      <span className="text-gray-500 italic text-sm">Note: {sale.notes}</span>
                    )}
                    <span className="text-gray-400 text-xs italic mt-1">
                      {formatExact(sale.sales_date || sale.sale_date)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}