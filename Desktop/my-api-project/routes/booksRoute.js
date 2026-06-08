const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const multer = require('multer');

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where images are saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post('/insert', upload.single('cover_image'), booksController.createBook);
router.get('/find', booksController.getAllBooks);
router.get('/find/:id', booksController.getBookById);

// ✅ Add multer here so updating image works
router.put('/:id', upload.single('cover_image'), booksController.updateBook);

router.delete('/remove/:id', booksController.deleteBook);
router.put('/:id/increment', booksController.incrementStock);

module.exports = router;
