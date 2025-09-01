import db from "../config/db.js";

// Add a transaction
export const addTransaction = async (req, res) => {
  try {
    let { description, amount, category, date } = req.body;

    // --- Normalize Amount ---
    amount = Number(amount);
    if (isNaN(amount)) {
      return res.status(400).json({ error: "Amount must be a number" });
    }

    // --- Normalize Date (YYYY-MM-DD for MySQL) ---
    if (!date) {
      date = new Date().toISOString().split("T")[0]; // default = today
    } else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      date = parsedDate.toISOString().split("T")[0];
    }

    // --- Default category if missing ---
    if (!category) category = "Other";

    // --- Save into MySQL ---
    const sql = `INSERT INTO transactions (user_id, description, amount, category, date) VALUES (?, ?, ?, ?, ?)`;
    const values = [req.user.id, description, amount, category, date];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Insert Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // --- Fetch the inserted row ---
      db.query(
        "SELECT * FROM transactions WHERE id = ?",
        [result.insertId],
        (err2, rows) => {
          if (err2) {
            console.error("MySQL Fetch Error:", err2);
            return res.status(500).json({ error: "Database fetch error" });
          }
          res.status(201).json(rows[0]); // ✅ send the full transaction row
        }
      );
    });
  } catch (err) {
    console.error("Add Transaction Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch Transactions Error:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    await db.query(
      "UPDATE transactions SET description=?, amount=?, category=?, date=? WHERE id=? AND user_id=?",
      [description, amount, category, date, id, req.user.id]
    );

    res.json({ message: "Transaction updated" });
  } catch (err) {
    console.error("Update Transaction Error:", err);
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM transactions WHERE id=? AND user_id=?", [id, req.user.id]);

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Delete Transaction Error:", err);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};
