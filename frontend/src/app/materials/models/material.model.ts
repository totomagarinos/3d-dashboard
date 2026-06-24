export interface Material {
  id: string;
  type: string;
  brand: string;
  weight: number;
  price: number;
}

export type CreateMaterialDTO = Omit<Material, 'id'>;
