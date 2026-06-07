import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function SalesItems() {
  const [fields, setFields] = useState({
    item_name: "",
    quantity_sold: "",
    selling_price: "",
    notes: "",
    sale_date: new Date().toISOString().slice(0, 10),
  });
  const [itemInfo, setItemInfo] = useState(null);
  const [fetchingItem, setFetchingItem] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!fields.item_name.trim()) {
      setSuggestions([]);
      setItemInfo(null);
      setShowSuggestions(false);
      return;
    }

    const delay = setTimeout(async () => {
      setFetchingItem(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/items/search?name=${fields.item_name}`
        );
        const results = res.data || [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);

        const match = results.find(
          (i) => i.item_name.toLowerCase() === fields.item_name.toLowerCase()
        );
        setItemInfo(match || null);
      } catch {
        setSuggestions([]);
        setItemInfo(null);
        setShowSuggestions(false);
      } finally {
        setFetchingItem(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [fields.item_name]);

  const handleSelectSuggestion = (item) => {
    setFields((prev) => ({ ...prev, item_name: item.item_name, quantity_sold: "" }));
    setItemInfo(item);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Block quantity more than available stock
    if (name === "quantity_sold" && itemInfo) {
      if (parseFloat(value) > itemInfo.stock_units) return;
    }

    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/sales/create", fields);
      alert("✅ Sale recorded successfully!");
      setFields({
        item_name: "",
        quantity_sold: "",
        selling_price: "",
        notes: "",
        sale_date: new Date().toISOString().slice(0, 10),
      });
      setItemInfo(null);
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to record sale.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-green-600 font-bold text-2xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  const isKg = itemInfo?.measurement_type === "kg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          💵 Record Sale
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Item Name with suggestions */}
          <div className="relative" ref={suggestionRef}>
            <input
              type="text"
              name="item_name"
              value={fields.item_name}
              onChange={handleChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Item Name"
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            {/* Dropdown */}
            {showSuggestions && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto"
              >
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onMouseDown={() => handleSelectSuggestion(item)}
                    className="flex items-center justify-between px-3 py-2 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.measurement_type === "kg" ? "⚖️" : "📦"}</span>
                      <span className="font-medium text-gray-800">{item.item_name}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.stock_units === 0
                          ? "bg-red-100 text-red-500"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.stock_units === 0
                        ? "Out of stock"
                        : `${item.stock_units} ${item.measurement_type === "kg" ? "kg" : "units"}`}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Status */}
            {fetchingItem && (
              <p className="text-xs text-gray-400 mt-1 px-1">🔍 Searching...</p>
            )}
            {!fetchingItem && itemInfo && (
              <div className="mt-1 px-2 py-1.5 bg-green-50 border border-green-200 rounded-md text-xs text-green-700 flex items-center justify-between">
                <span>
                  {isKg ? "⚖️ kg item" : "📦 pocket item"} —{" "}
                  <strong>
                    {itemInfo.stock_units} {isKg ? "kg" : "units"} available
                  </strong>
                </span>
                {itemInfo.stock_units === 0 && (
                  <span className="text-red-500 font-semibold ml-2">Out of stock</span>
                )}
              </div>
            )}
            {!fetchingItem && fields.item_name.trim() && !itemInfo && !showSuggestions && (
              <p className="text-xs text-red-400 mt-1 px-1">⚠️ Item not found in stock.</p>
            )}
          </div>

          {/* Quantity Sold */}
          <div className="relative">
            <input
              type="number"
              name="quantity_sold"
              value={fields.quantity_sold}
              onChange={handleChange}
              placeholder={isKg ? "Quantity sold (kg)" : "Quantity sold (units)"}
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              step={isKg ? "0.01" : "1"}
              min="0"
              max={itemInfo ? itemInfo.stock_units : undefined}
              required
            />
            {isKg && (
              <span className="absolute right-3 top-2.5 text-xs text-gray-400">kg</span>
            )}
            {/* ✅ Show max stock hint */}
            {itemInfo && fields.quantity_sold && (
              <p className="text-xs text-gray-400 mt-1 px-1">
                Max: {itemInfo.stock_units} {isKg ? "kg" : "units"}
              </p>
            )}
          </div>

          {/* Selling Price */}
          <div className="relative">
            <input
              type="number"
              name="selling_price"
              value={fields.selling_price}
              onChange={handleChange}
              placeholder="Total Selling Price"
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              min="0"
              required
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-400">total</span>
          </div>

          <input
            type="text"
            name="notes"
            value={fields.notes}
            onChange={handleChange}
            placeholder="Notes (Optional)"
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="date"
            name="sale_date"
            value={fields.sale_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <button
            type="submit"
            disabled={loading || !itemInfo || itemInfo.stock_units === 0}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "💾 Record Sale"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}