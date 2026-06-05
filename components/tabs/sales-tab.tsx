'use client';

import { Card } from '@/components/ui/card';
import { SalesTabProps } from '@/types/rent';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/components/billing/billing-calculation-utils';

export function SalesTab({ sales }: SalesTabProps) {
  // Calculate totals and metrics
  const totalIncome = sales.reduce((sum, month) => sum + month.grossIncome, 0);
  const avgGrowth = sales.length > 0
    ? sales.reduce((sum, month) => sum + month.growth, 0) / sales.length
    : 0;
  const avgROI = sales.length > 0
    ? sales.reduce((sum, month) => sum + month.roi, 0) / sales.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Sales Analytics</h1>
        <p className="text-gray-600 text-sm mt-1">
          Revenue and performance metrics
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Gross Income */}
        <Card className="p-6 border-gray-100">
          <p className="text-gray-600 text-sm mb-2">Total Gross Income</p>
          <p className="font-mono text-2xl font-bold text-gray-950">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {sales.length} months tracked
          </p>
        </Card>

        {/* Month-on-Month Growth */}
        <Card className="p-6 border-gray-100">
          <p className="text-gray-600 text-sm mb-2">Avg Month-on-Month Growth</p>
          <div className="flex items-baseline gap-2">
            <p className="font-mono text-2xl font-bold text-emerald-600">
              {avgGrowth.toFixed(1)}%
            </p>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-gray-500 text-xs mt-2">Last 6 months</p>
        </Card>

        {/* Year-on-Year ROI */}
        <Card className="p-6 border-gray-100">
          <p className="text-gray-600 text-sm mb-2">Average ROI</p>
          <p className="font-mono text-2xl font-bold text-gray-950">
            {avgROI.toFixed(1)}%
          </p>
          <p className="text-gray-500 text-xs mt-2">Return on investment</p>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card className="p-6 border-gray-100">
        <h2 className="text-lg font-semibold text-gray-950 mb-4">
          Monthly Performance
        </h2>
        <div className="space-y-3">
          {sales.map((month, index) => (
            <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-950">{month.month}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-mono font-semibold text-gray-950">
                    {formatCurrency(month.grossIncome)}
                  </p>
                  <p className={`text-xs ${
                    month.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {month.growth > 0 ? '+' : ''}{month.growth.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
