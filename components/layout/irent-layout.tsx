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
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [landlordInfo, setLandlordInfo] = useState<LandlordInfo>(
    defaultLandlordInfo
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
              onAddRoom={() => {}}
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
            <UpdatesTab roomCount={rooms.length} />
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
