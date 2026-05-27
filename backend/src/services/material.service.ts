import { Material } from "../models";
import type { CreateMaterialDTO, UpdateMaterialDTO } from "../schemas";

export class MaterialService {
  static createMaterial = async (data: CreateMaterialDTO) => {
    try {
      const material = await Material.create(data);

      return material;
    } catch (error) {
      throw new Error("Error creating material in database.");
    }
  };

  static getAllMaterials = async () => {
    try {
      const materials = await Material.find();
      return materials;
    } catch (error) {
      throw new Error("Error fetching materials from database.");
    }
  };

  static updateMaterial = async (id: string, data: UpdateMaterialDTO) => {
    try {
      const updatedMaterial = await Material.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });

      return updatedMaterial;
    } catch (error) {
      throw new Error("Error updating material.");
    }
  };

  static deleteMaterial = async (id: string) => {
    const deletedMaterial = await Material.findByIdAndDelete(id);
    return deletedMaterial;
  };
}
