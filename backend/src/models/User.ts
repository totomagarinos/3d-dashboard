import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
  },
  {
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  },
);

userSchema.pre("save", async function (this: IUser & Document) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<IUser>("User", userSchema);
