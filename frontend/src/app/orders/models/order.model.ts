export interface Order {
  _id: string;
  title: string;
  clientName?: string;
  notes?: string;
  grams: number;
  hours: number;
  suppliesPrice: number;
  profitMultiplier: number;
  material: { type: string; brand: string; weight: number; price: number };
  settings: {
    electricityPricePerKwH: number;
    consumptionWatts: number;
    machineWearPerHour: number;
    partsPrice: number;
    errorMarginPercentage: number;
  };
  output: {
    materialCost: number;
    electricityCost: number;
    machineWear: number;
    errorMargin: number;
    supplies: number;
    totalCost: number;
    totalToCharge: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalSpent: number;
  totalEarned: number;
  totalProfit: number;
  orderCount: number;
}

export type CreateOrderDTO = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;
