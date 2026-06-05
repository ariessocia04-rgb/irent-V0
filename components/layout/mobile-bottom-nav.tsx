'use client';

import { TabType } from '@/types/rent';
import {
  Home,
  BarChart3,
  TrendingUp,
  Settings,
  MessageCircle,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TAB_ICONS: Record<TabType, React.ReactNode> = {
  ROOM: <Home className="w-5 h-5" />,
  REPORT: <BarChart3 className="w-5 h-5" />,
  SALES: <TrendingUp className="w-5 h-5" />,
  UPDATES: <Settings className="w-5 h-5" />,
  CHAT: <MessageCircle className="w-5 h-5" />,
};

const TAB_LABELS: Record<TabType, string> = {
  ROOM: 'Rooms',
  REPORT: 'Reports',
  SALES: 'Sales',
  UPDATES: 'Updates',
  CHAT: 'Chat',
};

const TABS: TabType[] = ['ROOM', 'REPORT', 'SALES', 'UPDATES', 'CHAT'];

export function MobileBottomNav({
  activeTab,
  onTabChange,
}: MobileBottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-20">
      <div className="flex items-center justify-around h-full">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors ${
              activeTab === tab
                ? 'text-[#1A73E8]'
                : 'text-gray-600'
            }`}
          >
            {TAB_ICONS[tab]}
            <span className="text-xs font-medium text-center">
              {TAB_LABELS[tab]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
