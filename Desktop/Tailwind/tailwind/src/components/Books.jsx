import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Books() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/books/find");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  const handleCheckboxChange = (bookId, checked) => {
    if (checked) {
      const book = books.find((b) => b.book_id === bookId);
      setSelectedBooks({
        ...selectedBooks,
        [bookId]: { quantity: 1, totalPrice: Number(book.price) },
      });
    } else {
      const copy = { ...selectedBooks };
      delete copy[bookId];
      setSelectedBooks(copy);
    }
  };

  const handleQuantityChange = (bookId, quantity) => {
    const book = books.find((b) => b.book_id === bookId);
    const maxQuantity = book.stock_quantity;
    if (quantity > maxQuantity) quantity = maxQuantity;
    if (quantity < 1) quantity = 1;
    setSelectedBooks({
      ...selectedBooks,
      [bookId]: { quantity, totalPrice: book.price * quantity },
    });
  };

  const selectedArray = Object.entries(selectedBooks).map(([id, info]) => {
    const book = books.find((b) => b.book_id === Number(id));
    return {
      bookId: book.book_id,
      bookName: book.book_name,
      quantity: info.quantity,
      totalPrice: info.totalPrice,
    };
  });

  const grandTotal = selectedArray.reduce((sum, item) => sum + item.totalPrice, 0);

  const filteredBooks = books.filter((book) =>
    book.book_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleGetBooks = async () => {
    if (selectedArray.length === 0) return alert("Select at least one book!");
    try {
      const items = selectedArray.map((item) => ({
        book_id: item.bookId,
        quantity: item.quantity,
      }));
      const res = await fetch("http://localhost:3000/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, items }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to place order");
      navigate("/order-confirmation", { state: { user, selectedArray, orderIds: data.orderIds } });
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">📚 Bookstore</h1>
          <p className="text-gray-400 mt-1">
            Welcome back, <span className="text-emerald-400 font-semibold">{user?.name}</span>
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Book Table */}
        <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                  <th className="px-5 py-4 text-left">Select</th>
                  <th className="px-5 py-4 text-left">Book Name</th>
                  <th className="px-5 py-4 text-left">Price</th>
                  <th className="px-5 py-4 text-center">Qty</th>
                  <th className="px-5 py-4 text-center">Total</th>
                  <th className="px-5 py-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => {
                    const selected = selectedBooks[book.book_id];
                    return (
                      <tr
                        key={book.book_id}
                        className={`transition duration-150 hover:bg-gray-800 ${
                          selected ? "bg-emerald-950/40" : ""
                        }`}
                      >
                        <td className="px-5 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={(e) => handleCheckboxChange(book.book_id, e.target.checked)}
                            className="w-4 h-4 accent-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3 font-medium text-white">{book.book_name}</td>
                        <td className="px-5 py-3 text-emerald-400 font-semibold">${book.price}</td>
                        <td className="px-5 py-3 text-center">
                          {selected ? (
                            <input
                              type="number"
                              min="1"
                              max={book.stock_quantity}
                              value={selected.quantity}
                              onChange={(e) =>
                                handleQuantityChange(book.book_id, Number(e.target.value))
                              }
                              className="w-14 bg-gray-700 border border-gray-600 text-white text-center rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center text-white font-semibold">
                          {selected ? (
                            <span className="text-emerald-300">${selected.totalPrice}</span>
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() =>
                              navigate(`/books/${book.book_id}`, { state: { user } })
                            }
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        {selectedArray.length > 0 && (
          <div className="w-full lg:w-80 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-5 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3">
              🛒 Your Order
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedArray.map((item) => (
                <div
                  key={item.bookId}
                  className="flex items-start justify-between bg-gray-800 rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-semibold text-white truncate">{item.bookName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">${item.totalPrice}</p>
                  </div>
                  <button
                    onClick={() => {
                      const copy = { ...selectedBooks };
                      delete copy[item.bookId];
                      setSelectedBooks(copy);
                    }}
                    className="text-gray-500 hover:text-red-400 transition text-lg leading-none mt-0.5"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-sm mb-1 text-gray-400">
                <span>Items</span>
                <span>{selectedArray.length}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-base">
                <span>Grand Total</span>
                <span className="text-emerald-400">${grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleGetBooks}
              className="mt-5 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition text-sm shadow-lg shadow-emerald-900/40"
            >
              ✅ Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}