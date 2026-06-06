'use client';

import { useState, useEffect } from 'react';
import { TabType, User, Tenant, Room, AddRoomData, LedgerEntry, Message } from '@/types/rent';
import { AuthCard } from '@/components/auth/auth-card';
import { DesktopNavigation } from '@/components/layout/desktop-navigation';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { RoomTab } from '@/components/tabs/room-tab';
import { ReportTab } from '@/components/tabs/report-tab';
import { SalesTab } from '@/components/tabs/sales-tab';
import { UpdatesTab } from '@/components/tabs/updates-tab';
import { ChatTab } from '@/components/tabs/chat-tab';
import { TenantOnboardingModal } from '@/components/auth/tenant-onboarding-modal';
import { supabase } from '@/lib/supabase';

export function IrentLayout() {
  // UI State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Subscription Tier
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'premium'>('free');

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('ROOM');

  // Data State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initial Data Fetching
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const role = roleData?.role === 'owner' ? 'landlord' : 'tenant';

        if (role === 'landlord') {
          setCurrentUser({
            email: session.user.email!,
            phone: profileData?.phone || '',
            propertyAddress: profileData?.property_address || '',
            role: 'landlord',
          });
          setSubscriptionTier('premium');
        } else {
          setCurrentUser({
            id: session.user.id,
            name: profileData?.full_name || 'Tenant',
            avatar: (profileData?.full_name || 'T').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            email: session.user.email!,
            role: 'tenant',
            isFirstLogin: false,
          });
        }
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchRooms();
      fetchTenants();
      fetchMessages();
    }
  }, [isLoggedIn, currentUser]);

  const fetchRooms = async () => {
    const { data } = await supabase.from('rooms').select('*');
    if (data) {
      setRooms(data.map(r => ({
        id: r.id,
        number: r.room_number,
        tenantName: r.tenant_name || '',
        baseRent: parseFloat(r.base_rent),
        status: r.status as 'occupied' | 'vacant',
      })));
    }
  };

  const fetchTenants = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, user_roles!inner(role)')
      .eq('user_roles.role', 'tenant');

    if (data) {
      setTenants(data.map(t => ({
        id: t.id,
        name: t.full_name || 'New Tenant',
        avatar: (t.full_name || 'T').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        email: t.email,
        role: 'tenant',
      })));
    }
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data.map(m => ({
        id: m.id,
        sender: m.is_landlord ? 'Landlord' : 'Tenant',
        text: m.text,
        timestamp: new Date(m.created_at),
        isLandlord: m.is_landlord,
      })));
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const messageChannel = supabase
      .channel('messages-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as any;
        setMessages(prev => [...prev, {
          id: newMessage.id,
          sender: newMessage.is_landlord ? 'Landlord' : 'Tenant',
          text: newMessage.text,
          timestamp: new Date(newMessage.created_at),
          isLandlord: newMessage.is_landlord,
        }]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [isLoggedIn]);

  const handleSignIn = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleAddRoomWithTenant = async (data: AddRoomData) => {
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .insert({
        room_number: data.number,
        base_rent: data.baseRent,
        tenant_name: data.tenantName,
        status: 'occupied'
      })
      .select()
      .single();

    if (roomError) {
      console.error('Room creation error:', roomError);
      return;
    }

    // Call backend to create tenant auth account
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/create-tenant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.tenantName,
          roomId: roomData.id
        })
      });

      if (!response.ok) {
        console.error("Backend error:", await response.json());
      }
    } catch (err) {
      console.error("Failed to connect to backend:", err);
    }

    fetchRooms();
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;

    const isLandlord = currentUser.role === 'landlord';
    const { error } = await supabase.from('messages').insert({
      text,
      is_landlord: isLandlord,
      sender_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (error) console.error('Send message error:', error);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-blue-600 animate-pulse text-2xl uppercase tracking-tighter">iRent INITIALIZING...</div>;
  }

  if (!isLoggedIn) {
    return <AuthCard onSignIn={handleSignIn} />;
  }

  const userRole = currentUser?.role || 'landlord';

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300">
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-[60] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
        ⚡ Live Production Mode
      </div>

      <DesktopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        onLogout={handleLogout}
      />

      <main
        className={`transition-all duration-300 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-16'
        } mb-20 md:mb-0`}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'ROOM' && (
            <RoomTab
              rooms={rooms}
              onRoomClick={() => {}}
              onAddRoomWithTenant={handleAddRoomWithTenant}
              isPremium={subscriptionTier === 'premium'}
              userRole={userRole}
            />
          )}

          {activeTab === 'REPORT' && (
            <ReportTab
              ledger={ledger}
              onMarkAsPaid={(entryId) => {}}
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
              onSendMessage={handleSendMessage}
              onBroadcast={(message) => {
                console.log('[v0] Broadcast:', message);
              }}
              currentUser={currentUser}
            />
          )}
        </div>
      </main>

      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {currentUser?.role === 'tenant' && (currentUser as Tenant).isFirstLogin && (
        <TenantOnboardingModal
          tenant={currentUser as Tenant}
          isOpen={true}
          onComplete={() => {}}
        />
      )}
    </div>
  );
}
