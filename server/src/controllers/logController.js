import { db } from "../config/firebase.js";

export async function getLogs(_req, res, next) {
  try {
    const snap = await db.collection("logs").orderBy("createdAt", "desc").limit(50).get();
    const rows = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(rows);
  } catch (error) {
    next(error);
  }
}
