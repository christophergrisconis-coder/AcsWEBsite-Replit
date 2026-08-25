import type { Request, Response, NextFunction } from "express";

export function requireAdminToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const secret = process.env.SESSION_SECRET;
  const token = req.headers["x-admin-token"];
  if (!secret || !token || token !== secret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
