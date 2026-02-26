import { Router } from "express";
import {
  getServices,
  postService,
  putService,
  removeService
} from "../controllers/serviceController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getServices);
router.post("/", requireAuth, requireRole("officer", "admin"), postService);
router.put("/:id", requireAuth, requireRole("officer", "admin"), putService);
router.delete("/:id", requireAuth, requireRole("officer", "admin"), removeService);

export default router;
