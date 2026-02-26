import admin from "firebase-admin";
import process from "node:process";

let app;
if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
} else {
  app = admin.app();
}

export const db = admin.firestore(app);
