import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

export function signToken(payload: object) {
  if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET not set, using fallback. This should only happen in development.");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}