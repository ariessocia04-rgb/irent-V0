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
import { RoomTabProps, Room, AddRoomData } from '@/types/rent';
import { EmptyState } from '@/components/empty-states/empty-state';
import { BillingWizard } from '@/components/billing/billing-wizard';
import { Home, UserPlus, Info, PlusCircle, User, Mail, Lock, Hash, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/components/billing/billing-calculation-utils';

export function RoomTab({
  rooms,
  onRoomClick,
  onAddRoom,
  onAddRoomWithTenant,
  onCreateTenant,
  isPremium = false,
  userRole = 'landlord'
}: RoomTabProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // Add Room Form State
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newBaseRent, setNewBaseRent] = useState('');
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantPassword, setNewTenantPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAddRoom = isPremium || rooms.length < 1;

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setShowDetailModal(true);
  };

  const handleOpenWizard = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setShowWizard(true);
  };

  const handleAddRoomSubmit = () => {
    setFormError('');
    if (!newRoomNumber || !newBaseRent || !newTenantName || !newTenantEmail || !newTenantPassword) {
      setFormError('All fields are required.');
      return;
    }

    if (!newTenantEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      if (onAddRoomWithTenant) {
        onAddRoomWithTenant({
          number: newRoomNumber,
          baseRent: parseFloat(newBaseRent),
          tenantName: newTenantName,
          email: newTenantEmail,
          password: newTenantPassword
        });

        // Reset and close
        setShowAddRoomModal(false);
        setNewRoomNumber('');
        setNewBaseRent('');
        setNewTenantName('');
        setNewTenantEmail('');
        setNewTenantPassword('');
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Units & Tenants</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {userRole === 'landlord' ? 'Full property portfolio oversight' : 'Your residence details'}
          </p>
        </div>
        {userRole === 'landlord' && (
          <Button
            onClick={() => setShowAddRoomModal(true)}
            className={`${
              !canAddRoom
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200'
                : 'bg-[#1A73E8] hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-105 active:scale-95'
            } px-6 py-6 rounded-xl font-bold`}
            disabled={!canAddRoom}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Unit
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Units', value: rooms.length, icon: <Home className="w-4 h-4" />, color: 'blue' },
          { label: 'Occupied', value: rooms.filter(r => r.status === 'occupied').length, icon: <CheckCircle2 className="w-4 h-4" />, color: 'emerald' },
          { label: 'Vacant', value: rooms.filter(r => r.status === 'vacant').length, icon: <div className="w-2 h-2 rounded-full bg-amber-500" />, color: 'amber' },
          { label: 'Monthly Revenue', value: formatCurrency(rooms.reduce((acc, r) => acc + r.baseRent, 0)), icon: <DollarSign className="w-4 h-4" />, color: 'indigo' },
        ].map((stat, i) => (
          <Card key={i} className="p-4 border-gray-100 flex items-center gap-4 shadow-sm bg-white/50 backdrop-blur-sm">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-gray-950 tracking-tight">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <EmptyState
          icon={<Home className="w-12 h-12" />}
          title="No properties found"
          description="Click 'Add New Unit' to start building your portfolio."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="group relative overflow-hidden border-gray-100 hover:border-blue-200 transition-all cursor-pointer bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300 rounded-2xl"
              onClick={() => handleRoomClick(room)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <Hash className="w-6 h-6 text-slate-400 group-hover:text-[#1A73E8]" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-950 text-lg leading-tight">
                        Unit {room.number}
                      </h3>
                      <Badge className={`mt-1 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 ${
                        room.status === 'occupied'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      } border`}>
                        {room.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="text-gray-300 hover:text-blue-600">
                    <Info className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Occupant</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {room.tenantName ? room.tenantName.split(' ').map(n => n[0]).join('') : '?'}
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {room.status === 'occupied' ? room.tenantName : <span className="text-gray-300 italic font-medium text-xs">No Tenant Assigned</span>}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Rate</p>
                      <p className="text-xl font-black text-gray-950 tracking-tight">
                        {formatCurrency(room.baseRent)}
                      </p>
                    </div>
                    {userRole === 'landlord' && room.status === 'occupied' && (
                      <Button
                        className="bg-blue-50 text-[#1A73E8] hover:bg-[#1A73E8] hover:text-white font-bold text-xs px-4 rounded-xl transition-all shadow-sm"
                        onClick={(e) => handleOpenWizard(e, room)}
                      >
                        Create Invoice
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Room Detail Modal - Full Info */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="h-32 bg-gradient-to-r from-[#1A73E8] via-blue-600 to-indigo-700 relative">
            <div className="absolute -bottom-8 left-8">
               <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-white">
                  <Hash className="w-8 h-8 text-[#1A73E8]" />
               </div>
            </div>
          </div>

          <div className="px-8 pt-12 pb-8 bg-white">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-950 tracking-tighter">Unit {selectedRoom?.number}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`font-bold text-xs px-3 py-1 ${
                    selectedRoom?.status === 'occupied' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {selectedRoom?.status?.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-400 font-bold tracking-widest">• MANILA BRANCH</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Rate</p>
                <p className="text-3xl font-black text-[#1A73E8]">{formatCurrency(selectedRoom?.baseRent || 0)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User className="w-3 h-3" /> Tenant Details
                  </h4>
                  {selectedRoom?.status === 'occupied' ? (
                    <div className="space-y-2">
                      <p className="font-bold text-gray-900">{selectedRoom.tenantName}</p>
                      <p className="text-xs text-gray-500 font-medium">Joined: June 2024</p>
                      <Button variant="link" className="p-0 h-auto text-xs text-[#1A73E8] font-bold">View Profile →</Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 font-medium italic">Vacant Unit - Ready for new tenant</p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Availability
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <p className="text-sm font-bold text-gray-700">Immediate Move-in Available</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Next scheduled maintenance: Sept 2024</p>
                </div>
              </div>

              <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-100">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-4">Unit Inventory</h4>
                <ul className="space-y-3">
                  {[
                    'Fully Air-conditioned',
                    'High-speed Fiber Ready',
                    'Sub-metered Electricity',
                    'Private Bathroom',
                    'Kitchenette with Sink'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 p-6 px-8 flex justify-between items-center sm:justify-between">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Unit UID: {selectedRoom?.id}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl border-gray-200 font-bold" onClick={() => setShowDetailModal(false)}>Close</Button>
              {userRole === 'landlord' && (
                <Button className="rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white font-bold px-6 shadow-md">Edit Details</Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Room Modal - Rich Form */}
      <Dialog open={showAddRoomModal} onOpenChange={setShowAddRoomModal}>
        <DialogContent className="sm:max-w-xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="bg-slate-900 text-white p-8">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <PlusCircle className="w-8 h-8 text-blue-400" />
              Onboard New Unit
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Initialize a new property node and create its first tenant account.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 bg-white space-y-6">
            {formError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in zoom-in-95 duration-200">
                <Info className="w-5 h-5" />
                <p className="text-sm font-bold">{formError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Number</label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="e.g. 104"
                    className="pl-9 rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Base Rent</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="₱ 0.00"
                    className="pl-9 rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                    value={newBaseRent}
                    onChange={(e) => setNewBaseRent(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-50 space-y-5">
               <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                 <UserPlus className="w-4 h-4" /> Client Authentication Profile
               </h3>

               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider ml-1">Client Full Name</label>
                 <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                    <Input
                      placeholder="e.g. John Doe"
                      className="pl-9 rounded-xl border-blue-100 bg-white focus:ring-4 focus:ring-blue-100 py-6"
                      value={newTenantName}
                      onChange={(e) => setNewTenantName(e.target.value)}
                    />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider ml-1">Login Email</label>
                   <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                      <Input
                        placeholder="john@example.com"
                        className="pl-9 rounded-xl border-blue-100 bg-white focus:ring-4 focus:ring-blue-100 py-6"
                        value={newTenantEmail}
                        onChange={(e) => setNewTenantEmail(e.target.value)}
                      />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-blue-800 uppercase tracking-wider ml-1">Temporary Password</label>
                   <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 rounded-xl border-blue-100 bg-white focus:ring-4 focus:ring-blue-100 py-6"
                        value={newTenantPassword}
                        onChange={(e) => setNewTenantPassword(e.target.value)}
                      />
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 flex flex-col-reverse sm:flex-row gap-3">
             <Button
                variant="ghost"
                className="flex-1 rounded-xl text-gray-500 font-bold py-6"
                onClick={() => setShowAddRoomModal(false)}
                disabled={isSubmitting}
             >
               Discard
             </Button>
             <Button
                className="flex-[2] rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white font-black py-6 shadow-xl transition-all active:scale-95"
                onClick={handleAddRoomSubmit}
                disabled={isSubmitting}
             >
               {isSubmitting ? 'INITIALIZING...' : 'PROVISION UNIT'}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
