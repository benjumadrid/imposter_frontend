// src/pages/History.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiTrash2 } from "react-icons/fi";
import Image from "../assets/historys.jpg"; // imported history image

export default function History() {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/orders/all/${user.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all your history?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/orders/delete/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete orders");

      toast.success("All orders deleted successfully!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete orders.");
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/orders/delete/order/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");

      toast.success("Order deleted successfully!");
      fetchOrders(); // re-fetch orders after deletion
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order.");
    }
  };

  if (!user) {
    return <p className="text-center text-red-500 mt-10">No user info found.</p>;
  }

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl">
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={2000} />

        {/* Delete All History Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleDeleteAll}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            🗑️ Delete All Your History
          </button>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-48 rounded-2xl"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center mt-10 text-gray-700 font-medium">
            No orders found for {user.name}.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  className="bg-white/90 rounded-2xl p-6 shadow-xl relative hover:shadow-2xl backdrop-blur-sm transition-transform"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* Delete Single Order Button */}
                  <button
                    onClick={() => handleDeleteSingle(order.book_id)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={20} />
                  </button>

                  <h2 className="text-xl font-bold text-gray-800 mb-2">📚 {order.book_name}</h2>

                  <p className="text-gray-600 mt-1">
                    Quantity: <span className="font-medium">{order.quantity}</span>
                  </p>
                  <p className="text-gray-600">
                    💰 Total: <span className="font-medium">${order.total_price}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    📅 {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
