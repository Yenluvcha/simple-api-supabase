import express from "express";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
} from "../controllers/postController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Protected
router.post("/", authenticate, createPost);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

// Public
router.get("/", getPosts);
router.get("/:id", getPostById);

export default router;
