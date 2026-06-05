# iRent v1.0 - Complete File Inventory

## Project Status: ✅ READY FOR STEP-BY-STEP UPDATES

All files have been created and committed to the repository. Use this guide to navigate and update components one by one.

## Documentation (Start Here)

| File | Purpose |
|------|---------|
| `README_IRENT.md` | Project overview and quick start guide |
| `docs/IMPLEMENTATION_PLAN.md` | Complete architectural specification |
| `docs/ARCHITECTURE.md` | Technical reference and development patterns |
| `FILE_INVENTORY.md` | This file - navigation guide |

## Core Application Files

### Entry Point
- `app/page.tsx` - Main page component that renders IrentLayout
- `app/layout.tsx` - Root layout with iRent v1.0 metadata
- `app/globals.css` - Design system variables and animations

### Master Layout & Navigation
- `components/layout/irent-layout.tsx` - Master state management (auth, tabs, rates, data)
- `components/layout/desktop-navigation.tsx` - Icon rail sidebar (w-16 → w-64)
- `components/layout/mobile-bottom-nav.tsx` - Mobile sticky bottom navigation

### Authentication
- `components/auth/auth-card.tsx` - Sign-in/registration form with Material Design 3

### Dashboard Tabs
| Tab | Component | Purpose |
|-----|-----------|---------|
| Room | `components/tabs/room-tab.tsx` | Multi-tenant property grid + invoice trigger |
| Report | `components/tabs/report-tab.tsx` | Payment ledger with status toggle |
| Sales | `components/tabs/sales-tab.tsx` | ROI metrics and financial performance |
| Updates | `components/tabs/updates-tab.tsx` | Subscription tier management |
| Chat | `components/tabs/chat-tab.tsx` | Split-pane messaging + broadcast console |

### Billing System
- `components/billing/billing-wizard.tsx` - 3-step invoice modal (Electricity → Water → Calculation)
- `components/billing/billing-calculation-utils.ts` - Formula functions and currency formatting

### UI Components (shadcn/ui)
- `components/ui/button.tsx` - Action buttons
- `components/ui/card.tsx` - Card containers
- `components/ui/badge.tsx` - Status indicators
- `components/ui/dialog.tsx` - Modal dialogs
- `components/ui/input.tsx` - Text input fields
- `components/ui/table.tsx` - Data tables

### Utilities & Data
- `components/empty-states/empty-state.tsx` - Reusable empty state UI
- `lib/mock-data.ts` - Mock data for rooms, ledger, sales, tenants, messages
- `types/rent.ts` - TypeScript interfaces for all components

## File Statistics

- **Total Components**: 14
- **Total Utilities**: 3
- **Total Type Definitions**: 10+ interfaces
- **Total Documentation**: 4 files
- **Lines of Code**: ~3000+
- **Lines of Documentation**: ~1500+

## State Management Map

All state flows through `IrentLayout` (single source of truth):

```
IrentLayout
├── Authentication
│   ├── isLoggedIn: boolean
│   ├── landlordInfo: { email, phone, address }
│
├── Configuration
│   ├── electricityRate: 15 (₱/kWh)
│   ├── waterRate: 25 (₱/m³)
│
├── Navigation
│   ├── activeTab: 'ROOM' | 'REPORT' | 'SALES' | 'UPDATES' | 'CHAT'
│
└── Data Arrays
    ├── rooms: Room[]
    ├── ledger: LedgerEntry[]
    ├── sales: SalesData[]
    ├── tenants: Tenant[]
    └── messages: Message[]
```

## Component Props Flow Diagram

```
IrentLayout (Master State)
│
├─ AuthCard ← isLoggedIn, setIsLoggedIn
│
├─ Navigation
│  ├─ DesktopNavigation ← activeTab, setActiveTab
│  └─ MobileBottomNav ← activeTab, setActiveTab
│
└─ Tab Content
   ├─ RoomTab ← rooms, electricityRate, waterRate, callbacks
   ├─ ReportTab ← ledger, setLedger
   ├─ SalesTab ← sales
   ├─ UpdatesTab ← rooms, electricityRate, waterRate
   └─ ChatTab ← tenants, messages, setMessages, callbacks
      └─ BillingWizard ← room, electricityRate, waterRate
```

## Development Workflow Guide

### To Update a Component:

1. **Navigate to component file**
   ```
   components/tabs/[tab-name].tsx
   ```

2. **Review the TypeScript interface**
   ```
   types/rent.ts → Search for [ComponentName]Props
   ```

3. **Make changes**
   - Edit component logic
   - Update styles if needed
   - Keep TypeScript types aligned

4. **Test in browser**
   ```
   agent-browser open "http://localhost:3000"
   ```

5. **Commit to git**
   ```
   git add [files]
   git commit -m "feat: description of change"
   ```

### To Add a New Feature:

1. **Check existing patterns** in `docs/ARCHITECTURE.md`
2. **Add TypeScript interface** to `types/rent.ts`
3. **Update IrentLayout state** if needed
4. **Create/update component** in appropriate folder
5. **Pass props from parent**
6. **Test tab switching** for state persistence
7. **Commit with meaningful message**

## Key Design References

### Colors Used
```
Canvas:      #F8F9FA    (bg-slate-50)
Brand Blue:  #1A73E8    (custom hex)
Paid:        Emerald    (bg-emerald-50 text-emerald-700)
Pending:     Amber      (bg-amber-50 text-amber-700)
Overdue:     Rose       (bg-rose-50 text-rose-700)
Header:      #202124    (text-gray-950)
Body:        #5F6368    (text-gray-600)
```

### Typography
```
Headers:     font-semibold text-gray-950
Body:        text-gray-600
Numbers:     font-mono (monospace)
Sizes:       text-sm, text-base, text-lg, text-2xl
```

### Spacing Scale
```
Gaps:        gap-2, gap-4, gap-6, gap-8
Padding:     p-2, p-4, p-6, p-8
Margin:      space-y-2, space-y-4, space-y-6
```

## Billing Calculation Reference

```javascript
Total Due = Base Rent + ((Curr_Elec - Prev_Elec) × electricityRate) + ((Curr_Water - Prev_Water) × waterRate)

// Example:
// Base Rent: ₱1,500
// Electricity: 150 → 165 kWh (15 units × ₱15) = ₱225
// Water: 10 → 15 m³ (5 units × ₱25) = ₱125
// Total: ₱1,500 + ₱225 + ₱125 = ₱1,850
```

## Git Commit History

Recent commits (in order):
1. Initial setup with all components and utilities
2. Design system variables and animations
3. Comprehensive architecture documentation
4. Implementation plan guide
5. Project README and quick start
6. File inventory (this document)

## Commands Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check git status
git status

# View recent commits
git log --oneline -10

# View specific file in git
git show HEAD:components/layout/irent-layout.tsx
```

## Next Steps

### For Enhancement:
1. Review `docs/ARCHITECTURE.md` for patterns
2. Pick a feature to improve
3. Update component file
4. Test in browser
5. Commit with clear message
6. Repeat for next feature

### Priority Enhancements:
1. Add localStorage for auth persistence
2. Implement edit/update UI for rates
3. Add delete room functionality
4. Implement real message sending
5. Add receipt generation

## Support Resources

| Question | Answer |
|----------|--------|
| Where's the main state? | `components/layout/irent-layout.tsx` |
| How to add new tab? | Create new file in `components/tabs/`, add interface in `types/rent.ts` |
| How to style? | Use Tailwind classes from `app/globals.css` |
| How does auth work? | See `components/auth/auth-card.tsx` and `isLoggedIn` state |
| What's the formula? | Check `components/billing/billing-calculation-utils.ts` |
| How to test? | Use `agent-browser` commands in terminal |
| How to commit? | Use `git commit -m "type: description"` format |

---

**Repository Location**: `/vercel/share/v0-project/`

**Last Updated**: iRent v1.0 Complete Build

**Status**: ✅ Ready for step-by-step updates and enhancements
