import { Settings } from "../models/Settings";
import type { UpdateSettingsDTO } from "../schemas/settings.schema";

export class SettingsService {
  static getSettings = async () => {
    try {
      let settings = await Settings.findOne();

      if (!settings) {
        settings = await Settings.create({
          electricityPricePerKwH: 140,
          consumptionWatts: 120,
          machineWearPerHour: 4320,
          partsPrice: 150000,
          errorMarginPercentage: 5,
          laborCostPerHour: 2000,
        });
      }

      return settings;
    } catch (error) {
      throw new Error("Error al obtener los ajustes de la base de datos.");
    }
  };

  static updateSettings = async (data: UpdateSettingsDTO) => {
    try {
      const updatedSettings = await Settings.findOneAndUpdate({}, data, {
        new: true,
        upsert: true,
      });

      return updatedSettings;
    } catch (error) {
      throw new Error("Error al actualizar los ajustes.");
    }
  };
}
