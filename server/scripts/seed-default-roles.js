import "../src/config/env.js";
import { spawn } from "node:child_process";

function runSeed({ name, email, password, role }) {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      console.warn(`Skipped ${role}: missing email/password in env.`);
      resolve(false);
      return;
    }

    const child = spawn(
      process.execPath,
      [
        "scripts/seed-user.js",
        `--name=${name}`,
        `--email=${email}`,
        `--password=${password}`,
        `--role=${role}`
      ],
      { stdio: "inherit", cwd: process.cwd() }
    );

    child.on("exit", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`Seeding ${role} failed`));
    });
  });
}

async function main() {
  const staffRole = (process.env.SEED_STAFF_ROLE || "staff").toLowerCase();
  const officerRole = (process.env.SEED_OFFICER_ROLE || "officer").toLowerCase();

  await runSeed({
    name: process.env.SEED_STAFF_NAME || "Staff User",
    email: process.env.SEED_STAFF_EMAIL,
    password: process.env.SEED_STAFF_PASSWORD,
    role: staffRole
  });

  await runSeed({
    name: process.env.SEED_OFFICER_NAME || "Officer User",
    email: process.env.SEED_OFFICER_EMAIL,
    password: process.env.SEED_OFFICER_PASSWORD,
    role: officerRole
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
