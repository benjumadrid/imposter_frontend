import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loan = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    item_name: "",
    quantity: "",
    amount: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [foundItem, setFoundItem] = useState(null);
  const [itemError, setItemError] = useState("");
  const [fetchingItem, setFetchingItem] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const suggestionRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 800);
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
    if (!formData.item_name.trim()) {
      setSuggestions([]);
      setFoundItem(null);
      setShowSuggestions(false);
      setItemError("");
      return;
    }
    const delay = setTimeout(async () => {
      setFetchingItem(true);
      try {
        const res = await fetch(`http://localhost:3000/api/items/search?name=${formData.item_name}`);
        const data = await res.json();
        const results = Array.isArray(data) ? data : [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        const exact = results.find((d) => d.item_name.toLowerCase() === formData.item_name.toLowerCase());
        setFoundItem(exact || null);
        setItemError(results.length === 0 ? "❌ Item not found in inventory!" : "");
      } catch {
        setItemError("Network error searching item.");
        setSuggestions([]);
        setFoundItem(null);
      } finally {
        setFetchingItem(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [formData.item_name]);

  const handleSelectSuggestion = (item) => {
    setFormData((prev) => ({ ...prev, item_name: item.item_name, quantity: "" }));
    setFoundItem(item);
    setSuggestions([]);
    setShowSuggestions(false);
    setItemError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && foundItem) {
      if (parseFloat(value) > foundItem.stock_units) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!foundItem) return alert("Please search and confirm a valid item first!");
    if (Number(formData.quantity) > foundItem.stock_units)
      return alert(`❌ Only ${foundItem.stock_units} ${getUnitLabel()} available!`);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/loans/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message || (response.ok ? "Loan added successfully!" : "Error adding loan"));
      if (response.ok) {
        setFormData({ customer_name: "", customer_phone: "", item_name: "", quantity: "", amount: "", due_date: "" });
        setFoundItem(null);
        setSuggestions([]);
        setItemError("");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-indigo-500 font-bold text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const isKg = foundItem?.measurement_type === "kg";
  const isPiece = foundItem?.measurement_type === "piece";
  const getUnitLabel = () => isKg ? "kg" : isPiece ? "pcs" : "units";

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                🤝 Confirm Loan
              </h3>
              <div className="space-y-2 text-sm text-gray-600 mb-6 bg-indigo-50 rounded-xl p-4">
                <p><span className="font-semibold text-gray-800">Customer:</span> {formData.customer_name}</p>
                <p><span className="font-semibold text-gray-800">Phone:</span> {formData.customer_phone}</p>
                <p><span className="font-semibold text-gray-800">Item:</span> {formData.item_name}</p>
                <p><span className="font-semibold text-gray-800">Type:</span> {foundItem?.measurement_type}</p>
                <p><span className="font-semibold text-gray-800">Quantity:</span> {formData.quantity} {getUnitLabel()}</p>
                <p><span className="font-semibold text-gray-800">Amount:</span> {formData.amount} ETB</p>
                <p><span className="font-semibold text-gray-800">Due Date:</span> {formData.due_date}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  ✅ Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Add New Loan</h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange}
              placeholder="Customer Name" autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />

            <input type="text" name="customer_phone" value={formData.customer_phone} onChange={handleChange}
              placeholder="Customer Phone" autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />

            <div className="relative" ref={suggestionRef}>
              <input type="text" name="item_name" value={formData.item_name} onChange={handleChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search item name..." autoComplete="off"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />

              {showSuggestions && (
                <motion.ul initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((item) => (
                    <li key={item.id} onMouseDown={() => handleSelectSuggestion(item)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-indigo-50 cursor-pointer text-sm border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span>{item.measurement_type === "kg" ? "⚖️" : item.measurement_type === "piece" ? "🧩" : "📦"}</span>
                        <span className="font-medium text-gray-800">{item.item_name}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.stock_units === 0 ? "bg-red-100 text-red-500" : "bg-indigo-100 text-indigo-600"}`}>
                        {item.stock_units === 0 ? "Out of stock" : `${item.stock_units} ${item.measurement_type === "kg" ? "kg" : item.measurement_type === "piece" ? "pcs" : "units"}`}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}

              {fetchingItem && <p className="text-xs text-gray-400 mt-1 px-1">🔍 Searching...</p>}
              {!fetchingItem && foundItem && (
                <div className="mt-1 px-2 py-1.5 bg-indigo-50 border border-indigo-200 rounded-md text-xs text-indigo-700 flex items-center justify-between">
                  <span>{isKg ? "⚖️ kg" : isPiece ? "🧩 piece" : "📦 pocket"} — <strong>{foundItem.stock_units} {getUnitLabel()} available</strong></span>
                  {foundItem.stock_units === 0 && <span className="text-red-500 font-semibold ml-2">Out of stock</span>}
                </div>
              )}
              {!fetchingItem && itemError && !showSuggestions && (
                <p className="text-xs text-red-400 mt-1 px-1">{itemError}</p>
              )}
            </div>

            {foundItem && (
              <div className="relative">
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange}
                  placeholder={`Quantity (max ${foundItem.stock_units} ${getUnitLabel()})`}
                  min="1" max={foundItem.stock_units} step={isKg ? "0.01" : "1"} autoComplete="off"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                {formData.quantity && (
                  <p className="text-xs text-gray-400 mt-1 px-1">Max: {foundItem.stock_units} {getUnitLabel()}</p>
                )}
              </div>
            )}

            <input type="number" name="amount" value={formData.amount} onChange={handleChange}
              placeholder="Amount (ETB)" autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />

            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400" required />

            <button type="submit" disabled={loading || !foundItem || foundItem.stock_units === 0}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Adding..." : "Add Loan"}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default Loan;