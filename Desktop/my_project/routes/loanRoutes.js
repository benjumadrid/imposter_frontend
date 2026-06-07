import express from "express";
import {
  addLoan,
  getAllLoans,
  getLoansByItem,
  getLoansByCustomer,
  updateLoan,
  markLoanAsPaid,
  deleteLoan,
  deleteAllLoans,
} from "../controllers/loanController.js";

const router = express.Router();

router.post("/add", addLoan);
router.get("/all", getAllLoans);
router.get("/item/:item_name", getLoansByItem);
router.get("/customer/:customer_name", getLoansByCustomer);
router.put("/:id", updateLoan);
router.patch("/:id/paid", markLoanAsPaid); // ✅ kept as PATCH /:id/paid
router.delete("/:id", deleteLoan);
router.delete("/all/delete", deleteAllLoans);

export default router;