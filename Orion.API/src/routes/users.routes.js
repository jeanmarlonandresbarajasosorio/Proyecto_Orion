import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus
} from "../controllers/users.controller.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";

const router = Router();

// 🔐 SOLO ADMIN
router.get("/", authMiddleware, authorizeRoles("ADMIN"), getUsers);
router.post("/", authMiddleware, authorizeRoles("ADMIN"), createUser);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN"), updateUser);
router.patch("/:id/toggle", authMiddleware, authorizeRoles("ADMIN"), toggleUserStatus);

export default router;
