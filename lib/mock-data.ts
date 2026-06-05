import { Room, LedgerEntry, SalesData, Tenant, Message } from '@/types/rent';

export const initialRooms: Room[] = [
  {
    id: '1',
    number: '101',
    tenantName: 'Maria Santos',
    baseRent: 15000,
    status: 'occupied',
  },
];

export const initialLedger: LedgerEntry[] = [
  {
    id: '1',
    unit: '101',
    tenant: 'Maria Santos',
    month: 'June 2024',
    totalBalance: 15450,
    status: 'pending',
  },
  {
    id: '2',
    unit: '101',
    tenant: 'Maria Santos',
    month: 'May 2024',
    totalBalance: 15320,
    status: 'paid',
  },
];

export const initialSales: SalesData[] = [
  { month: 'January', grossIncome: 45000, growth: 0, roi: 0 },
  { month: 'February', grossIncome: 48500, growth: 7.8, roi: 2.4 },
  { month: 'March', grossIncome: 51200, growth: 5.6, roi: 3.1 },
  { month: 'April', grossIncome: 49800, growth: -2.7, roi: 2.8 },
  { month: 'May', grossIncome: 52100, growth: 4.6, roi: 3.3 },
  { month: 'June', grossIncome: 54300, growth: 4.2, roi: 3.6 },
];

export const initialTenants: Tenant[] = [
  {
    id: '1',
    name: 'Maria Santos',
    avatar: 'MS',
  },
  {
    id: '2',
    name: 'Juan dela Cruz',
    avatar: 'JC',
  },
  {
    id: '3',
    name: 'Ana Reyes',
    avatar: 'AR',
  },
];

export const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'Maria Santos',
    text: 'Good morning! Are you available to discuss the water issue?',
    timestamp: new Date(Date.now() - 3600000),
    isLandlord: false,
  },
  {
    id: '2',
    sender: 'Landlord',
    text: 'Yes, of course. What seems to be the problem?',
    timestamp: new Date(Date.now() - 3300000),
    isLandlord: true,
  },
  {
    id: '3',
    sender: 'Maria Santos',
    text: 'There is a small leak in the bathroom tap. It has been running all night.',
    timestamp: new Date(Date.now() - 3000000),
    isLandlord: false,
  },
  {
    id: '4',
    sender: 'Landlord',
    text: "I'll send a plumber tomorrow morning. Thank you for reporting it promptly.",
    timestamp: new Date(Date.now() - 2700000),
    isLandlord: true,
  },
];

export const defaultLandlordInfo = {
  email: '',
  phone: '',
  propertyAddress: '',
};
