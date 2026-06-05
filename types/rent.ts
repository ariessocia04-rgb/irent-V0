// Core data models for iRent application

export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type RoomStatus = 'occupied' | 'vacant';
export type TabType = 'ROOM' | 'REPORT' | 'SALES' | 'UPDATES' | 'CHAT';

// Room data model
export interface Room {
  id: string;
  number: string;
  tenantName: string;
  baseRent: number;
  status: RoomStatus;
}

// Ledger entry for payment tracking
export interface LedgerEntry {
  id: string;
  unit: string;
  tenant: string;
  month: string;
  totalBalance: number;
  status: PaymentStatus;
}

// Sales/financial data model
export interface SalesData {
  month: string;
  grossIncome: number;
  growth: number;
  roi: number;
}

// Tenant profile model
export interface Tenant {
  id: string;
  name: string;
  avatar: string;
}

// Chat message model
export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isLandlord: boolean;
}

// Landlord configuration
export interface LandlordInfo {
  email: string;
  phone: string;
  propertyAddress: string;
}

// IrentLayout props type
export interface IrentLayoutProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  landlordInfo: LandlordInfo;
  setLandlordInfo: (info: LandlordInfo) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  ledger: LedgerEntry[];
  setLedger: (ledger: LedgerEntry[]) => void;
  sales: SalesData[];
  setSales: (sales: SalesData[]) => void;
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  electricityRate: number;
  setElectricityRate: (rate: number) => void;
  waterRate: number;
  setWaterRate: (rate: number) => void;
}

// Billing Wizard props
export interface BillingWizardProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  electricityRate: number;
  waterRate: number;
  onInvoiceSend: (totalDue: number) => void;
}

// Tab component props
export interface RoomTabProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
  onAddRoom?: () => void;
}

export interface ReportTabProps {
  ledger: LedgerEntry[];
  onMarkAsPaid: (entryId: string) => void;
  onViewReceipt?: (entryId: string) => void;
}

export interface SalesTabProps {
  sales: SalesData[];
}

export interface UpdatesTabProps {
  roomCount: number;
}

export interface ChatTabProps {
  tenants: Tenant[];
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBroadcast: (message: string) => void;
}

// Empty state props
export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Calculation utility return type
export interface BillingCalculation {
  baseRent: number;
  electricityCost: number;
  waterCost: number;
  totalDue: number;
}
