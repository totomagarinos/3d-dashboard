import { Material } from '../../materials/models/material.model';

export interface CalculatorInput {
  grams: number;
  hours: number;
  material: Material;
  electricityPricePerKwH: number;
  consumptionWatts: number;
  machineWearPerHour: number;
  partsPrice: number;
  suppliesPrice: number;
  errorMarginPercentage: number;
  profitMultiplier: number;
}

export interface CalculatorOutput {
  materialCost: number;
  electricityCost: number;
  machineWear: number;
  errorMargin: number;
  supplies: number;
  electricityAndMaterialCost: number;
  totalCost: number;
  totalToCharge: number;
}
