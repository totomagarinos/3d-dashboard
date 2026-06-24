import { model, Schema } from "mongoose";

export interface IRevokedToken {
  token: string;
  expiresAt: Date;
}

const revokedTokenSchema = new Schema<IRevokedToken>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RevokedToken = model<IRevokedToken>(
  "RevokedToken",
  revokedTokenSchema,
);
