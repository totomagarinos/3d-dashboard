import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import JWT_SECRET from "../config";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verify error:", err);
      res.sendStatus(403);
      return;
    }

    req.user = user;
    next();
  });
};
