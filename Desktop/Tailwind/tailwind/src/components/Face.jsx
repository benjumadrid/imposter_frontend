import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const trendingBooks = [
  { id: 1, title: "The Great Gatsby", cover: "https://picsum.photos/200/300?random=1", tag: "Classic" },
  { id: 2, title: "1984", cover: "https://picsum.photos/200/300?random=2", tag: "Dystopian" },
  { id: 3, title: "To Kill a Mockingbird", cover: "https://picsum.photos/200/300?random=3", tag: "Drama" },
];

const recommendedBooks = [
  { id: 4, title: "Pride and Prejudice", cover: "https://picsum.photos/200/300?random=4", tag: "Romance" },
  { id: 5, title: "Moby Dick", cover: "https://picsum.photos/200/300?random=5", tag: "Adventure" },
  { id: 6, title: "The Catcher in the Rye", cover: "https://picsum.photos/200/300?random=6", tag: "Classic" },
];

const features = [
  { id: 1, title: "Fast Search", desc: "Find your favorite books in seconds.", icon: "🔍", color: "bg-yellow-400" },
  { id: 2, title: "Track Favorites", desc: "Save and organize books you love.", icon: "❤️", color: "bg-pink-400" },
  { id: 3, title: "Secure", desc: "Your data and preferences are protected.", icon: "🔒", color: "bg-indigo-400" },
  { id: 4, title: "Top Authors", desc: "Discover books from the best authors.", icon: "✍️", color: "bg-green-400" },
  { id: 5, title: "Community", desc: "Share and see what others are reading.", icon: "👥", color: "bg-red-400" },
];

export default function Face() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-yellow-600 to-purple-700 text-white overflow-y-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between items-center"
      >
        <div className="text-center sm:text-left mb-6 sm:mb-0">
          <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">Kiot Book System 📚</h1>
          <p className="text-xl text-gray-200 font-semibold drop-shadow-sm">
            Explore, track, and manage your favorite books with ease.
          </p>
        </div>

        <div className="flex gap-4">
          {/* ✅ Navigate to Find.jsx */}
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-2xl text-white font-semibold bg-gray-800 shadow-lg hover:bg-gray-700 transition transform"
          >
            Login
          </button>
          {/* ✅ Navigate to Register.jsx */}
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 rounded-2xl text-gray-900 font-semibold bg-yellow-400 shadow-lg hover:bg-yellow-300 transition transform"
          >
            Register
          </button>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6"
      >
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`rounded-2xl p-6 text-center shadow-lg transform hover:scale-105 transition ${feature.color}`}
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-900 text-sm">{feature.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Trending Books */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-6xl mx-auto px-6 pb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Trending Books</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingBooks.map((book) => (
            <div key={book.id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition relative">
              <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-full shadow">{book.tag}</span>
              <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-white font-semibold text-lg">{book.title}</h2>
                <p className="text-gray-300 text-sm mt-1">Author: Unknown</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Books */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-6xl mx-auto px-6 pb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recommendedBooks.map((book) => (
            <div key={book.id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition relative">
              <span className="absolute top-3 left-3 bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">{book.tag}</span>
              <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-white font-semibold text-lg">{book.title}</h2>
                <p className="text-gray-300 text-sm mt-1">Author: Unknown</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
