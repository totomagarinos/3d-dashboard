import {
  maxLength,
  nonEmpty,
  number,
  object,
  optional,
  pipe,
  string,
  type InferOutput,
} from "valibot";

const MaterialSnapshotSchema = object({
  type: pipe(string(), nonEmpty(), maxLength(100)),
  brand: pipe(string(), nonEmpty(), maxLength(100)),
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
  title: pipe(string("Title is required."), nonEmpty(), maxLength(200)),
  clientName: optional(pipe(string(), maxLength(100))),
  notes: optional(pipe(string(), maxLength(1000))),

  grams: number(),
  hours: number(),
  suppliesPrice: number(),
  profitMultiplier: number(),

  material: MaterialSnapshotSchema,
  settings: SettingsSnapshotSchema,
  output: OutputSchema,
});

export type CreateOrderDTO = InferOutput<typeof CreateOrderSchema>;
