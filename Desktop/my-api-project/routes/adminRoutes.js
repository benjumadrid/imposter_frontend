const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Get all admin dashboard stats
router.get("/stats", adminController.getAdminStats);

module.exports = router;
