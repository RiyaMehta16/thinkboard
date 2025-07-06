import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/users/register → for user signup
router.post("/register", registerUser);

// POST /api/users/login → for login
router.post("/login", loginUser);

// GET /api/users/me → for fetching current user's profile
// ✅ Protected using authMiddleware (token required)
router.get("/me", authMiddleware, getMe);

export default router;
