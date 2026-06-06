'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatTabProps } from '@/types/rent';
import { EmptyState } from '@/components/empty-states/empty-state';
import { MessageCircle, Send, Rocket, User as UserIcon, MoreVertical, Phone, Video, Search } from 'lucide-react';

export function ChatTab({
  tenants,
  messages,
  onSendMessage,
  onBroadcast,
  currentUser,
}: ChatTabProps) {
  const [messageText, setMessageText] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(
    tenants.length > 0 ? tenants[0].id : null
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLandlord = currentUser?.role === 'landlord';

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedTenantId]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      onBroadcast('Important announcement from landlord');
      setIsBroadcasting(false);
    }, 1500);
  };

  const activeTenant = tenants.find(t => t.id === selectedTenantId);

  // If tenant, they only see messages with landlord
  const filteredMessages = isLandlord
    ? messages.filter(m => m.sender === 'Landlord' || activeTenant?.name === m.sender)
    : messages;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Messages</h1>
          <p className="text-gray-600 text-sm">
            {isLandlord ? 'Manage tenant communications' : 'Chat with your landlord'}
          </p>
        </div>
        {isLandlord && (
          <Button
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition-all hover:scale-105 active:scale-95"
          >
            {isBroadcasting ? (
              <span className="inline-block animate-spin mr-2">⚙️</span>
            ) : (
              <Rocket className="w-4 h-4 mr-2" />
            )}
            Broadcast Alert
          </Button>
        )}
      </div>

      <Card className="flex-1 border-gray-100 overflow-hidden flex bg-white shadow-lg rounded-xl">
        {/* Sidebar: Chat List (Only for Landlord) */}
        {isLandlord && (
          <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-100 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search tenants..."
                  className="pl-9 bg-white border-gray-100 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {tenants.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <EmptyState
                  icon={<UserIcon className="w-8 h-8 text-gray-300" />}
                  title="No tenants"
                  description=""
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {tenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => setSelectedTenantId(tenant.id)}
                    className={`w-full text-left px-4 py-4 border-b border-gray-100 transition-all ${
                      selectedTenantId === tenant.id
                        ? 'bg-white shadow-sm border-l-4 border-l-[#1A73E8]'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A73E8] to-blue-400 text-white text-sm font-bold flex items-center justify-center shadow-inner">
                          {tenant.avatar}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-sm font-bold text-gray-950 truncate">
                            {tenant.name}
                          </p>
                          <span className="text-[10px] text-gray-400 font-medium">10:45 AM</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate font-medium">
                          Click to view messages...
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Conversation Pane */}
        <div className="flex-1 flex flex-col bg-white">
          {isLandlord && (!selectedTenantId || !activeTenant) ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50/30">
              <div className="text-center max-w-xs">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-[#1A73E8]" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">Your Inbox</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Select a tenant from the list to view your conversation history and start messaging.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1A73E8] font-bold flex items-center justify-center text-sm shadow-sm">
                    {isLandlord ? activeTenant?.avatar : 'LL'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-950">
                      {isLandlord ? activeTenant?.name : 'Landlord (Property Management)'}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Online Now</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-blue-600"><Phone className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-blue-600"><Video className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-gray-400"><MoreVertical className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Message History */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 pattern-dots"
              >
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full shadow-sm">
                    Yesterday
                  </span>
                </div>

                {filteredMessages.map((msg) => {
                  const isOwnMessage = msg.isLandlord === isLandlord;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            isOwnMessage
                              ? 'bg-gradient-to-br from-[#1A73E8] to-blue-600 text-white rounded-tr-none'
                              : 'bg-white text-gray-950 rounded-tl-none border border-gray-100'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {isOwnMessage && <div className="w-3 h-3 text-blue-500">✓✓</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                  <Input
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="border-none bg-transparent focus-visible:ring-0 text-sm py-5"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-[#1A73E8] hover:bg-blue-600 text-white rounded-xl px-5 h-auto transition-all shadow-md active:scale-95"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span className="font-bold text-xs">SEND</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
