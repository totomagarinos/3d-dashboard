import type { Request, Response } from "express";
import { SettingsService } from "../services/settings.service";
import { parse } from "valibot";
import { UpdateSettingsSchema } from "../schemas/settings.schema";

export class SettingsController {
  static get = async (req: Request, res: Response) => {
    try {
      const settings = await SettingsService.getSettings();
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: "Server error fetching settings." });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const validatedData = parse(UpdateSettingsSchema, req.body);

      const updatedSettings =
        await SettingsService.updateSettings(validatedData);

      res.status(200).json(updatedSettings);
    } catch (error) {
      res.status(400).json({ error: "Invalid data or server error." });
    }
  };
}
