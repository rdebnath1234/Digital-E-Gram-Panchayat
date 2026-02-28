import "../src/config/env.js";
import bcrypt from "bcryptjs";
import { db } from "../src/config/firebase.js";

function parseArgs(argv) {
  const out = {};
  for (const item of argv) {
    if (!item.startsWith("--")) continue;
    const [k, ...rest] = item.slice(2).split("=");
    out[k] = rest.join("=") || true;
  }
  return out;
}

function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();
  if (["user", "staff", "officer", "admin"].includes(value)) return value;
  throw new Error("Invalid role. Use one of: user, staff, officer, admin");
}

async function upsertUser({ name, email, password, role }) {
  const users = db.collection("users");
  const snap = await users.where("email", "==", email).limit(1).get();
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  if (snap.empty) {
    const ref = users.doc();
    await ref.set({ name, email, passwordHash, role, createdAt: now, updatedAt: now });
    return { id: ref.id, created: true };
  }

  const userDoc = snap.docs[0];
  await users.doc(userDoc.id).set({ name, email, passwordHash, role, updatedAt: now }, { merge: true });
  return { id: userDoc.id, created: false };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.h) {
    console.log("Usage: node scripts/seed-user.js --name='Staff User' --email='staff@example.com' --password='Pass@123' --role=staff");
    process.exit(0);
  }

  const name = args.name || process.env.SEED_NAME || "Role User";
  const email = args.email || process.env.SEED_EMAIL;
  const password = args.password || process.env.SEED_PASSWORD;
  const role = normalizeRole(args.role || process.env.SEED_ROLE || "staff");

  if (!email || !password) {
    throw new Error("Missing required args: --email and --password (or SEED_EMAIL/SEED_PASSWORD)");
  }

  const result = await upsertUser({ name, email, password, role });
  console.log(`${result.created ? "Created" : "Updated"} ${role} user: ${email} (id: ${result.id})`);
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
