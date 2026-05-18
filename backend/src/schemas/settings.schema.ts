import {
  object,
  number,
  pipe,
  minValue,
  partial,
  type InferOutput,
} from "valibot";

export const SettingsSchema = object({
  electricityPricePerKwH: pipe(number(), minValue(0)),
  consumptionWatts: pipe(number(), minValue(0)),
  machineWearPerHour: pipe(number(), minValue(0)),
  partsPrice: pipe(number(), minValue(0)),
  errorMarginPercentage: pipe(number(), minValue(0)),
});

export const UpdateSettingsSchema = partial(SettingsSchema);

export type SettingsDTO = InferOutput<typeof SettingsSchema>;

export type UpdateSettingsDTO = InferOutput<typeof UpdateSettingsSchema>;
