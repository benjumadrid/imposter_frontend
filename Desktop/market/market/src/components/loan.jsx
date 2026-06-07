import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
  const suggestionRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search as user types
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
        const res = await fetch(
          `http://localhost:3000/api/items/search?name=${formData.item_name}`
        );
        const data = await res.json();
        const results = Array.isArray(data) ? data : [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);

        const exact = results.find(
          (d) => d.item_name.toLowerCase() === formData.item_name.toLowerCase()
        );
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

    // Block quantity more than stock
    if (name === "quantity" && foundItem) {
      if (parseFloat(value) > foundItem.stock_units) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foundItem) return alert("Please search and confirm a valid item first!");
    if (Number(formData.quantity) > foundItem.stock_units)
      return alert(`❌ Only ${foundItem.stock_units} ${foundItem.measurement_type === "kg" ? "kg" : "units"} available!`);

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

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Add New Loan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="Customer Name"
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="text"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            placeholder="Customer Phone"
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Item search with dropdown */}
          <div className="relative" ref={suggestionRef}>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search item name..."
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                    className="flex items-center justify-between px-3 py-2 hover:bg-indigo-50 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.measurement_type === "kg" ? "⚖️" : "📦"}</span>
                      <span className="font-medium text-gray-800">{item.item_name}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.stock_units === 0
                        ? "bg-red-100 text-red-500"
                        : "bg-indigo-100 text-indigo-600"
                    }`}>
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
            {!fetchingItem && foundItem && (
              <div className="mt-1 px-2 py-1.5 bg-indigo-50 border border-indigo-200 rounded-md text-xs text-indigo-700 flex items-center justify-between">
                <span>
                  {isKg ? "⚖️ kg item" : "📦 pocket item"} —{" "}
                  <strong>{foundItem.stock_units} {isKg ? "kg" : "units"} available</strong>
                </span>
                {foundItem.stock_units === 0 && (
                  <span className="text-red-500 font-semibold ml-2">Out of stock</span>
                )}
              </div>
            )}
            {!fetchingItem && itemError && !showSuggestions && (
              <p className="text-xs text-red-400 mt-1 px-1">{itemError}</p>
            )}
          </div>

          {/* Quantity */}
          {foundItem && (
            <div className="relative">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder={`Quantity (max ${foundItem.stock_units} ${isKg ? "kg" : "units"})`}
                min="1"
                max={foundItem.stock_units}
                step={isKg ? "0.01" : "1"}
                autoComplete="off"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              {isKg && (
                <span className="absolute right-3 top-2.5 text-xs text-gray-400">kg</span>
              )}
              {formData.quantity && (
                <p className="text-xs text-gray-400 mt-1 px-1">
                  Max: {foundItem.stock_units} {isKg ? "kg" : "units"}
                </p>
              )}
            </div>
          )}

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount (ETB)"
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <button
            type="submit"
            disabled={loading || !foundItem || foundItem.stock_units === 0}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Loan"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Loan;