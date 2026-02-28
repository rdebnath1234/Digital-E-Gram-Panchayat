import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "node:process";
import { createUser, findUserByEmail } from "../services/userService.js";
import { logAction } from "../utils/logger.js";

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
    if (req.body?.role && String(req.body.role).trim().toLowerCase() !== "user") {
      return res.status(403).json({ message: "Public registration is limited to user accounts" });
    }

    const exists = await findUserByEmail(email);
    if (exists) return res.status(409).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash, role: "user" });
    await logAction("REGISTER", { email, role: "user" }, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(publicUser(user), process.env.JWT_SECRET, { expiresIn: "1d" });
    await logAction("LOGIN", { email }, user);
    res.json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await logAction("LOGOUT", {}, req.user);
    res.json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
}
