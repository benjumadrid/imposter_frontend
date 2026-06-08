import { useState } from "react";
import axios from "axios";

function FavoriteButton({ user, book }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    try {
      if (!isFavorite) {
        // Use full backend URL
        await axios.post("http://localhost:3000/api/favorites/add", {
          user_id: user.id,
          book_id: book.book_id,
        });
        setIsFavorite(true);
      } else {
        await axios.delete("http://localhost:3000/api/favorites/remove", {
          data: { user_id: user.id, book_id: book.book_id },
        });
        setIsFavorite(false);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      alert("Failed to update favorites");
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
    >
      {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
    </button>
  );
}

export default FavoriteButton;
