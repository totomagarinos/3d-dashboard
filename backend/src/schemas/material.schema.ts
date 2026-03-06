import {
  object,
  string,
  number,
  pipe,
  nonEmpty,
  maxLength,
  minValue,
  type InferOutput,
  partial,
} from "valibot";

export const CreateMaterialSchema = object({
  type: pipe(string(), nonEmpty(), maxLength(100)),
  brand: pipe(string(), nonEmpty(), maxLength(100)),
  weight: pipe(number(), minValue(1, "Weight must be greater than 0")),
  price: pipe(number(), minValue(1, "Price must be greater than 0")),
});

export const UpdateMaterialSchema = partial(CreateMaterialSchema);

export type CreateMaterialDTO = InferOutput<typeof CreateMaterialSchema>;

export type UpdateMaterialDTO = InferOutput<typeof UpdateMaterialSchema>;
