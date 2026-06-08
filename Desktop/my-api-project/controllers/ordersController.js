const db = require('../db');

// 1️⃣ Create a new order (multiple books for one user)
const createOrder = async (req, res) => {
  const { user_id, items } = req.body; // user_id and an array of items [{book_id, quantity}, ...]

  try {
    // Check if user exists
    const [userRows] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let orderIds = [];

    for (let item of items) {
      const { book_id, quantity } = item;

      // Check if book exists
      const [bookRows] = await db.query(
        'SELECT price, stock_quantity FROM books WHERE book_id = ?',
        [book_id]
      );
      if (bookRows.length === 0) {
        return res.status(404).json({ message: `Book ${book_id} not found` });
      }

      const book = bookRows[0];

      // Check stock
      if (book.stock_quantity < quantity) {
        return res.status(400).json({ message: `Not enough stock for book ${book_id}` });
      }

      // Calculate total price (ensure numeric)
      const total_price = Number(book.price) * quantity;

      // Insert order
      const [result] = await db.query(
        'INSERT INTO orders (user_id, book_id, quantity, total_price) VALUES (?, ?, ?, ?)',
        [user_id, book_id, quantity, total_price]
      );

      orderIds.push(result.insertId);

      // Update stock
      await db.query(
        'UPDATE books SET stock_quantity = stock_quantity - ? WHERE book_id = ?',
        [quantity, book_id]
      );
    }

    res.status(201).json({
      message: "Order(s) created successfully",
      orderIds
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// 2️⃣ Get all orders (with buyer + book names)
const getOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id AS order_id,
        u.name AS buyer_name,
        b.book_name,
        b.book_id,
        o.quantity,
        o.total_price,
        o.order_date
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN books b ON o.book_id = b.book_id
      ORDER BY o.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// 3️⃣ Get orders by one user
const getOrdersByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        o.id AS order_id,
        u.name AS buyer_name,
        b.book_name,
        b.book_id,
        o.quantity,
        o.total_price,
        o.order_date
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN books b ON o.book_id = b.book_id
      WHERE u.id = ?
      ORDER BY o.id DESC
    `, [user_id]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user orders" });
  }
};

const deleteAllOrdersByUser = async (req, res) => {
  try {
    const id = req.params.id; // corrected

    const [result] = await db.query("DELETE FROM orders WHERE user_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json({ message: "All orders deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Delete a single order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params; // order ID from route
    const [result] = await db.query("DELETE FROM orders WHERE book_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByUser,
  deleteAllOrdersByUser,
  deleteOrder
};
