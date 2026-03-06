import { parse } from "valibot";
import {
  CreateMaterialSchema,
  UpdateMaterialSchema,
} from "../schemas/material.schema";
import { MaterialService } from "../services/material.service";
import type { Request, Response } from "express";

export class MaterialController {
  static create = async (req: Request, res: Response) => {
    try {
      const validatedData = parse(CreateMaterialSchema, req.body);

      const newMaterial = await MaterialService.createMaterial(validatedData);

      res.status(201).json({ newMaterial });
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

      res.status(200).json({ updatedMaterial });
    } catch (error) {
      res.status(400).json({ error: "Error updating material." });
    }
  };

  static delete = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const deletedMaterial = await MaterialService.deleteMaterial(id);

      res.status(200).json({ deletedMaterial });
    } catch (error) {
      res.status(500).json({ error: "Error deleting material." });
    }
  };
}
