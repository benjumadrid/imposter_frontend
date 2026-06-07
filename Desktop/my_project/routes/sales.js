import express from "express";
import * as salesController from "../controllers/salesController.js";

const router = express.Router();

// RESTful routes
router.get("/", salesController.getAllSales);             // GET /api/sales
router.get("/search", salesController.getSalesByName);    // GET /api/sales/search?name=...
router.get("/:id", salesController.getSaleById);          // GET /api/sales/:id
router.post("/create", salesController.createSale);       // POST /api/sales/create
router.put("/update/:id", salesController.updateSale);    // PUT /api/sales/update/:id
router.delete("/delete/:id", salesController.deleteSale); // DELETE /api/sales/delete/:id

export default router;