export type MetricType = 'CO2' | 'ENERGY' | 'WATER' | 'WASTE';

export const METRIC_LABELS: Record<MetricType, string> = {
  CO2: 'CO₂ Emissions',
  ENERGY: 'Energy Usage',
  WATER: 'Water Usage',
  WASTE: 'Waste Generated',
};

export const METRIC_UNITS: Record<MetricType, string> = {
  CO2: 'tons',
  ENERGY: 'MWh',
  WATER: 'm³',
  WASTE: 'kg',
};

export interface Report {
  id: string;
  year: number;
  quarter?: number;
  co2Emissions?: number;
  energyUsage?: number;
  waterUsage?: number;
  wasteGenerated?: number;
  renewablePct?: number;
  notes?: string;
}

export interface Goal {
  id: string;
  metric: MetricType;
  targetValue: number;
  targetYear: number;
  baselineValue: number;
  baselineYear: number;
}

export type ReportInput = Omit<Report, 'id'>;
export type GoalInput = Omit<Goal, 'id'>;
