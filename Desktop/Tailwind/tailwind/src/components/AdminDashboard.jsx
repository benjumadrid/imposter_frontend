import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // clear old user
    navigate("/"); // send back to login page
  };

  if (!stats) return <p className="text-center mt-10">Loading stats...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-10">
        <motion.h1
          className="text-4xl font-extrabold text-[#E6007E]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          className="bg-gradient-to-r from-pink-500 to-pink-700 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
        </motion.div>
      </div>

      {/* Most Favorited Books */}
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        📚 Most Favorited Books
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.mostFavoritedBooks.map((book, index) => (
          <motion.div
            key={book.book_id}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <p className="font-semibold text-lg text-[#E6007E]">
              {book.book_name}
            </p>
            <p className="text-gray-600">
              ❤️ Favorites: {book.favorites_count}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Best Selling Authors */}
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ✍️ Best Selling Authors
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.bestSellingAuthors.map((author, index) => (
          <motion.div
            key={author.author}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <p className="font-semibold text-lg text-purple-700">
              {author.author}
            </p>
            <p className="text-gray-600">📈 Sales: {author.sales_count}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
