import { number, object, optional, string, type InferOutput } from "valibot";

const MaterialSnapshotSchema = object({
  type: string(),
  brand: string(),
  weight: number(),
  price: number(),
});

const SettingsSnapshotSchema = object({
  electricityPricePerKwH: number(),
  consumptionWatts: number(),
  machineWearPerHour: number(),
  partsPrice: number(),
  errorMarginPercentage: number(),
});

const OutputSchema = object({
  materialCost: number(),
  electricityCost: number(),
  machineWear: number(),
  errorMargin: number(),
  supplies: number(),
  totalCost: number(),
  totalToCharge: number(),
});

export const CreateOrderSchema = object({
  title: string("Title is required."),
  clientName: optional(string()),
  notes: optional(string()),

  grams: number(),
  hours: number(),
  suppliesPrice: number(),
  profitMultiplier: number(),

  material: MaterialSnapshotSchema,
  settings: SettingsSnapshotSchema,
  output: OutputSchema,
});

export type CreateOrderDTO = InferOutput<typeof CreateOrderSchema>;
