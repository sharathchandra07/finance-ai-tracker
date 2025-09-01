import db from "../config/db.js";

export const getSummary = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT SUM(CASE WHEN amount>0 THEN amount ELSE 0 END) AS income, SUM(CASE WHEN amount<0 THEN amount ELSE 0 END) AS expenses FROM transactions WHERE user_id=?",
      [req.user.id]
    );
    const { income, expenses } = rows[0];
    res.json({ income, expenses, savings: income + expenses });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT category, SUM(ABS(amount)) as total FROM transactions WHERE user_id=? AND amount<0 GROUP BY category",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getTrends = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT date, SUM(CASE WHEN amount<0 THEN ABS(amount) ELSE 0 END) as expenses, SUM(CASE WHEN amount>0 THEN amount ELSE 0 END) as income FROM transactions WHERE user_id=? GROUP BY date ORDER BY date ASC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trends" });
  }
};
