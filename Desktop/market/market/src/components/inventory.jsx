import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSearch, FiBox, FiPackage, FiAlertTriangle, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/items");
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const getStatus = (stockUnits) => {
    if (stockUnits === 0 || stockUnits == null)
      return {
        text: "Out of Stock",
        bg: "bg-red-100",
        text_color: "text-red-600",
        border: "border-red-300",
        icon: <FiXCircle className="text-red-500" size={18} />,
      };
    if (stockUnits <= 10)
      return {
        text: "Low Stock",
        bg: "bg-yellow-50",
        text_color: "text-yellow-600",
        border: "border-yellow-300",
        icon: <FiAlertTriangle className="text-yellow-500" size={18} />,
      };
    return {
      text: "In Stock",
      bg: "bg-green-50",
      text_color: "text-green-600",
      border: "border-green-300",
      icon: <FiCheckCircle className="text-green-500" size={18} />,
    };
  };

  const getMeasurementBadge = (type) => {
    if (type === "kg")
      return <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full">⚖️ kg</span>;
    if (type === "piece")
      return <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">🧩 piece</span>;
    return <span className="text-xs bg-purple-100 text-purple-600 font-semibold px-2 py-0.5 rounded-full">📦 pocket</span>;
  };

  const getStockLabel = (item) => {
    if (item.measurement_type === "kg") return `${item.stock_units} kg`;
    if (item.measurement_type === "piece") return `${item.stock_units} pcs`;
    return `${item.stock_units} units`;
  };

  const getQtyLabel = (item) => {
    if (item.measurement_type === "kg") return `${item.quantity} kg`;
    if (item.measurement_type === "piece") return `${item.quantity} pcs`;
    return `${item.quantity} pockets`;
  };

  const filteredItems = items
    .filter((item) => item.item_name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => {
      if (filter === "all") return true;
      const s = getStatus(item.stock_units).text.toLowerCase().replace(" ", "-");
      return s === filter;
    });

  const outOfStock = items.filter((i) => !i.stock_units || i.stock_units === 0).length;
  const lowStock = items.filter((i) => i.stock_units > 0 && i.stock_units <= 10).length;
  const goodStock = items.filter((i) => i.stock_units > 10).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-14 h-14 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2 mb-1">
          <FiBox size={30} className="text-indigo-500" /> Inventory & Stock
        </h1>
        <p className="text-gray-400 text-sm">{items.length} total items tracked</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
            <FiCheckCircle className="text-green-500" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">In Stock</p>
            <p className="text-2xl font-extrabold text-green-600">{goodStock}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <FiAlertTriangle className="text-yellow-500" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Low Stock</p>
            <p className="text-2xl font-extrabold text-yellow-500">{lowStock}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
            <FiXCircle className="text-red-500" size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Out of Stock</p>
            <p className="text-2xl font-extrabold text-red-500">{outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 pl-9 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "in-stock", "low-stock", "out-of-stock"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                filter === f
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-500 border-gray-300 hover:border-indigo-300"
              }`}
            >
              {f === "all" ? "All" : f === "in-stock" ? "✅ In Stock" : f === "low-stock" ? "⚠️ Low" : "❌ Out"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center text-gray-400 text-xl py-20">No items found 📭</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, i) => {
            const status = getStatus(item.stock_units);
            const isPocket = item.measurement_type === "pocket";

            return (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`bg-white rounded-2xl shadow-sm border-2 ${status.border} p-5 flex flex-col justify-between hover:shadow-md transition-all`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <FiPackage className="text-indigo-500" size={18} />
                    </div>
                    <h2 className="text-base font-bold text-gray-800 leading-tight">{item.item_name}</h2>
                  </div>
                  {getMeasurementBadge(item.measurement_type)}
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-sm text-gray-600 mb-4">

                  <div className="flex justify-between">
                    <span className="text-gray-400">Qty Purchased</span>
                    <span className="font-semibold">{getQtyLabel(item)}</span>
                  </div>

                  {isPocket && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Units per Pocket</span>
                      <span className="font-semibold">{item.unit_per_pocket}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock Remaining</span>
                    <span className="font-bold text-gray-800">{getStockLabel(item)}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-1.5">
                    <span className="text-gray-400">Price per {item.measurement_type === "kg" ? "kg" : item.measurement_type === "piece" ? "piece" : "pocket"}</span>
                    <span className="font-semibold text-indigo-600">{item.price} ETB</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Paid</span>
                    <span className="font-semibold text-pink-600">{parseFloat(item.total_price).toFixed(2)} ETB</span>
                  </div>

                  {parseFloat(item.taxi_fee) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taxi Fee</span>
                      <span className="font-semibold text-orange-500">{parseFloat(item.taxi_fee).toFixed(2)} ETB</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-xs text-gray-400 italic pt-1 border-t border-gray-100">📝 {item.notes}</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl ${status.bg} ${status.text_color} font-semibold text-sm`}>
                  {status.icon} {status.text}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}