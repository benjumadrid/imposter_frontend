const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure images folder exists
const uploadDir = path.join(__dirname, '../images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware for single image upload
const uploadImage = upload.single('cover_image');
// Get all books
const getAllBooks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No books found' });
    }
    res.json(rows);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

// Get a single book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE book_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ message: 'Error fetching book' });
  }
};

// Create a new book

const createBook = async (req, res) => {
  const {
    book_name,
    author,
    price,
    published_date,
    genre,
    publisher,
    stock_quantity,
  } = req.body;

  const cover_image = req.file ? `/${req.file.filename}` : null;

  if (!book_name || !author || !price || !published_date) {
    return res.status(400).json({
      message: 'Book name, author, price, and published date are required',
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO books 
        (book_name, author, price, published_date, genre, publisher, stock_quantity, cover_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [book_name, author, price, published_date, genre, publisher, stock_quantity, cover_image]
    );

    res.status(201).json({
      message: 'Book created successfully',
      book_id: result.insertId,
    });
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Error creating book' });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;

  // fallback empty object so destructure won't crash
  const {
    book_name,
    author,
    price,
    published_date,
    genre,
    publisher,
    stock_quantity,
  } = req.body || {};

  // If new file uploaded, replace image
  const cover_image = req.file ? `/uploads/${req.file.filename}` : req.body?.cover_image;

  try {
    const [result] = await db.query(
      `UPDATE books
       SET 
         book_name = COALESCE(?, book_name),
         author = COALESCE(?, author),
         price = COALESCE(?, price),
         published_date = COALESCE(?, published_date),
         genre = COALESCE(?, genre),
         publisher = COALESCE(?, publisher),
         stock_quantity = COALESCE(?, stock_quantity),
         cover_image = COALESCE(?, cover_image)
       WHERE book_id = ?`,
      [book_name, author, price, published_date, genre, publisher, stock_quantity, cover_image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Error updating book" });
  }
};


// Delete a book by ID
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM books WHERE book_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Error deleting book' });
  }
};
// Increment stock only
const incrementStock = async (req, res) => {
  const { id } = req.params;
  const { increaseBy } = req.body;

  if (!increaseBy || isNaN(increaseBy)) {
    return res.status(400).json({ message: "increaseBy must be a number" });
  }

  try {
    const [result] = await db.query(
      "UPDATE books SET stock_quantity = stock_quantity + ? WHERE book_id = ?",
      [increaseBy, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Stock incremented successfully" });
  } catch (err) {
    console.error("Error incrementing stock:", err);
    res.status(500).json({ message: "Error updating stock" });
  }
};






module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  incrementStock
};
