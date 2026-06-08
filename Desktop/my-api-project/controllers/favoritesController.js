const db = require("../db");

// Add a favorite
exports.addFavorite = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) {
      return res.status(400).json({ message: "user_id and book_id are required" });
    }

    await db.query(
      "INSERT INTO favorites (user_id, book_id) VALUES (?, ?)",
      [user_id, book_id]
    );
    res.status(201).json({ message: "Book added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// Remove a favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) {
      return res.status(400).json({ message: "user_id and book_id are required" });
    }

    const [result] = await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND book_id = ?",
      [user_id, book_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Book removed from favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// controllers/favoritesController.js

exports.getFavoritesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [rows] = await db.query(
      `SELECT f.book_id,
              b.book_name,
              b.author,
              b.genre,
              b.publisher,
              b.published_date,
              b.price,
              b.stock_quantity,
              b.cover_image
       FROM favorites f
       JOIN books b ON f.book_id = b.book_id
       WHERE f.user_id = ?`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};


