import { db } from "../config/firebase.js";

const services = db.collection("services");

export async function createService(data) {
  const ref = services.doc();
  await ref.set({ ...data, createdAt: new Date().toISOString() });
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
}

export async function listServices(search = "") {
  const snap = await services.get();
  const rows = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  if (!search) return rows;
  const term = search.toLowerCase();
  return rows.filter(
    (item) =>
      String(item.title || "").toLowerCase().includes(term) ||
      String(item.description || "").toLowerCase().includes(term)
  );
}

export async function updateService(id, data) {
  await services.doc(id).update({ ...data, updatedAt: new Date().toISOString() });
}

export async function deleteService(id) {
  await services.doc(id).delete();
}
