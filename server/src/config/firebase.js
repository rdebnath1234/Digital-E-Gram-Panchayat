import fs from "node:fs";
import process from "node:process";
import admin from "firebase-admin";
import "./env.js";

function loadServiceAccount() {
  const inlineKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (inlineKey) {
    try {
      return JSON.parse(inlineKey);
    } catch (error) {
      throw new Error(`Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON: ${error.message}`);
    }
  }

  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyPath) return null;

  try {
    const raw = fs.readFileSync(keyPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Google credentials file not found at ${keyPath}`);
    }

    throw new Error(`Failed to read Google credentials from ${keyPath}: ${error.message}`);
  }
}

const serviceAccount = loadServiceAccount();
const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  serviceAccount?.project_id;

const credential = serviceAccount
  ? admin.credential.cert(serviceAccount)
  : admin.credential.applicationDefault();

let app;
if (!admin.apps.length) {
  const firebaseConfig = { credential };
  if (projectId) firebaseConfig.projectId = projectId;
  app = admin.initializeApp(firebaseConfig);
} else {
  app = admin.app();
}

export const db = admin.firestore(app);
