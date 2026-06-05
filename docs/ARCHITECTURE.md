# iRent Architecture Reference Guide

## File Structure Overview

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx (Updated with iRent metadata)
│   ├── page.tsx (Entry point using IrentLayout)
│   └── globals.css (Design variables + animations)
│
├── components/
│   ├── auth/
│   │   └── auth-card.tsx (Sign-in/registration Material Design 3 card)
│   │
│   ├── billing/
│   │   ├── billing-wizard.tsx (3-step modal: Electricity → Water → Calculation)
│   │   └── billing-calculation-utils.ts (Formula: Total = Rent + (Elec × Rate) + (Water × Rate))
│   │
│   ├── empty-states/
│   │   └── empty-state.tsx (Reusable empty UI component)
│   │
│   ├── layout/
│   │   ├── irent-layout.tsx (Master: Auth gate + state management + tab routing)
│   │   ├── desktop-navigation.tsx (Icon rail: w-16 → w-64 hover)
│   │   └── mobile-bottom-nav.tsx (Sticky bottom 64px nav)
│   │
│   ├── tabs/
│   │   ├── room-tab.tsx (Room grid + invoice wizard trigger)
│   │   ├── report-tab.tsx (Payment ledger + status toggle)
│   │   ├── sales-tab.tsx (ROI metrics + monthly performance)
│   │   ├── updates-tab.tsx (Pricing tiers + alert banner)
│   │   └── chat-tab.tsx (Split-pane messaging + broadcast)
│   │
│   └── ui/
│       ├── card.tsx (shadcn Card)
│       ├── badge.tsx (shadcn Badge)
│       ├── button.tsx (shadcn Button)
│       ├── dialog.tsx (shadcn Dialog)
│       ├── input.tsx (shadcn Input)
│       └── table.tsx (shadcn Table)
│
├── lib/
│   └── mock-data.ts (Mock rooms, ledger, sales, tenants, messages)
│
├── types/
│   └── rent.ts (TypeScript interfaces for all props/data)
│
└── docs/
    ├── IMPLEMENTATION_PLAN.md (This plan)
    ├── ARCHITECTURE.md (Architecture reference)
    └── COMPONENT_GUIDE.md (Component specifications)
```

## Component Hierarchy

```
IrentLayout (Master)
├── [isLoggedIn = false] → AuthCard
└── [isLoggedIn = true] → Dashboard
    ├── DesktopNavigation (md: and up)
    │   └── Tab buttons (ROOM, REPORT, SALES, UPDATES, CHAT)
    ├── MobileBottomNav (below md:)
    │   └── Tab buttons (ROOM, REPORT, SALES, UPDATES, CHAT)
    └── Tab Content
        ├── RoomTab
        │   └── BillingWizard (triggered on room click)
        ├── ReportTab
        ├── SalesTab
        ├── UpdatesTab
        └── ChatTab
```

## State Management Pattern

All state is lifted to `IrentLayout` and passed down as props:

```typescript
// IrentLayout manages:
- isLoggedIn: boolean
- landlordInfo: { email, phone, address }
- activeTab: 'ROOM' | 'REPORT' | 'SALES' | 'UPDATES' | 'CHAT'
- electricityRate: number (default: 15)
- waterRate: number (default: 25)
- rooms: Room[]
- ledger: LedgerEntry[]
- sales: SalesData[]
- tenants: Tenant[]
- messages: Message[]

// Tab components receive typed props and call callbacks:
<RoomTab rooms={rooms} onRoomClick={handleRoomClick} onAddRoom={handleAddRoom} />
```

## Key Features Implementation

### 1. Authentication Flow
```
User loads app
↓
isLoggedIn = false
↓
AuthCard renders (email, password, phone, address inputs)
↓
User submits form
↓
isLoggedIn = true + landlordInfo saved
↓
Dashboard with 5 tabs appears
```

### 2. Billing Wizard Flow
```
User clicks room card
↓
BillingWizard modal opens (Dialog component)
↓
Step 1: Electricity meter simulator
  - User enters/simulates previous & current readings
  - Clicking "Simulate Meter Snap" auto-fills values
  - Next button → Step 2
↓
Step 2: Water meter simulator
  - Same pattern as electricity
  - Next button → Step 3
↓
Step 3: Invoice calculation & preview
  - Formula calculates: Base + (Elec × Rate) + (Water × Rate)
  - Shows breakdown grid with monospace numbers
  - "Send Invoice to Tenant" button completes action
```

### 3. Empty State Pattern
```
if (dataArray.length === 0) {
  <EmptyState
    icon={<SomeIcon />}
    title="No items"
    description="Action description"
  />
} else {
  <DataDisplay data={dataArray} />
}
```

### 4. Payment Status Workflow
```
User sees "Mark as Paid" button (Pending badge in amber)
↓
Click button
↓
Badge animates: scale-in transition-all duration-300
↓
Status changes: Amber → Emerald
↓
Data updates in IrentLayout state
```

### 5. Icon Rail Navigation
```
Desktop (md: and up):
- Sidebar width: w-16 (64px)
- On hover: width expands to w-64 (256px)
- Transition: transition-all duration-300
- Icons visible always
- Labels visible on expanded state
- "iRent v1.0" header shows on expanded

Mobile (below md:):
- Bottom sticky bar height: 64px
- Icons + text always visible
- Full-width buttons stacked
```

## Type Safety Contract

All components use strongly-typed props from `types/rent.ts`:

```typescript
interface RoomTabProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
  onAddRoom: () => void;
}

interface BillingWizardProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  electricityRate: number;
  waterRate: number;
  onInvoiceSend: (totalDue: number) => void;
}

// ... and so on for each component
```

## Design System Reference

### Colors
- Canvas: `bg-slate-50` (`#F8F9FA`)
- Brand: `bg-[#1A73E8]` (Google Blue)
- Paid: `bg-emerald-50 text-emerald-700`
- Pending: `bg-amber-50 text-amber-700`
- Overdue: `bg-rose-50 text-rose-700`

### Typography
- Headers: `font-semibold text-gray-950`
- Body: `text-gray-600`
- Numbers: `font-mono`

### Spacing
- Card padding: `p-4` or `p-6`
- Gap between items: `gap-4`
- Section margin: `space-y-6`

### Animations
- Buttons: `hover:scale-105 transition-all duration-200`
- Icon rail: `transition-all duration-300`
- Badges: `scale-in transition-all duration-300`

## Billing Formula Implementation

```typescript
// In components/billing/billing-calculation-utils.ts
export function calculateTotalDue(
  baseRent: number,
  prevElectricity: number,
  currElectricity: number,
  prevWater: number,
  currWater: number,
  electricityRate: number,
  waterRate: number
): number {
  const electricityCost = (currElectricity - prevElectricity) * electricityRate;
  const waterCost = (currWater - prevWater) * waterRate;
  return baseRent + electricityCost + waterCost;
}
```

## Responsive Design Breakpoints

- **Mobile**: < 640px (below `sm:`)
  - Full-width content
  - Stacked layouts
  - Bottom sticky nav only
  - Touch-friendly buttons (min 44px)

- **Tablet**: 640px - 1024px (`sm:` to `lg:`)
  - 2-column grids
  - Responsive typography
  - Hybrid nav layout

- **Desktop**: 1024px+ (`lg:`)
  - Left sidebar navigation
  - 3-column grids
  - Full icon rail expansion
  - Horizontal layouts

## Development Workflow for Updates

1. **Identify component to update**: Check `components/` folder
2. **Review types**: Check `types/rent.ts` for prop interfaces
3. **Update component**: Use Edit tool to modify component file
4. **Test in browser**: Use agent-browser to verify changes
5. **Commit to git**: Record changes with meaningful messages
6. **Review state flow**: Ensure data flows through IrentLayout properly

## Common Patterns

### Adding a new room to state:
```typescript
const handleAddRoom = () => {
  const newRoom = { id: uuid(), number: '101', tenantName: 'New Tenant', baseRent: 1500, status: 'vacant' };
  setRooms([...rooms, newRoom]);
};
```

### Updating payment status:
```typescript
const handleMarkAsPaid = (entryId: string) => {
  setLedger(ledger.map(entry =>
    entry.id === entryId ? { ...entry, status: 'paid' } : entry
  ));
};
```

### Formatting currency:
```typescript
export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}
```

## Troubleshooting Guide

### Issue: Component not rendering
→ Check `isLoggedIn` state in IrentLayout
→ Verify component is exported correctly
→ Check TypeScript prop types match

### Issue: Animations not smooth
→ Ensure `transition-all duration-300` is applied
→ Check z-index for modal overlays
→ Verify CSS variables loaded from globals.css

### Issue: Data lost on tab switch
→ Verify state is lifted to IrentLayout
→ Check props are passed correctly from parent
→ Use `useCallback` for event handlers to prevent re-renders

## Next Steps for Enhancement

1. **Add persistent storage**: LocalStorage or backend API
2. **Implement real authentication**: Replace mock auth with JWT
3. **Add database integration**: Supabase or Firebase
4. **Implement notifications**: Toast notifications for actions
5. **Add export functionality**: CSV/PDF export for reports
6. **Real-time updates**: WebSockets for multi-user support
7. **Settings panel**: Configurable rates and preferences
