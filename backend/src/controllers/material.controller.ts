import { parse } from "valibot";
import type { Request, Response } from "express";
import { CreateMaterialSchema, UpdateMaterialSchema } from "../schemas";
import { MaterialService } from "../services";

const isCastError = (error: unknown): error is Error & { name: "CastError" } =>
  error instanceof Error && error.name === "CastError";

export class MaterialController {
  static create = async (req: Request, res: Response) => {
    try {
      const validatedData = parse(CreateMaterialSchema, req.body);

      const newMaterial = await MaterialService.createMaterial(validatedData);

      res.status(201).json(newMaterial);
    } catch (error) {
      res.status(400).json({ error: "Invalid data or server error." });
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const materials = await MaterialService.getAllMaterials();

      res.status(200).json(materials);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error while fetching materials.",
      });
    }
  };

  static update = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const validatedData = parse(UpdateMaterialSchema, req.body);

      const { id } = req.params;
      const updatedMaterial = await MaterialService.updateMaterial(
        id,
        validatedData,
      );

      res.status(200).json(updatedMaterial);
    } catch (error) {
      res.status(400).json({ error: "Error updating material." });
    }
  };

  static delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const deletedMaterial = await MaterialService.deleteMaterial(id);

      if (!deletedMaterial) {
        return res.status(404).json({ error: "Material not found." });
      }

      return res.status(200).json(deletedMaterial);
    } catch (error) {
      if (isCastError(error)) {
        return res.status(400).json({ error: "Invalid material ID." });
      }

      return res.status(500).json({ error: "Error deleting material." });
    }
  };
}
