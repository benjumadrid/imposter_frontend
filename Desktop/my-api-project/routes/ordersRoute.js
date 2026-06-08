const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.post("/add", ordersController.createOrder);
router.get("/all", ordersController.getOrders);
router.get("/all/:user_id", ordersController.getOrdersByUser);
router.delete("/delete/:id", ordersController.deleteAllOrdersByUser); // all orders for user
router.delete("/delete/order/:id", ordersController.deleteOrder);      // single order

module.exports = router;
