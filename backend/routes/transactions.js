import express from "express";
import Groq from "groq-sdk"
import { addTransaction, getTransactions, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Parser Route
router.post("/parse", async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
    Extract a finance transaction from this text: "${text}".
    Return ONLY valid JSON (no explanation, no text), with fields:
    {
      "description": string,
      "amount": number (negative if expense, positive if income),
      "category": one of ["Food", "Transport", "Income", "Shopping", "Other"],
      "date": "YYYY-MM-DD"
    }
    `;

    const completion = await groq.chat.completions.create({
      model: "Gemma2-9b-It",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    let output = completion.choices[0].message.content.trim();

    // --- Extract JSON even if Groq adds extra text ---
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI output");

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);

  } catch (err) {
    console.error("Groq AI parsing error:", err);
    res.status(500).json({ error: "AI parsing failed" });
  }
});


router.post("/", authMiddleware, addTransaction);
router.get("/", authMiddleware, getTransactions);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;
