'use client';

import { useState } from 'react';
import { TabType, User, Tenant, Room, AddRoomData } from '@/types/rent';
import {
  initialRooms,
  initialLedger,
  initialSales,
  initialTenants,
  initialMessages,
} from '@/lib/mock-data';
import { AuthCard } from '@/components/auth/auth-card';
import { DesktopNavigation } from '@/components/layout/desktop-navigation';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { RoomTab } from '@/components/tabs/room-tab';
import { ReportTab } from '@/components/tabs/report-tab';
import { SalesTab } from '@/components/tabs/sales-tab';
import { UpdatesTab } from '@/components/tabs/updates-tab';
import { ChatTab } from '@/components/tabs/chat-tab';
import { TenantOnboardingModal } from '@/components/auth/tenant-onboarding-modal';

export function IrentLayout() {
  // Premium Demo Mode - Set to true for full access
  const PREMIUM_DEMO_MODE = true;

  // UI State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(PREMIUM_DEMO_MODE);
  const [currentUser, setCurrentUser] = useState<User | null>(
    PREMIUM_DEMO_MODE
      ? {
          email: 'landlord@example.com',
          password: 'password123',
          phone: '+63 9XX XXX XXXX',
          propertyAddress: '123 iRent St, Manila',
          role: 'landlord',
        }
      : null
  );

  // Subscription Tier - Set to 'premium' for full access
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'premium'>(
    PREMIUM_DEMO_MODE ? 'premium' : 'free'
  );

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('ROOM');

  // Utility Rate Configuration
  const [electricityRate, setElectricityRate] = useState(15);
  const [waterRate, setWaterRate] = useState(25);

  // Room Data
  const [rooms, setRooms] = useState(initialRooms);

  // Ledger Data
  const [ledger, setLedger] = useState(initialLedger);

  // Sales Data
  const [sales, setSales] = useState(initialSales);

  // Tenant Data
  const [tenants, setTenants] = useState(initialTenants);

  // Message Data
  const [messages, setMessages] = useState(initialMessages);

  // Auth Handler
  const handleSignIn = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  // Enhanced Add Room Handler (Captures Room + Tenant)
  const handleAddRoomWithTenant = (data: AddRoomData) => {
    const roomId = Math.random().toString(36).substr(2, 9);
    const tenantId = Math.random().toString(36).substr(2, 9);

    const newRoom: Room = {
      id: roomId,
      number: data.number,
      tenantName: data.tenantName,
      baseRent: data.baseRent,
      status: 'occupied',
    };

    const newTenant: Tenant = {
      id: tenantId,
      name: data.tenantName,
      avatar: data.tenantName.split(' ').map(n => n[0]).join('').toUpperCase(),
      email: data.email,
      password: data.password,
      role: 'tenant',
      isFirstLogin: true,
      roomId: roomId,
    };

    setRooms([...rooms, newRoom]);
    setTenants([...tenants, newTenant]);

    console.log('[v0] Provisioned new unit and tenant:', { newRoom, newTenant });
  };

  // Tenant Creation Handler (Assigning to existing vacant room)
  const handleCreateTenant = (roomId: string, email: string, password: string) => {
    const newTenant: Tenant = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Tenant',
      avatar: 'NT',
      email,
      password,
      role: 'tenant',
      isFirstLogin: true,
      roomId,
    };

    setTenants([...tenants, newTenant]);
    setRooms(rooms.map(room =>
      room.id === roomId
        ? { ...room, status: 'occupied', tenantName: 'Pending Onboarding' }
        : room
    ));
  };

  // Onboarding Completion Handler
  const handleOnboardingComplete = (updatedTenant: Tenant) => {
    setTenants(tenants.map(t => t.id === updatedTenant.id ? updatedTenant : t));
    setCurrentUser(updatedTenant);
    setRooms(rooms.map(room =>
      room.id === updatedTenant.roomId
        ? { ...room, tenantName: updatedTenant.name }
        : room
    ));
  };

  // Show auth screen if not logged in
  if (!isLoggedIn) {
    return <AuthCard onSignIn={handleSignIn} />;
  }

  const userRole = currentUser?.role || 'landlord';

  // Main dashboard layout
  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300">
      {/* Premium Badge */}
      {PREMIUM_DEMO_MODE && (
        <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          🚀 Premium Mode (Demo)
        </div>
      )}

      {/* Desktop Navigation */}
      <DesktopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      {/* Main Content Area - Slides with sidebar */}
      <main
        className={`transition-all duration-300 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-16'
        } mb-20 md:mb-0`}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Tab Content */}
          {activeTab === 'ROOM' && (
            <RoomTab
              rooms={rooms}
              onRoomClick={() => {}}
              onAddRoomWithTenant={handleAddRoomWithTenant}
              onCreateTenant={handleCreateTenant}
              isPremium={subscriptionTier === 'premium'}
              userRole={userRole}
            />
          )}

          {activeTab === 'REPORT' && (
            <ReportTab
              ledger={ledger}
              onMarkAsPaid={(entryId) => {
                setLedger(
                  ledger.map((entry) =>
                    entry.id === entryId
                      ? { ...entry, status: 'paid' as const }
                      : entry
                  )
                );
              }}
              onViewReceipt={() => {}}
            />
          )}

          {activeTab === 'SALES' && <SalesTab sales={sales} />}

          {activeTab === 'UPDATES' && (
            <UpdatesTab
              roomCount={rooms.length}
              subscriptionTier={subscriptionTier}
            />
          )}

          {activeTab === 'CHAT' && (
            <ChatTab
              tenants={tenants}
              messages={messages}
              onSendMessage={(message) => {
                setMessages([
                  ...messages,
                  {
                    id: Math.random().toString(),
                    sender: currentUser?.role === 'landlord' ? 'Landlord' : (currentUser as Tenant).name,
                    text: message,
                    timestamp: new Date(),
                    isLandlord: currentUser?.role === 'landlord',
                  },
                ]);
              }}
              onBroadcast={(message) => {
                console.log('[v0] Broadcast:', message);
              }}
              currentUser={currentUser}
            />
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tenant Onboarding Modal */}
      {currentUser?.role === 'tenant' && currentUser.isFirstLogin && (
        <TenantOnboardingModal
          tenant={currentUser}
          isOpen={true}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}
