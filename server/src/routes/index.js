import { Router } from "express";
import authRoutes from "./authRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import applicationRoutes from "./applicationRoutes.js";
import logRoutes from "./logRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/applications", applicationRoutes);
router.use("/logs", logRoutes);
router.use("/users", userRoutes);

export default router;
