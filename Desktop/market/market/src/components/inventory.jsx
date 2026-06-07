import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiSearch, FiBox } from "react-icons/fi";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // ✅ Fetch all items from buying_items table
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

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (stockUnits) => {
    if (stockUnits === 0) return { text: "Out of Stock", color: "bg-red-400" };
    if (stockUnits <= 10) return { text: "Low Stock", color: "bg-yellow-400" };
    return { text: "Good Stock", color: "bg-green-400" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-blue-500 font-bold text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-10 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-700 flex items-center gap-2">
        <FiBox size={36} /> Inventory / Stock
      </h1>

      {/* Search Bar */}
      <div className="mb-8 w-full max-w-3xl">
        <div className="relative">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500 text-xl col-span-full">No items found.</p>
        ) : (
          filteredItems.map((item, i) => {
            const status = getStatus(item.stock_units);
            const borderColor = status.color.replace("bg-", "border-"); // border color from bg color

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`bg-white rounded-3xl shadow-xl border-4 ${borderColor} p-6 flex flex-col justify-between hover:scale-105 transition-all`}
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">{item.item_name}</h2>
                  <p className="text-gray-600 mb-1">Quantity Purchased: {item.quantity}</p>
                  <p className="text-gray-600 mb-1">Quantity Available: {item.quantity_available}</p>
                  <p className="text-gray-600 mb-1">Units per Pocket: {item.unit_per_pocket}</p>
                  <p className="text-gray-600 mb-1">Stock Units: {item.stock_units}</p>
                  <p className="text-gray-600 mb-1">Buying Price: {item.price} ETB</p>
                  {item.notes && <p className="text-gray-500 italic text-sm">Note: {item.notes}</p>}
                </div>

                <div className={`text-white font-bold py-2 px-4 rounded-xl text-center ${status.color}`}>
                  {status.text}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
