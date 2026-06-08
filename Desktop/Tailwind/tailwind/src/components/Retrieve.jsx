// src/pages/Retrieve.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Image from "../assets/benju.jpg";

export default function Retrieve() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ book_name: "", book_id: "", quantity: "", price: "" });
  const [error, setError] = useState("");
  const [bookSuggestions, setBookSuggestions] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders/all/${user.id}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        No user info found. Please log in.
      </p>
    );
  }

  // Check if order is within 30 minutes
  const isWithin30Minutes = (orderDate) => {
    const ordered = new Date(orderDate);
    const now = new Date();
    const diffMs = now - ordered;
    const diffMins = diffMs / (1000 * 60);
    return diffMins <= 30;
  };

  // Get remaining minutes
  const getRemainingMinutes = (orderDate) => {
    const ordered = new Date(orderDate);
    const now = new Date();
    const diffMs = now - ordered;
    const diffMins = diffMs / (1000 * 60);
    return Math.max(0, Math.ceil(30 - diffMins));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "book_name") {
      // Only suggest books ordered within 30 minutes
      const suggestions = orders
        .filter(
          (o) =>
            o.book_name.toLowerCase().includes(value.toLowerCase()) &&
            isWithin30Minutes(o.order_date)
        )
        .map((o) => o.book_name);
      setBookSuggestions([...new Set(suggestions)]);
    }
  };

  const handleSelectSuggestion = (name) => {
    const selected = orders.find((o) => o.book_name === name);
    if (selected) {
      setForm({
        book_name: selected.book_name,
        book_id: selected.book_id,
        quantity: selected.quantity,
        price: selected.total_price,
      });
      setBookSuggestions([]);
    }
  };

  const handleRetrieve = async () => {
    setError("");
    const qty = Number(form.quantity);

    if (!form.book_name || !form.book_id || !qty || qty <= 0) {
      return setError("❌ Please fill Book Name, Book ID, and a valid Quantity.");
    }

    const matchingOrder = orders.find(
      (o) =>
        o.book_name.toLowerCase() === form.book_name.toLowerCase() &&
        String(o.book_id) === String(form.book_id)
    );

    if (!matchingOrder) {
      return setError("❌ This book was not ordered before.");
    }

    // 30-minute check
    if (!isWithin30Minutes(matchingOrder.order_date)) {
      return setError("❌ Retrieval window has expired. You can only retrieve within 30 minutes of ordering.");
    }

    if (qty > Number(matchingOrder.quantity)) {
      return setError(`❌ You can only retrieve 1 to ${matchingOrder.quantity} of this book.`);
    }

    try {
      // Increment stock
      const incrementRes = await fetch(`http://localhost:3000/api/books/${form.book_id}/increment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increaseBy: qty }),
      });

      if (!incrementRes.ok) {
        const text = await incrementRes.text();
        return setError(`❌ Error incrementing stock: ${text}`);
      }

      // Delete order
      const deleteRes = await fetch(`http://localhost:3000/api/orders/delete/order/${form.book_id}`, {
        method: "DELETE",
      });

      if (!deleteRes.ok) {
        const text = await deleteRes.text();
        return setError(`❌ Error deleting order: ${text}`);
      }

      navigate("/retrieve/confirmation", {
        state: {
          user,
          book: matchingOrder.book_name,
          book_id: matchingOrder.book_id,
          quantity: qty,
          price: matchingOrder.total_price,
        },
      });
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong. Try again.");
    }
  };

  // Separate orders into retrievable and expired
  const retrievableOrders = orders.filter((o) => isWithin30Minutes(o.order_date));
  const expiredOrders = orders.filter((o) => !isWithin30Minutes(o.order_date));

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
      <div className="max-w-7xl mx-auto bg-white/85 backdrop-blur-md rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Retrieve Books</h1>
        <p className="text-gray-500 mb-6 text-sm">
          You can only retrieve a book within <span className="font-semibold text-red-500">30 minutes</span> of placing the order.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Book Name</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((o) => {
                    const canRetrieve = isWithin30Minutes(o.order_date);
                    const remaining = getRemainingMinutes(o.order_date);
                    return (
                      <tr
                        key={o.order_id}
                        className={`text-center border-t ${
                          canRetrieve ? "bg-green-50" : "bg-red-50 opacity-60"
                        }`}
                      >
                        <td className="px-4 py-2">{o.order_id}</td>
                        <td className="px-4 py-2 text-left">{o.book_name}</td>
                        <td className="px-4 py-2">{o.quantity}</td>
                        <td className="px-4 py-2">${o.total_price}</td>
                        <td className="px-4 py-2">{new Date(o.order_date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          {canRetrieve ? (
                            <span className="text-green-600 font-semibold text-xs">
                              ✅ {remaining}m left
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold text-xs">
                              ❌ Expired
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {retrievableOrders.length === 0 && orders.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                ⏰ All your orders have passed the 30-minute retrieval window.
              </div>
            )}
          </div>

          {/* Retrieval Form */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Retrieve Form</h2>
            <p className="text-xs text-gray-400 -mt-2">
              Only books ordered within the last 30 minutes can be retrieved.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                name="book_name"
                placeholder="Book Name"
                value={form.book_name}
                onChange={handleChange}
                className="border p-3 rounded-lg w-full"
                autoComplete="off"
              />
              {bookSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full border bg-white rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                  {bookSuggestions.map((name, idx) => (
                    <li
                      key={idx}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSelectSuggestion(name)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="number"
              name="book_id"
              placeholder="Book ID"
              value={form.book_id}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <button
              onClick={handleRetrieve}
              disabled={retrievableOrders.length === 0}
              className={`py-3 rounded-lg font-semibold text-white transition ${
                retrievableOrders.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Retrieve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}