import express from "express";
import { googleAuth, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/google", googleAuth);
router.get("/profile", authMiddleware, getProfile);

export default router;
