'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatTabProps } from '@/types/rent';
import { EmptyState } from '@/components/empty-states/empty-state';
import { MessageCircle, Send, Rocket } from 'lucide-react';
import { User } from 'lucide-react';

export function ChatTab({
  tenants,
  messages,
  onSendMessage,
  onBroadcast,
}: ChatTabProps) {
  const [messageText, setMessageText] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(
    tenants.length > 0 ? tenants[0].id : null
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Messaging</h1>
        <p className="text-gray-600 text-sm mt-1">
          Communicate with your tenants
        </p>
      </div>

      {/* Main Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-96">
        {/* Tenant List */}
        <Card className="lg:col-span-1 border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-950 text-sm">
              Active Tenants
            </h3>
          </div>

          {tenants.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <EmptyState
                icon={<User className="w-8 h-8" />}
                title="No tenants"
                description="Start adding tenants to begin conversations."
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => setSelectedTenantId(tenant.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
                    selectedTenantId === tenant.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A73E8] text-white text-xs font-semibold flex items-center justify-center">
                      {tenant.avatar}
                    </div>
                    <p className="text-sm font-medium text-gray-950">
                      {tenant.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 border-gray-100 flex flex-col">
          {!selectedTenantId || tenants.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<MessageCircle className="w-12 h-12" />}
                title="Select a tenant"
                description="Messages will appear here once you select a tenant to chat with."
              />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isLandlord ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.isLandlord
                            ? 'bg-[#1A73E8] text-white'
                            : 'bg-gray-100 text-gray-950'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.isLandlord
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="border-gray-100"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Broadcast Console */}
      <Card className="p-6 border-gray-100 bg-white">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-950">
              One-Way Administrative Broadcast Console
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Send important announcements to all tenants
            </p>
          </div>
          <Button
            onClick={handleBroadcast}
            disabled={isBroadcasting}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            {isBroadcasting ? (
              <>
                <span className="inline-block animate-spin mr-2">⚙️</span>
                Dispatching...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Dispatch Broadcast Alert
              </>
            )}
          </Button>
          {isBroadcasting && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                Broadcasting announcement to all tenants...
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
