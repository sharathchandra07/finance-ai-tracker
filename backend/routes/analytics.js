import express from "express";
import { getSummary, getCategories, getTrends } from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", authMiddleware, getSummary);
router.get("/categories", authMiddleware, getCategories);
router.get("/trends", authMiddleware, getTrends);

export default router;
