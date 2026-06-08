import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function BuyingHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/items");
        setItems(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch buying history. Please check the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const groupedItems = useMemo(() => {
    const groups = filteredItems.reduce((acc, item) => {
      const date = new Date(item.purchased_date).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a))
    );
  }, [filteredItems]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-t-transparent border-pink-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-bold text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4 sm:px-8 flex flex-col items-center gap-8">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-6">🛒 Buying History</h1>

      <div className="flex gap-2 w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl border border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none shadow-sm placeholder-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="px-5 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-shadow shadow"
          >
            ❌
          </button>
        )}
      </div>

      {Object.keys(groupedItems).length === 0 ? (
        <p className="text-gray-500 text-xl">No matching items found.</p>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-6">
          {Object.entries(groupedItems).map(([date, dateItems], idx) => {
            const taxiFee = dateItems.reduce(
              (sum, item) => sum + (parseFloat(item.taxi_fee) || 0),
              0
            );
            const itemsTotal = dateItems.reduce(
              (sum, item) => sum + (parseFloat(item.total_price) || 0),
              0
            );
            const grandTotal = itemsTotal + taxiFee;return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl shadow-xl border border-pink-200 p-6 hover:shadow-2xl transition-shadow"
              >
                <h2 className="text-lg font-semibold text-pink-700 mb-4 border-b border-pink-100 pb-2">
                  📅 Purchased on: <span className="text-gray-800">{date}</span>
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-pink-50 text-pink-600 uppercase text-xs tracking-wide">
                      <tr>
                        <th className="px-4 py-3 border">#</th>
                        <th className="px-4 py-3 border">Item</th>
                        <th className="px-4 py-3 border">Type</th>
                        <th className="px-4 py-3 border">Qty</th>
                        <th className="px-4 py-3 border">Unit/Pocket</th>
                        <th className="px-4 py-3 border">Stock</th>
                        <th className="px-4 py-3 border">Per Price (qty/kg)</th>
                        <th className="px-4 py-3 border">Taxi Fee</th>
                        <th className="px-4 py-3 border">Total Price</th>
                        <th className="px-4 py-3 border">Total + Taxi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dateItems.map((item, i) => {
                        const isKg = item.measurement_type === "kg";
                        const isPiece = item.measurement_type === "piece";
                        const totalPrice = parseFloat(item.total_price) || 0;
                        const taxi = parseFloat(item.taxi_fee) || 0;
                        const totalWithTaxi = totalPrice + taxi;
                        const originalStock = isKg
                          ? `${parseFloat(item.quantity)} kg`
                          : isPiece
                          ? `${parseFloat(item.quantity)} pcs`
                          : `${parseFloat(item.quantity) * parseFloat(item.unit_per_pocket)} units`;

                        return (
                          <tr
                            key={i}
                            className={`border-t hover:bg-pink-50 transition-colors ${
                              totalWithTaxi > 500 ? "bg-pink-100" : ""
                            }`}
                          >
                            <td className="px-4 py-2 border text-center">{i + 1}</td>
                            <td className="px-4 py-2 border font-medium text-gray-800">
                              {item.item_name}
                            </td>
                            <td className="px-4 py-2 border text-center">
                              {isKg ? (
                                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                  ⚖️ kg
                                </span>
                              ) : isPiece ? (
                                <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                  🧩 piece
                                </span>
                              ) : (
                                <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                  📦 pocket
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 border text-center">
                              {item.quantity} {isKg ? "kg" : "pcs"}
                            </td>
                            <td className="px-4 py-2 border text-center">
                              {isKg || isPiece ? (
                                <span className="text-gray-400 text-xs">N/A</span>
                              ) : (
                                item.unit_per_pocket
                              )}
                            </td>
                            <td className="px-4 py-2 border text-center">{originalStock}</td>
                            <td className="px-4 py-2 border text-center">{item.price} ETB</td>
                            <td className="px-4 py-2 border text-center">{taxi.toFixed(2)} ETB</td>
                            <td className="px-4 py-2 border text-center font-semibold text-blue-600">
                              {totalPrice.toFixed(2)} ETB
                            </td>
                            <td className="px-4 py-2 border text-center font-bold text-green-600">
                              {totalWithTaxi.toFixed(2)} ETB
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col md:flex-row justify-end gap-6 text-gray-800 font-semibold">
                  <p>Items Total: <span className="text-pink-600">{itemsTotal.toFixed(2)} ETB</span></p>
                  <p>Taxi Total: <span className="text-pink-600">{taxiFee.toFixed(2)} ETB</span></p>
                  <p className="text-green-600">Grand Total: {grandTotal.toFixed(2)} ETB</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}