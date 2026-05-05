export interface Material {
  _id: string;
  type: string;
  brand: string;
  weight: number;
  price: number;
}

export type CreateMaterialDTO = Omit<Material, '_id'>;
