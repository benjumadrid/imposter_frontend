const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/favoritesController");

// Add a book to favorites
router.post("/add", favoritesController.addFavorite);

// Remove a book from favorites
router.delete("/remove", favoritesController.removeFavorite);

// Get all favorites for a user
router.get("/user/:user_id", favoritesController.getFavoritesByUser);

module.exports = router;
