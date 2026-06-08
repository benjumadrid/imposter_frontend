const db = require("../db");

// 📊 Get all admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    // Total users
    const [[{ totalUsers }]] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    // Total orders
    const [[{ totalOrders }]] = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders"
    );

    // Most favorited books
    const [mostFavoritedBooks] = await db.query(`
      SELECT b.book_id, b.book_name, b.author, COUNT(f.book_id) AS favorites_count
      FROM favorites f
      JOIN books b ON f.book_id = b.book_id
      GROUP BY f.book_id
      ORDER BY favorites_count DESC
      LIMIT 5
    `);

    // Best-selling authors (based on orders)
    const [bestSellingAuthors] = await db.query(`
      SELECT b.author, SUM(o.quantity) AS sales_count
      FROM orders o
      JOIN books b ON o.book_id = b.book_id
      GROUP BY b.author
      ORDER BY sales_count DESC
      LIMIT 5
    `);

    res.json({
      totalUsers,
      totalOrders,
      mostFavoritedBooks,
      bestSellingAuthors,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Database error" });
  }
};
