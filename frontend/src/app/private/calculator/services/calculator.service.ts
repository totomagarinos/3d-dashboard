import { Injectable } from '@angular/core';
import { CalculatorInput, CalculatorOutput } from '../models/calculator.model';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  calculate(input: CalculatorInput): CalculatorOutput {
    const materialCost = (input.grams * input.material.price) / input.material.weight;

    const electricityCost =
      ((input.consumptionWatts * input.electricityPricePerKwH) / 1000) * input.hours;

    const machineWear = (input.partsPrice / input.machineWearPerHour) * input.hours;

    const errorMargin =
      (materialCost + electricityCost + machineWear) * (input.errorMarginPercentage / 100);

    const subtotal =
      materialCost + electricityCost + machineWear + errorMargin + input.suppliesPrice;

    const electricityAndMaterialCost = materialCost + electricityCost;

    const totalToCharge = subtotal * input.profitMultiplier;

    return {
      materialCost,
      electricityCost,
      machineWear,
      errorMargin,
      supplies: input.suppliesPrice,
      electricityAndMaterialCost,
      totalCost: subtotal,
      totalToCharge,
    };
  }
}
