import { Settings } from "../models";
import type { UpdateSettingsDTO } from "../schemas";

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
        });
      }

      return settings;
    } catch (error) {
      throw new Error("Error fetching settings from database.");
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
      throw new Error("Error updating settings.");
    }
  };
}
