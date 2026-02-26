import { createService, deleteService, listServices, updateService } from "../services/serviceService.js";
import { logAction } from "../utils/logger.js";

export async function getServices(req, res, next) {
  try {
    const rows = await listServices(req.query.search || "");
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function postService(req, res, next) {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Missing fields" });
    const row = await createService({ title, description, createdBy: req.user.id });
    await logAction("CREATE_SERVICE", { serviceId: row.id, title }, req.user);
    res.status(201).json(row);
  } catch (error) {
    next(error);
  }
}

export async function putService(req, res, next) {
  try {
    await updateService(req.params.id, req.body);
    await logAction("UPDATE_SERVICE", { serviceId: req.params.id }, req.user);
    res.json({ message: "Service updated" });
  } catch (error) {
    next(error);
  }
}

export async function removeService(req, res, next) {
  try {
    await deleteService(req.params.id);
    await logAction("DELETE_SERVICE", { serviceId: req.params.id }, req.user);
    res.json({ message: "Service deleted" });
  } catch (error) {
    next(error);
  }
}
