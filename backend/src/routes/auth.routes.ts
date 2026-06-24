import { Router, type Request, type Response } from "express";
import { message, parse } from "valibot";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";
import { AuthService } from "../services";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticateToken } from "../middlewares/auth";
import jwt, { type JwtPayload } from "jsonwebtoken";
import JWT_SECRET from "../config";
import { RevokedToken } from "../models";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = parse(RegisterSchema, req.body);

    const result = await AuthService.register(data);

    res.status(201).json(result);
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = parse(LoginSchema, req.body);

    const result = await AuthService.login(data);

    res.status(200).json(result);
  }),
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token required" });
      return;
    }

    const result = await AuthService.refresh(refreshToken);
    res.json(result);
  }),
);

authRouter.post(
  "/logout",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;
      await RevokedToken.create({
        token: refreshToken,
        expiresAt: new Date((decoded.exp as number) * 1000),
      });
    }

    res.json({ message: "Successfull logout." });
  }),
);
