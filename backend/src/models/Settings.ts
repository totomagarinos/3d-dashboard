import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISettings {
  _id: string;
  electricityPricePerKwH: number;
  consumptionWatts: number;
  machineWearPerHour: number;
  partsPrice: number;
  errorMarginPercentage: number;
}

const settingsSchema = new Schema<ISettings>(
  {
    _id: { type: String, default: () => uuidv4() },
    electricityPricePerKwH: { type: Number, required: true, default: 0 },
    consumptionWatts: { type: Number, required: true, default: 0 },
    machineWearPerHour: { type: Number, required: true, default: 0 },
    partsPrice: { type: Number, required: true, default: 0 },
    errorMarginPercentage: { type: Number, required: true, default: 0 },
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

export const Settings = model<ISettings>("Settings", settingsSchema);
