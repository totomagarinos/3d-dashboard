import { Material } from "../models";
import type { CreateMaterialDTO, UpdateMaterialDTO } from "../schemas";

export class MaterialService {
  static createMaterial = async (data: CreateMaterialDTO, userId: string) => {
    try {
      const material = await Material.create({ ...data, userId });

      return material;
    } catch (error) {
      throw new Error("Error creating material in database.");
    }
  };

  static getAllMaterials = async (userId: string) => {
    try {
      const materials = await Material.find({ userId });
      return materials;
    } catch (error) {
      throw new Error("Error fetching materials from database.");
    }
  };

  static updateMaterial = async (
    id: string,
    data: UpdateMaterialDTO,
    userId: string,
  ) => {
    try {
      const updatedMaterial = await Material.findByIdAndUpdate(
        { _id: id, userId },
        data,
        {
          returnDocument: "after",
        },
      );

      return updatedMaterial;
    } catch (error) {
      throw new Error("Error updating material.");
    }
  };

  static deleteMaterial = async (id: string, userId: string) => {
    const deletedMaterial = await Material.findByIdAndDelete({
      _id: id,
      userId,
    });
    return deletedMaterial;
  };
}
