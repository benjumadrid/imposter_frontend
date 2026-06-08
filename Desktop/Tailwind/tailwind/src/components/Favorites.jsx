// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Favorites() {
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/favorites/user/${user.id}`);
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        No user info found. Please log in.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        {user.name}'s ur Favorite Books
      </h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">You have no favorite books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <Link
              key={book.book_id}
              to={`/books/${book.book_id}`}
              state={{ user }}
              className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <img
                src={`http://localhost:3000${book.cover_image}`}
                alt={book.book_name}
                className="w-full h-48 object-cover" // ✅ smaller uniform height
              />
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {book.book_name}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>

               
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
