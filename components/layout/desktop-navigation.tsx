'use client';

import { TabType } from '@/types/rent';
import {
  Home,
  BarChart3,
  TrendingUp,
  Settings,
  MessageCircle,
} from 'lucide-react';

interface DesktopNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const TAB_ICONS: Record<TabType, React.ReactNode> = {
  ROOM: <Home className="w-6 h-6" />,
  REPORT: <BarChart3 className="w-6 h-6" />,
  SALES: <TrendingUp className="w-6 h-6" />,
  UPDATES: <Settings className="w-6 h-6" />,
  CHAT: <MessageCircle className="w-6 h-6" />,
};

const TAB_LABELS: Record<TabType, string> = {
  ROOM: 'Rooms',
  REPORT: 'Reports',
  SALES: 'Sales',
  UPDATES: 'Updates',
  CHAT: 'Chat',
};

const TABS: TabType[] = ['ROOM', 'REPORT', 'SALES', 'UPDATES', 'CHAT'];

export function DesktopNavigation({
  activeTab,
  onTabChange,
  isExpanded,
  setIsExpanded,
}: DesktopNavigationProps) {
  return (
    <div
      className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 z-50 ${
        isExpanded ? 'w-64 shadow-xl' : 'w-16 shadow-sm'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-center h-16 border-b border-gray-100 px-4">
        {isExpanded ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">IR</span>
            </div>
            <h1 className="text-lg font-bold text-gray-950 truncate animate-in fade-in slide-in-from-left-2 duration-300">
              iRent v1.0
            </h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">IR</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 py-4 flex flex-col gap-2 px-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
              activeTab === tab
                ? 'bg-blue-50 text-[#1A73E8]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            title={TAB_LABELS[tab]}
          >
            <span className={`flex-shrink-0 ${activeTab === tab ? 'scale-110' : ''} transition-transform`}>
              {TAB_ICONS[tab]}
            </span>
            {isExpanded && (
              <span className="text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                {TAB_LABELS[tab]}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200 w-full`}
        >
          <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
          {isExpanded && (
            <span className="text-sm font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
