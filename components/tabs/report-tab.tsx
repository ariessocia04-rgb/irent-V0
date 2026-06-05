'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReportTabProps } from '@/types/rent';
import { EmptyState } from '@/components/empty-states/empty-state';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/components/billing/billing-calculation-utils';

export function ReportTab({
  ledger,
  onMarkAsPaid,
  onViewReceipt,
}: ReportTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Payment Reports</h1>
        <p className="text-gray-600 text-sm mt-1">
          Track payment status and history
        </p>
      </div>

      {/* Empty State */}
      {ledger.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="w-12 h-12" />}
          title="No payment records"
          description="Payment history will appear here once tenants have been billed."
        />
      ) : (
        /* Table */
        <div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                <TableHead className="text-gray-950">Unit</TableHead>
                <TableHead className="text-gray-950">Tenant</TableHead>
                <TableHead className="text-gray-950">Month</TableHead>
                <TableHead className="text-gray-950 text-right">Amount</TableHead>
                <TableHead className="text-gray-950">Status</TableHead>
                <TableHead className="text-gray-950">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-semibold text-gray-950">
                    {entry.unit}
                  </TableCell>
                  <TableCell className="text-gray-600">{entry.tenant}</TableCell>
                  <TableCell className="text-gray-600">{entry.month}</TableCell>
                  <TableCell className="text-right font-mono text-gray-950">
                    {formatCurrency(entry.totalBalance)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        entry.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                          : entry.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-50'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-50'
                      } transition-all duration-300 scale-in`}
                    >
                      {entry.status.charAt(0).toUpperCase() +
                        entry.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {entry.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => onMarkAsPaid(entry.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => onViewReceipt?.(entry.id)}
                      >
                        Receipt
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
