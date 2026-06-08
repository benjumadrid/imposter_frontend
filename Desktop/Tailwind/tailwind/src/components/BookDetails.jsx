// src/pages/BookDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteButton from "../components/FavoriteButton";
import pppImage from "../assets/ppp.jpg";
import theHobbitImg from "../assets/hhh.jpg";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/books/find/${id}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      const data = await res.json();
      setBook(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching book details");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        No user info found. Please log in.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center mt-10">Loading book details...</p>;
  }

  if (!book) {
    return <p className="text-center mt-10 text-red-500">Book not found.</p>;
  }

  const idNum = Number(book.book_id);

  const coverSrc =
    idNum === 1
      ? pppImage
      : idNum === 2
      ? "http://localhost:3000/uploads/1757358566633-811226148-To Kill A Mockingbird ~ Harper Lee.jpg"
      : idNum === 3
      ? "http://localhost:3000/uploads/1757358841866-31505819-1984.jpg"
      : idNum === 5
      ? "http://localhost:3000/uploads/1757359526289-757170258-Moby-Dick by Herman Melville (1).jpg"
      : idNum === 6
      ? "http://localhost:3000/uploads/1757354320487-36670393-download (15).jpg"
      : idNum === 7
      ? "http://localhost:3000/uploads/1757359830760-98684601-The Catcher in the Rye.jpg"
      : idNum === 8
      ? "http://localhost:3000/uploads/1757360056203-969150439-The Lord of the Rings.jpg"
      : idNum === 10
      ? theHobbitImg
      : book.cover_image
      ? (book.cover_image.startsWith("http")
          ? book.cover_image
          : `http://localhost:3000${book.cover_image}`)
      : `https://via.placeholder.com/250x350?text=${encodeURIComponent(book.book_name)}`;

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <ToastContainer position="top-right" autoClose={2000} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6"
      >
        <img
          src={coverSrc}
          alt={book.book_name}
          className="w-full md:w-64 rounded-2xl object-cover shadow-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/250x350?text=${encodeURIComponent(book.book_name)}`;
          }}
        />

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{book.book_name}</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Author:</span> {book.author}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Genre:</span> {book.genre}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Publisher:</span> {book.publisher}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Published Date:</span>{" "}
              {new Date(book.published_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Stock:</span> {book.stock_quantity}
            </p>
            <p className="text-gray-800 text-lg md:text-xl font-bold mt-4">
              Price: ${book.price}
            </p>
          </div>

          <div className="mt-6 flex gap-2">
            <FavoriteButton user={user} book={book} className="px-2 py-1 text-sm rounded-md" />
            <button
              onClick={() => navigate("/books", { state: { user } })}
              className="px-2 py-1 text-sm rounded-md bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              Back to Books
            </button>
            <button
              onClick={() => navigate("/favorites", { state: { user } })}
              className="px-2 py-1 text-sm rounded-md bg-pink-500 text-white hover:bg-pink-600 transition"
            >
              View My Favorites
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}