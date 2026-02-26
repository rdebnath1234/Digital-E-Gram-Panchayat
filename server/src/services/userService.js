import { db } from "../config/firebase.js";

const users = db.collection("users");

export async function createUser(user) {
  const ref = users.doc();
  await ref.set({ ...user, createdAt: new Date().toISOString() });
  const snap = await ref.get();
  return { id: ref.id, ...snap.data() };
}

export async function findUserByEmail(email) {
  const snap = await users.where("email", "==", email).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function getUserById(id) {
  const doc = await users.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}
