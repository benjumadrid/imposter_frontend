import db from "../db.js";

// ✅ Get all sales
export const getAllSales = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sales ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ message: "Error fetching sales" });
  }
};

// ✅ Get sale by ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM sales WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Sale not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching sale:", err);
    res.status(500).json({ message: "Error fetching sale" });
  }
};

// ✅ Search sales by name
export const getSalesByName = async (req, res) => {
  try {
    const search = req.query.name || "";
    const [rows] = await db.query(
      "SELECT * FROM sales WHERE LOWER(item_name) LIKE LOWER(?)",
      [`%${search}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error searching sales:", err);
    res.status(500).json({ message: "Error searching sales" });
  }
};

// ✅ Create Sale
export const createSale = async (req, res) => {
  try {
    const { item_name, quantity_sold, selling_price, notes, sale_date } = req.body;
    const qtyToSell = parseFloat(quantity_sold);

    if (isNaN(qtyToSell) || qtyToSell <= 0)
      return res.status(400).json({ message: "Invalid quantity value." });

    // Fetch item
    const [items] = await db.query(
      "SELECT * FROM buying_items WHERE LOWER(item_name) = LOWER(?)",
      [item_name]
    );

    if (!items.length)
      return res.status(404).json({ message: `Item '${item_name}' not found in stock.` });

    const item = items[0];
    const isKg = item.measurement_type === "kg";

    if (qtyToSell > item.stock_units) {
      return res.status(400).json({
        message: `Not enough stock. Available: ${item.stock_units} ${isKg ? "kg" : "units"}, requested: ${qtyToSell}`,
      });
    }

    const newStockUnits = parseFloat((item.stock_units - qtyToSell).toFixed(3));

    let newQuantityAvailable;
    let newUnitPerPocket;

    if (isKg) {
      // ✅ kg: quantity_available tracks kg directly, unit_per_pocket stays 1
      newQuantityAvailable = newStockUnits;
      newUnitPerPocket = 1;
    } else {
      // ✅ pocket: recalculate how many full pockets remain
      newUnitPerPocket = newStockUnits === 0 ? 0 : item.unit_per_pocket;
      newQuantityAvailable =
        newStockUnits === 0
          ? 0
          : Math.floor(newStockUnits / item.unit_per_pocket);
    }

    // Insert sale
    await db.query(
      "INSERT INTO sales (item_name, quantity_sold, selling_price, notes, sale_date) VALUES (?, ?, ?, ?, ?)",
      [item_name, qtyToSell, selling_price, notes || "", sale_date]
    );

    // Update stock
    await db.query(
      "UPDATE buying_items SET stock_units=?, quantity_available=?, unit_per_pocket=? WHERE LOWER(item_name) = LOWER(?)",
      [newStockUnits, newQuantityAvailable, newUnitPerPocket, item_name]
    );

    res.json({
      message: "✅ Sale recorded successfully",
      measurement_type: item.measurement_type,
      remaining_stock_units: newStockUnits,
      remaining_quantity_available: newQuantityAvailable,
      unit_per_pocket: newUnitPerPocket,
    });

  } catch (err) {
    console.error("Error creating sale:", err);
    res.status(500).json({ message: "Error creating sale" });
  }
};

// ✅ Update sale
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity_sold, selling_price, notes } = req.body;

    const [result] = await db.query(
      "UPDATE sales SET quantity_sold=?, selling_price=?, notes=? WHERE id=?",
      [quantity_sold, selling_price, notes, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Sale not found" });

    res.json({ message: "✅ Sale updated successfully" });
  } catch (err) {
    console.error("Error updating sale:", err);
    res.status(500).json({ message: "Error updating sale" });
  }
};

// ✅ Delete sale
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM sales WHERE id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Sale not found" });

    res.json({ message: "✅ Sale deleted successfully" });
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(500).json({ message: "Error deleting sale" });
  }
};