import express from "express";
import { getProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);

export default router;
