'use client';

import { useState } from 'react';
import { TabType, LandlordInfo } from '@/types/rent';
import {
  initialRooms,
  initialLedger,
  initialSales,
  initialTenants,
  initialMessages,
  defaultLandlordInfo,
} from '@/lib/mock-data';
import { AuthCard } from '@/components/auth/auth-card';
import { DesktopNavigation } from '@/components/layout/desktop-navigation';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { RoomTab } from '@/components/tabs/room-tab';
import { ReportTab } from '@/components/tabs/report-tab';
import { SalesTab } from '@/components/tabs/sales-tab';
import { UpdatesTab } from '@/components/tabs/updates-tab';
import { ChatTab } from '@/components/tabs/chat-tab';

export function IrentLayout() {
  // Premium Demo Mode - Set to true for full access
  const PREMIUM_DEMO_MODE = true;

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(PREMIUM_DEMO_MODE);
  const [landlordInfo, setLandlordInfo] = useState<LandlordInfo>(
    PREMIUM_DEMO_MODE
      ? {
          email: 'premium@demo.com',
          password: 'demo',
          phone: '+63 9XX XXX XXXX',
          propertyAddress: 'Premium Demo Property',
        }
      : defaultLandlordInfo
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
  const handleSignIn = (info: LandlordInfo) => {
    setLandlordInfo(info);
    setIsLoggedIn(true);
  };

  // Show auth screen if not logged in
  if (!isLoggedIn) {
    return <AuthCard onSignIn={handleSignIn} />;
  }

  // Main dashboard layout
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Badge */}
      {PREMIUM_DEMO_MODE && (
        <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          🚀 Premium Mode (Demo)
        </div>
      )}

      {/* Desktop Navigation */}
      <DesktopNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="md:ml-16 mb-20 md:mb-0">
        <div className="p-6 md:p-8">
          {/* Tab Content */}
          {activeTab === 'ROOM' && (
            <RoomTab
              rooms={rooms}
              onRoomClick={() => {}}
              onAddRoom={() => {
                // Premium users can add unlimited rooms
                if (subscriptionTier === 'premium') {
                  const newRoom = {
                    id: Math.random().toString(),
                    number: String(rooms.length + 101),
                    tenantName: `Tenant ${rooms.length + 1}`,
                    baseRent: 1500,
                    status: 'vacant' as const,
                  };
                  setRooms([...rooms, newRoom]);
                }
              }}
              isPremium={subscriptionTier === 'premium'}
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
                    sender: 'Landlord',
                    text: message,
                    timestamp: new Date(),
                    isLandlord: true,
                  },
                ]);
              }}
              onBroadcast={(message) => {
                console.log('[v0] Broadcast:', message);
              }}
            />
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
