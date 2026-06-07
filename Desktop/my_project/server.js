import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loanRoutes from "./routes/loanRoutes.js";
import userRoutes from "./routes/users.js";
import buyingItemsRoutes from "./routes/buyingItems.js";
import salesRoutes from "./routes/sales.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/loans", loanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", buyingItemsRoutes);
app.use("/api/sales", salesRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Loan Management API is running successfully!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
