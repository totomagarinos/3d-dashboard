import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IOrder {
  _id: string;
  title: string;
  clientName?: string;
  notes?: string;

  grams: number;
  hours: number;
  suppliesPrice: number;
  profitMultiplier: number;

  material: {
    type: string;
    brand: string;
    weight: number;
    price: number;
  };

  settings: {
    electricityPricePerKwH: number;
    consumptionWatts: number;
    machineWearPerHour: number;
    partsPrice: number;
    errorMarginPercentage: number;
  };

  output: {
    materialCost: number;
    electricityCost: number;
    machineWear: number;
    errorMargin: number;
    supplies: number;
    totalCost: number;
    totalToCharge: number;
  };
}

const materialSnapshotSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const settingsSnapshotSchema = new Schema(
  {
    electricityPricePerKwH: { type: Number, required: true },
    consumptionWatts: { type: Number, required: true },
    machineWearPerHour: { type: Number, required: true },
    partsPrice: { type: Number, required: true },
    errorMarginPercentage: { type: Number, required: true },
  },
  { _id: false },
);

const outputSchema = new Schema(
  {
    materialCost: { type: Number, required: true },
    electricityCost: { type: Number, required: true },
    machineWear: { type: Number, required: true },
    errorMargin: { type: Number, required: true },
    supplies: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    totalToCharge: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    _id: { type: String, default: () => uuidv4() },
    title: { type: String, required: true },
    clientName: { type: String },
    notes: { type: String },

    grams: { type: Number, required: true },
    hours: { type: Number, required: true },
    suppliesPrice: { type: Number, required: true },
    profitMultiplier: { type: Number, required: true },

    material: materialSnapshotSchema,
    settings: settingsSnapshotSchema,
    output: outputSchema,
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

export const Order = model<IOrder>("Order", orderSchema);
