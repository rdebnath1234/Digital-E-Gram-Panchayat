import { db } from "../config/firebase.js";

const applications = db.collection("applications");

export async function createApplication(data) {
  const ref = applications.doc();
  const now = new Date().toISOString();
  await ref.set({ ...data, status: "Pending", createdAt: now, updatedAt: now });
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
}

export async function listApplicationsByUser(userId) {
  const snap = await applications.where("userId", "==", userId).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateApplicationStatus(id, status, updatedBy) {
  await applications.doc(id).update({ status, updatedBy, updatedAt: new Date().toISOString() });
}
