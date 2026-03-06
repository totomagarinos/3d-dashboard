import { model, Schema } from "mongoose";

export interface IMaterial {
  type: string;
  brand: string;
  weight: number;
  price: number;
}

const materialSchema = new Schema<IMaterial>(
  {
    type: { type: String, required: true },
    brand: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const Material = model<IMaterial>("Material", materialSchema);
