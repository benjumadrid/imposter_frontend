import db from "../db.js";

// ✅ Get all items
export const getAllItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM buying_items ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Error fetching items" });
  }
};

// ✅ Get items by name (search)
export const getItemsByName = async (req, res) => {
  try {
    const search = req.query.name || "";
    const [rows] = await db.query(
      "SELECT * FROM buying_items WHERE LOWER(item_name) LIKE LOWER(?)",
      [`%${search}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error searching items:", err);
    res.status(500).json({ message: "Error searching items" });
  }
};

// ✅ Create new buying item
export const createItem = async (req, res) => {
  try {
    const {
      item_name,
      measurement_type = "pocket",
      quantity,
      unit_per_pocket,
      price_per_unit, // ✅ price per unit/kg from frontend
      price,          // ✅ total price (qty × price_per_unit), calculated by frontend
      taxi_fee,
      notes,
      purchased_date,
    } = req.body;

    const qty = parseFloat(quantity) || 0;
    const perUnit = parseFloat(price_per_unit) || 0;
    const taxi = parseFloat(taxi_fee) || 0;

    // ✅ total = qty × perUnit + taxi
    const total_price = (qty * perUnit) + taxi;

    const unitPocket = measurement_type === "kg" ? 1 : (parseFloat(unit_per_pocket) || 1);
    const stock_units = measurement_type === "kg" ? qty : qty * unitPocket;

    const [result] = await db.query(
      `INSERT INTO buying_items
       (item_name, measurement_type, quantity, quantity_available, unit_per_pocket, stock_units, price, taxi_fee, total_price, notes, purchased_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item_name,
        measurement_type,
        qty,
        qty,
        unitPocket,
        stock_units,
        perUnit,      // ✅ save price_per_unit into price column
        taxi,
        total_price,  // ✅ qty × perUnit + taxi
        notes || "",
        purchased_date,
      ]
    );

    res.json({
      id: result.insertId,
      message: "✅ Item added successfully",
      measurement_type,
      stock_units,
      quantity_available: qty,
      unit_per_pocket: unitPocket,
      price_per_unit: perUnit,
      total_price,
    });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ message: "Error creating item" });
  }
};

// ✅ Update buying item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      item_name,
      measurement_type = "pocket",
      quantity,
      unit_per_pocket,
      price_per_unit, // ✅
      taxi_fee,
      notes,
    } = req.body;

    const qty = parseFloat(quantity) || 0;
    const perUnit = parseFloat(price_per_unit) || 0;
    const taxi = parseFloat(taxi_fee) || 0;

    // ✅ total = qty × perUnit + taxi
    const total_price = (qty * perUnit) + taxi;

    const unitPocket = measurement_type === "kg" ? 1 : (parseFloat(unit_per_pocket) || 1);
    const stock_units = measurement_type === "kg" ? qty : qty * unitPocket;

    const [result] = await db.query(
      `UPDATE buying_items 
       SET item_name=?, measurement_type=?, quantity=?, unit_per_pocket=?, stock_units=?, price=?, taxi_fee=?, total_price=?, notes=?
       WHERE id=?`,
      [
        item_name,
        measurement_type,
        qty,
        unitPocket,
        stock_units,
        perUnit,      // ✅ save price_per_unit into price column
        taxi,
        total_price,  // ✅ qty × perUnit + taxi
        notes || "",
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item not found" });

    res.json({
      message: "✅ Item updated successfully",
      measurement_type,
      stock_units,
      unit_per_pocket: unitPocket,
      price_per_unit: perUnit,
      total_price,
    });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Error updating item" });
  }
};

// ✅ Delete buying item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM buying_items WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item not found" });
    res.json({ message: "✅ Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
};