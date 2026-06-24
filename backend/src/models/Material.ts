import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IMaterial {
  _id: string;
  type: string;
  brand: string;
  weight: number;
  price: number;
}

const materialSchema = new Schema<IMaterial>(
  {
    _id: { type: String, default: () => uuidv4() },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Material = model<IMaterial>("Material", materialSchema);
