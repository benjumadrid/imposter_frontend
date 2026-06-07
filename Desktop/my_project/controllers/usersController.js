import db from "../db.js";

// ✅ Create user
export const createUser = async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    if (!username || !password || !phone)
      return res.status(400).json({ message: "username, password and phone are required" });

    const [result] = await db.query(
      "INSERT INTO users (username, password, phone) VALUES (?, ?, ?)",
      [username, password, phone]
    );

    res.status(201).json({ message: "User created ✅", userId: result.insertId });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    const [result] = await db.query(
      "UPDATE users SET username = ?, password = ?, phone = ? WHERE id = ?",
      [username, password, phone, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated ✅" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted ❌" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ message: "phone and password are required" });

    const [rows] = await db.query(
      "SELECT * FROM users WHERE phone = ? AND password = ?",
      [phone, password]
    );

    if (!rows.length) return res.status(401).json({ message: "Invalid phone or password ❌" });

    res.json({
      message: "Login successful ✅",
      user: { id: rows[0].id, username: rows[0].username, phone: rows[0].phone },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Database error" });
  }
};
