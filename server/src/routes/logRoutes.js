import { Router } from "express";
import { getLogs } from "../controllers/logController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, requireRole("staff", "officer", "admin"), getLogs);

export default router;
