'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RoomTabProps, Room } from '@/types/rent';
import { EmptyState } from '@/components/empty-states/empty-state';
import { BillingWizard } from '@/components/billing/billing-wizard';
import { Home, UserPlus } from 'lucide-react';
import { formatCurrency } from '@/components/billing/billing-calculation-utils';

export function RoomTab({
  rooms,
  onRoomClick,
  onAddRoom,
  onCreateTenant,
  isPremium = false,
  userRole = 'landlord'
}: RoomTabProps & { isPremium?: boolean }) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPassword, setTenantPassword] = useState('');

  const canAddRoom = isPremium || rooms.length < 1;

  const handleAction = (room: Room) => {
    if (userRole !== 'landlord') return;

    setSelectedRoom(room);
    if (room.status === 'occupied') {
      setShowWizard(true);
    } else {
      setShowAssignModal(true);
    }
  };

  const handleAssignTenant = () => {
    if (selectedRoom && tenantEmail && tenantPassword && onCreateTenant) {
      onCreateTenant(selectedRoom.id, tenantEmail, tenantPassword);
      setShowAssignModal(false);
      setTenantEmail('');
      setTenantPassword('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Rooms</h1>
          <p className="text-gray-600 text-sm mt-1">
            {userRole === 'landlord' ? 'Manage your rental properties' : 'View your room information'}
          </p>
        </div>
        {userRole === 'landlord' && (
          <Button
            onClick={onAddRoom}
            className={`${
              !canAddRoom
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200'
                : 'bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white'
            }`}
            disabled={!canAddRoom}
          >
            + Add New Room
          </Button>
        )}
      </div>

      {/* Free Tier Notice */}
      {userRole === 'landlord' && !isPremium && rooms.length >= 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <span className="font-semibold">Free Tier:</span> Max 1 room reached
          </p>
        </div>
      )}

      {/* Premium Mode Badge */}
      {userRole === 'landlord' && isPremium && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-indigo-700 text-sm">
            <span className="font-semibold">✨ Premium Mode:</span> Unlimited rooms available
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
              onClick={() => handleAction(room)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-950">
                      Room {room.number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {room.status === 'occupied' ? room.tenantName : 'No tenant assigned'}
                    </p>
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
                {userRole === 'landlord' && (
                  <Button
                    className="w-full bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(room);
                    }}
                  >
                    {room.status === 'occupied' ? 'Create Invoice' : 'Assign Tenant'}
                  </Button>
                )}
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

      {/* Assign Tenant Modal */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#1A73E8]" />
              Assign Tenant to Room {selectedRoom?.number}
            </DialogTitle>
            <DialogDescription>
              Enter the tenant's email and a temporary password. They will be invited to join iRent.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-950">Tenant Email</label>
              <Input
                type="email"
                placeholder="tenant@example.com"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-950">Temporary Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={tenantPassword}
                onChange={(e) => setTenantPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white"
              onClick={handleAssignTenant}
              disabled={!tenantEmail || !tenantPassword}
            >
              Assign Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
