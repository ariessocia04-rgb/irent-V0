'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoomTabProps, Room } from '@/types/rent';
import { EmptyState } from '@/components/empty-states/empty-state';
import { BillingWizard } from '@/components/billing/billing-wizard';
import { Home } from 'lucide-react';
import { formatCurrency } from '@/components/billing/billing-calculation-utils';

export function RoomTab({ rooms, onRoomClick, onAddRoom }: RoomTabProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleOpenWizard = (room: Room) => {
    setSelectedRoom(room);
    setShowWizard(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Rooms</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your rental properties
          </p>
        </div>
        <Button
          onClick={onAddRoom}
          className={`${
            rooms.length >= 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200'
              : 'bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white'
          }`}
          disabled={rooms.length >= 1}
        >
          + Add New Room
        </Button>
      </div>

      {/* Free Tier Notice */}
      {rooms.length >= 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <span className="font-semibold">Free Tier:</span> Max 1 room reached
          </p>
        </div>
      )}

      {/* Empty State */}
      {rooms.length === 0 ? (
        <EmptyState
          icon={<Home className="w-12 h-12" />}
          title="No rooms configured"
          description="Click '+ Add New Room' above to create your first unit."
        />
      ) : (
        /* Rooms Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="p-4 border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenWizard(room)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-950">
                      Room {room.number}
                    </h3>
                    <p className="text-sm text-gray-600">{room.tenantName}</p>
                  </div>
                  <Badge
                    className={
                      room.status === 'occupied'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-50'
                    }
                  >
                    {room.status === 'occupied' ? 'Occupied' : 'Vacant'}
                  </Badge>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-600 text-xs">Base Rent</p>
                  <p className="font-mono font-semibold text-gray-950">
                    {formatCurrency(room.baseRent)}
                  </p>
                </div>
                <Button
                  className="w-full bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenWizard(room);
                  }}
                >
                  Create Invoice
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Billing Wizard Modal */}
      {selectedRoom && (
        <BillingWizard
          room={selectedRoom}
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          electricityRate={15}
          waterRate={25}
          onInvoiceSend={(totalDue) => {
            console.log(`[v0] Invoice sent for ₱${totalDue}`);
          }}
        />
      )}
    </div>
  );
}
