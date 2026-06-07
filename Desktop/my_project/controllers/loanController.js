import db from "../db.js";

// ➕ Add new loan (with inventory check + stock deduction)
export const addLoan = async (req, res) => {
  try {
    const { customer_name, customer_phone, item_name, amount, due_date, quantity } = req.body;
    if (!customer_name || !customer_phone || !item_name || !amount || !due_date || !quantity)
      return res.status(400).json({ message: "All fields are required" });

    const [items] = await db.query(
      "SELECT * FROM buying_items WHERE LOWER(item_name) = LOWER(?)",
      [item_name]
    );

    if (items.length === 0)
      return res.status(404).json({ message: "❌ Item not found in inventory!" });

    const item = items[0];
    const isKg = item.measurement_type === "kg";
    const qtyToLoan = parseFloat(quantity);

    if (qtyToLoan > item.stock_units)
      return res.status(400).json({
        message: `❌ Not enough stock! Only ${item.stock_units} ${isKg ? "kg" : "units"} available.`,
      });

    const newStockUnits = parseFloat((item.stock_units - qtyToLoan).toFixed(3));

    let newQuantityAvailable;
    let newUnitPerPocket;

    if (isKg) {
      newQuantityAvailable = newStockUnits;
      newUnitPerPocket = 1;
    } else {
      newUnitPerPocket = newStockUnits === 0 ? 0 : item.unit_per_pocket;
      newQuantityAvailable =
        newStockUnits === 0 ? 0 : Math.floor(newStockUnits / item.unit_per_pocket);
    }

    await db.query(
      "UPDATE buying_items SET stock_units=?, quantity_available=?, unit_per_pocket=? WHERE LOWER(item_name) = LOWER(?)",
      [newStockUnits, newQuantityAvailable, newUnitPerPocket, item_name]
    );

    const [result] = await db.query(
      `INSERT INTO loan (customer_name, customer_phone, item_name, quantity, amount, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_name, customer_phone, item_name, qtyToLoan, amount, due_date]
    );

    res.status(201).json({
      message: "✅ Loan added successfully!",
      loanId: result.insertId,
      remaining_stock: newStockUnits,
    });
  } catch (err) {
    console.error("❌ Error adding loan:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// 📋 Get all loans
export const getAllLoans = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM loan ORDER BY created_at DESC");
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching loans:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// 🔍 Get loans by item name
export const getLoansByItem = async (req, res) => {
  try {
    const { item_name } = req.params;
    const [results] = await db.query(
      "SELECT * FROM loan WHERE item_name = ? ORDER BY created_at DESC",
      [item_name]
    );
    if (!results.length)
      return res.status(404).json({ message: "No loans found for this item." });
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching loans by item:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// 🔍 Get loans by customer name
export const getLoansByCustomer = async (req, res) => {
  try {
    const { customer_name } = req.params;
    const [results] = await db.query(
      "SELECT * FROM loan WHERE customer_name = ? ORDER BY created_at DESC",
      [customer_name]
    );
    if (!results.length)
      return res.status(404).json({ message: "No loans found for this customer." });
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error fetching loans by customer:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✏️ Update loan by ID
export const updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, customer_phone, item_name, quantity, amount, due_date, status } = req.body;

    const [result] = await db.query(
      `UPDATE loan SET customer_name=?, customer_phone=?, item_name=?, quantity=?, amount=?, due_date=?, status=? WHERE id=?`,
      [customer_name, customer_phone, item_name, quantity, amount, due_date, status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "No loan found with this ID." });

    res.status(200).json({ message: "✏️ Loan updated successfully!" });
  } catch (err) {
    console.error("❌ Error updating loan:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ✅ Mark loan as paid — auto creates a sale record
export const markLoanAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const [loans] = await db.query("SELECT * FROM loan WHERE id=?", [id]);
    if (!loans.length)
      return res.status(404).json({ message: "No loan found with this ID." });

    const loan = loans[0];

    // ✅ Insert into sales table
    await db.query(
      `INSERT INTO sales (item_name, quantity_sold, selling_price, notes, sale_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        loan.item_name,
        loan.quantity,
        loan.amount,
        `Loan repayment — ${loan.customer_name} (${loan.customer_phone})`,
        new Date().toISOString().slice(0, 10),
      ]
    );

    // ✅ Mark as paid
    await db.query("UPDATE loan SET status='paid' WHERE id=?", [id]);

    res.status(200).json({ message: "✅ Loan marked as paid and recorded as sale!" });
  } catch (err) {
    console.error("❌ Error updating loan status:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// 🗑️ Delete loan by ID
export const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM loan WHERE id=?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "No loan found with this ID." });
    res.status(200).json({ message: "🗑️ Loan deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting loan:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// ⚠️ Delete all loans
export const deleteAllLoans = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM loan");
    res.status(200).json({
      message: `🧹 All (${result.affectedRows}) loans deleted successfully!`,
    });
  } catch (err) {
    console.error("❌ Error deleting all loans:", err);
    res.status(500).json({ message: "Database error" });
  }
};