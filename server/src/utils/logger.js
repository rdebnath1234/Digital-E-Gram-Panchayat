import { db } from "../config/firebase.js";

export async function logAction(action, payload = {}, actor = null) {
  try {
    await db.collection("logs").add({
      action,
      payload,
      actor: actor ? { id: actor.id, email: actor.email, role: actor.role } : null,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("log write failed", error.message);
  }
}
