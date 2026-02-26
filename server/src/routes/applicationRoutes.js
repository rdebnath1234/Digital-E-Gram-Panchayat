import { Router } from "express";
import { apply, myApplications, setStatus } from "../controllers/applicationController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, requireRole("user"), apply);
router.get("/me", requireAuth, myApplications);
router.patch("/:id/status", requireAuth, requireRole("staff", "officer", "admin"), setStatus);

export default router;
