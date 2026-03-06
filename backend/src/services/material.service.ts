import { Material } from "../models/Material";
import {
  type CreateMaterialDTO,
  type UpdateMaterialDTO,
} from "../schemas/material.schema";

export class MaterialService {
  static createMaterial = async (data: CreateMaterialDTO) => {
    try {
      const material = await Material.create(data);

      return material;
    } catch (error) {
      throw new Error("Error al crear el material en la base de datos.");
    }
  };

  static getAllMaterials = async () => {
    try {
      const materials = await Material.find();
      return materials;
    } catch (error) {
      throw new Error("Error al obtener los materiales de la base de datos.");
    }
  };

  static updateMaterial = async (id: string, data: UpdateMaterialDTO) => {
    try {
      const updatedMaterial = await Material.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });

      return updatedMaterial;
    } catch (error) {
      throw new Error("Error al actualizar el material.");
    }
  };

  static deleteMaterial = async (id: string) => {
    try {
      const deletedMaterial = await Material.findByIdAndDelete(id);
      return deletedMaterial;
    } catch (error) {
      throw new Error("Error al eliminar el material.");
    }
  };
}
