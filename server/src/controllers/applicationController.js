import {
  createApplication,
  listApplicationsByUser,
  updateApplicationStatus
} from "../services/applicationService.js";
import { logAction } from "../utils/logger.js";

export async function apply(req, res, next) {
  try {
    const { serviceId, notes } = req.body;
    if (!serviceId || !notes) return res.status(400).json({ message: "Missing fields" });
    const row = await createApplication({
      serviceId,
      notes,
      userId: req.user.id,
      userEmail: req.user.email
    });
    await logAction("APPLY_SERVICE", { applicationId: row.id, serviceId }, req.user);
    res.status(201).json(row);
  } catch (error) {
    next(error);
  }
}

export async function myApplications(req, res, next) {
  try {
    const rows = await listApplicationsByUser(req.user.id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function setStatus(req, res, next) {
  try {
    await updateApplicationStatus(req.params.id, req.body.status, req.user.id);
    await logAction(
      "UPDATE_APPLICATION_STATUS",
      { applicationId: req.params.id, status: req.body.status },
      req.user
    );
    res.json({ message: "Status updated" });
  } catch (error) {
    next(error);
  }
}
