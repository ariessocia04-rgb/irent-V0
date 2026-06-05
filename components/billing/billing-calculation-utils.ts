import { BillingCalculation } from '@/types/rent';

export function calculateBillingDue(
  baseRent: number,
  currentElectricity: number,
  previousElectricity: number,
  currentWater: number,
  previousWater: number,
  electricityRate: number,
  waterRate: number
): BillingCalculation {
  const electricityUsage = currentElectricity - previousElectricity;
  const waterUsage = currentWater - previousWater;

  const electricityCost = Math.max(0, electricityUsage * electricityRate);
  const waterCost = Math.max(0, waterUsage * waterRate);

  const totalDue = baseRent + electricityCost + waterCost;

  return {
    baseRent,
    electricityCost,
    waterCost,
    totalDue,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateMeterReading(): number {
  // Generate realistic meter reading between 100-9999
  return Math.floor(Math.random() * 9900) + 100;
}
