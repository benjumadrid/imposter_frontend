import express from "express";
import * as buyingItemsController from "../controllers/buyingItemsController.js";

const router = express.Router();

// ✅ RESTful routes
router.get("/", buyingItemsController.getAllItems);       // GET /api/items
router.get("/search", buyingItemsController.getItemsByName); // GET /api/items/search
router.post("/create", buyingItemsController.createItem);    // POST /api/items/create
router.put("/update/:id", buyingItemsController.updateItem); // PUT /api/items/update/:id
router.delete("/delete/:id", buyingItemsController.deleteItem); // DELETE /api/items/delete/:id

export default router;
