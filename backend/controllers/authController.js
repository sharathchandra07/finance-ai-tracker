import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify with Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`
    );
    const { sub: google_id, name, email, picture } = response.data;

    // Insert or get user
    let [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [google_id]);
    if (rows.length === 0) {
      await db.query(
        "INSERT INTO users (google_id, name, email, picture) VALUES (?, ?, ?, ?)",
        [google_id, name, email, picture]
      );
      [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [google_id]);
    }

    const user = rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, google_id, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google authentication failed" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
