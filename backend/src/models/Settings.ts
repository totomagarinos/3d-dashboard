import { model, Schema } from "mongoose";

export interface ISettings {
  electricityPricePerKwH: number;
  consumptionWatts: number;
  machineWearPerHour: number;
  partsPrice: number;
  errorMarginPercentage: number;
}

const settingsSchema = new Schema<ISettings>(
  {
    electricityPricePerKwH: { type: Number, required: true, default: 0 },
    consumptionWatts: { type: Number, required: true, default: 0 },
    machineWearPerHour: { type: Number, required: true, default: 0 },
    partsPrice: { type: Number, required: true, default: 0 },
    errorMarginPercentage: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const Settings = model<ISettings>("Settings", settingsSchema);
