import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function BuyingItems() {
  const [fields, setFields] = useState({
    item_name: "",
    measurement_type: "pocket",
    quantity: "",
    unit_per_pocket: "",
    price_per_unit: "",
    price: "",
    taxi_fee: "",
    notes: "",
    purchased_date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFields((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "measurement_type" && value === "kg") {
        updated.unit_per_pocket = "";
      }

      // ✅ Auto-calculate total price
      const qty = parseFloat(name === "quantity" ? value : updated.quantity) || 0;
      const perUnit = parseFloat(name === "price_per_unit" ? value : updated.price_per_unit) || 0;

      if (qty > 0 && perUnit > 0) {
        updated.price = (qty * perUnit).toFixed(2);
      } else {
        updated.price = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/items/create", fields);
      alert("✅ Item added successfully!");
      setFields({
        item_name: "",
        measurement_type: "pocket",
        quantity: "",
        unit_per_pocket: "",
        price_per_unit: "",
        price: "",
        taxi_fee: "",
        notes: "",
        purchased_date: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-pink-500 font-bold text-2xl animate-pulse">
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
    >
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-500">
          🛒 Add Buying Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Item Name */}
          <input
            type="text"
            name="item_name"
            value={fields.item_name}
            onChange={handleChange}
            placeholder="Item Name"
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          {/* Measurement Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFields((prev) => ({ ...prev, measurement_type: "pocket", unit_per_pocket: "" }))}
              className={`flex-1 py-2 rounded-md font-semibold border transition duration-200 ${
                fields.measurement_type === "pocket"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-500 border-gray-300 hover:border-pink-400"
              }`}
            >
              📦 Pocket / Unit
            </button>
            <button
              type="button"
              onClick={() => setFields((prev) => ({ ...prev, measurement_type: "kg", unit_per_pocket: "" }))}
              className={`flex-1 py-2 rounded-md font-semibold border transition duration-200 ${
                fields.measurement_type === "kg"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-500 border-gray-300 hover:border-pink-400"
              }`}
            >
              ⚖️ Kilogram (kg)
            </button>
          </div>

          {/* Quantity */}
          <input
            type="number"
            name="quantity"
            value={fields.quantity}
            onChange={handleChange}
            placeholder={fields.measurement_type === "kg" ? "Quantity (kg)" : "Quantity (pockets)"}
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            step={fields.measurement_type === "kg" ? "0.01" : "1"}
            min="0"
            required
          />

          {/* Unit per Pocket */}
          {fields.measurement_type === "pocket" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="number"
                name="unit_per_pocket"
                value={fields.unit_per_pocket}
                onChange={handleChange}
                placeholder="Unit per Pocket"
                autoComplete="off"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                min="1"
                required
              />
            </motion.div>
          )}

          {fields.measurement_type === "kg" && (
            <p className="text-xs text-gray-400 -mt-2 px-1">
              ℹ️ Stock will be tracked in kg directly.
            </p>
          )}

          {/* ✅ Price per unit/kg */}
          <div className="relative">
            <input
              type="number"
              name="price_per_unit"
              value={fields.price_per_unit}
              onChange={handleChange}
              placeholder={
                fields.measurement_type === "kg"
                  ? "Price per kg"
                  : "Price per Pocket"
              }
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              min="0"
              step="0.01"
              required
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-400">
              per {fields.measurement_type === "kg" ? "kg" : "pocket"}
            </span>
          </div>

          {/* ✅ Total Price — auto calculated, still editable */}
          <div className="relative">
            <input
              type="number"
              name="price"
              value={fields.price}
              onChange={handleChange}
              placeholder="Total Price Paid"
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50"
              min="0"
              step="0.01"
              required
            />
            <span className="absolute right-3 top-2.5 text-xs text-gray-400">
              total
            </span>
            {fields.quantity && fields.price_per_unit && (
              <p className="text-xs text-pink-400 mt-1 px-1">
                ✅ Auto: {fields.quantity} × {fields.price_per_unit} = {fields.price} ETB
              </p>
            )}
          </div>

          {/* Taxi Fee */}
          <input
            type="number"
            name="taxi_fee"
            value={fields.taxi_fee}
            onChange={handleChange}
            placeholder="Taxi Fee (Optional)"
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            min="0"
          />

          {/* Notes */}
          <input
            type="text"
            name="notes"
            value={fields.notes}
            onChange={handleChange}
            placeholder="Notes (Optional)"
            autoComplete="off"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* Date */}
          <input
            type="date"
            name="purchased_date"
            value={fields.purchased_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition duration-200"
          >
            {loading ? "Saving..." : "💾 Add Item"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}