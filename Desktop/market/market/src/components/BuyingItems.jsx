import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    purchased_date: new Date().toLocaleDateString("en-CA"),
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "measurement_type" && (value === "kg" || value === "piece")) {
        updated.unit_per_pocket = "";
      }
      const qty = parseFloat(name === "quantity" ? value : updated.quantity) || 0;
      const perUnit = parseFloat(name === "price_per_unit" ? value : updated.price_per_unit) || 0;
      updated.price = qty > 0 && perUnit > 0 ? (qty * perUnit).toFixed(2) : "";
      return updated;
    });
  };

  const handleMeasurementType = (type) => {
    setFields((prev) => {
      const updated = { ...prev, measurement_type: type, unit_per_pocket: "" };
      const qty = parseFloat(prev.quantity) || 0;
      const perUnit = parseFloat(prev.price_per_unit) || 0;
      updated.price = qty > 0 && perUnit > 0 ? (qty * perUnit).toFixed(2) : "";
      return updated;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
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
        purchased_date: new Date().toLocaleDateString("en-CA"),
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
        <div className="text-pink-500 font-bold text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const isKg = fields.measurement_type === "kg";
  const isPiece = fields.measurement_type === "piece";
  const isPocket = fields.measurement_type === "pocket";

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
                🛒 Confirm Add Item
              </h3>
              <div className="space-y-2 text-sm text-gray-600 mb-6 bg-pink-50 rounded-xl p-4">
                <p><span className="font-semibold text-gray-800">Item:</span> {fields.item_name}</p>
                <p><span className="font-semibold text-gray-800">Type:</span> {fields.measurement_type}</p>
                <p><span className="font-semibold text-gray-800">Quantity:</span> {fields.quantity} {isKg ? "kg" : isPiece ? "pcs" : "pockets"}</p>
                {isPocket && <p><span className="font-semibold text-gray-800">Unit/Pocket:</span> {fields.unit_per_pocket}</p>}
                <p><span className="font-semibold text-gray-800">Price/unit:</span> {fields.price_per_unit} ETB</p>
                <p><span className="font-semibold text-gray-800">Total:</span> {fields.price} ETB</p>
                {fields.taxi_fee && <p><span className="font-semibold text-gray-800">Taxi:</span> {fields.taxi_fee} ETB</p>}
                <p><span className="font-semibold text-gray-800">Date:</span> {fields.purchased_date}</p>
                {fields.notes && <p><span className="font-semibold text-gray-800">Notes:</span> {fields.notes}</p>}
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
                  className="flex-1 py-2 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
                >
                  ✅ Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-pink-500">
            🛒 Add Buying Item
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
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

            <div className="flex gap-2">
              <button type="button" onClick={() => handleMeasurementType("pocket")}
                className={`flex-1 py-2 rounded-md font-semibold border transition duration-200 text-sm ${isPocket ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-500 border-gray-300 hover:border-pink-400"}`}>
                📦 Pocket
              </button>
              <button type="button" onClick={() => handleMeasurementType("kg")}
                className={`flex-1 py-2 rounded-md font-semibold border transition duration-200 text-sm ${isKg ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-500 border-gray-300 hover:border-pink-400"}`}>
                ⚖️ kg
              </button>
              <button type="button" onClick={() => handleMeasurementType("piece")}
                className={`flex-1 py-2 rounded-md font-semibold border transition duration-200 text-sm ${isPiece ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-500 border-gray-300 hover:border-pink-400"}`}>
                🧩 Piece
              </button>
            </div>

            <input
              type="number"
              name="quantity"
              value={fields.quantity}
              onChange={handleChange}
              placeholder={isKg ? "Quantity (kg)" : isPiece ? "Quantity (pieces)" : "Quantity (pockets)"}
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              step={isKg ? "0.01" : "1"}
              min="0"
              required
            />

            {isPocket && (
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

            {isKg && <p className="text-xs text-gray-400 -mt-2 px-1">ℹ️ Stock will be tracked in kg directly.</p>}
            {isPiece && <p className="text-xs text-gray-400 -mt-2 px-1">ℹ️ Stock will be tracked per piece.</p>}

            <div className="relative">
              <input
                type="number"
                name="price_per_unit"
                value={fields.price_per_unit}
                onChange={handleChange}
                placeholder={isKg ? "Price per kg" : isPiece ? "Price per Piece" : "Price per Pocket"}
                autoComplete="off"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                min="0"
                step="0.01"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-gray-400">
                per {isKg ? "kg" : isPiece ? "piece" : "pocket"}
              </span>
            </div>

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
              <span className="absolute right-3 top-2.5 text-xs text-gray-400">total</span>
              {fields.quantity && fields.price_per_unit && (
                <p className="text-xs text-pink-400 mt-1 px-1">
                  ✅ Auto: {fields.quantity} × {fields.price_per_unit} = {fields.price} ETB
                </p>
              )}
            </div>

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

            <input
              type="text"
              name="notes"
              value={fields.notes}
              onChange={handleChange}
              placeholder="Notes (Optional)"
              autoComplete="off"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

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
    </>
  );
}