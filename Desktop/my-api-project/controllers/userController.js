const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.getUsersDb = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getUserByIdDb = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getUserTest = async (req, res) => {
  try {
    const { name } = req.query;
    const [rows] = await db.query("SELECT * FROM users WHERE name = ?", [name]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.createUserDb = async (req, res) => {
  try {
    const { name, profession, phone, password } = req.body;

    if (!name || !profession || !phone || !password) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, profession, phone, password) VALUES (?, ?, ?, ?)",
      [name, profession, phone, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateUserDb = async (req, res) => {
  const { id } = req.params;
  const { name, profession, phone, password } = req.body;

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await db.query(
      `UPDATE users 
       SET 
         name = COALESCE(?, name),
         profession = COALESCE(?, profession),
         phone = COALESCE(?, phone),
         password = COALESCE(?, password)
       WHERE id = ?`,
      [name ?? null, profession ?? null, phone ?? null, hashedPassword, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUserDb = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      "your_jwt_secret",
      { expiresIn: "365d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        profession: user.profession,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};