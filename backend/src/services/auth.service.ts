import { RevokedToken, User } from "../models";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { LoginDTO, RegisterDTO } from "../schemas/auth.schema";
import JWT_SECRET from "../config";
import { AppError } from "../utils/AppError";
import { compare } from "bcrypt";

export class AuthService {
  static register = async (authData: RegisterDTO) => {
    const exists = await User.findOne({ email: authData.email });

    if (exists) throw new AppError("The user already exists.", 400);

    const user = await User.create(authData);

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    };
  };

  static login = async (authData: LoginDTO) => {
    const user = await User.findOne({ email: authData.email });

    if (!user) throw new AppError("Invalid email or password.", 400);

    const validPassword = await compare(authData.password, user.password);
    if (!validPassword) throw new AppError("Invalid email or password.", 400);

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    };
  };

  static refresh = async (token: string) => {
    try {
      const revoked = await RevokedToken.findOne({ token });
      if (revoked) throw new AppError("Token revoked", 401);

      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const user = await User.findOne({ _id: decoded.userId });

      if (!user) throw new AppError("Invalid refresh token.", 401);

      const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { accessToken, refreshToken };
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }
  };
}
