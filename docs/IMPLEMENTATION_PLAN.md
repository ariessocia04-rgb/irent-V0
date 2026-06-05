# iRent Management App - Implementation Plan

## Project Overview
Build a responsive room rental management application with 5 interactive tabs following Google Material Design 3 principles, with distinct desktop (left sidebar) and mobile (bottom navigation) layouts.

## Architecture Overview

### 1. Core Design System & Tailwind Configuration
**Canvas & Surface**:
- Canvas Background: `bg-slate-50` (Tailwind) = `#F8F9FA` - viewport wrapper
- Surface Panels: White (`#FFFFFF`) with `border-gray-100` borders and `shadow-sm` elevation

**Typography**:
- Headers/Bold: Off-Black `text-gray-950` (`#202124`)
- Body Text: Slate Gray `text-gray-600` (`#5F6368`)
- Numbers: Monospace font (`font-mono`) for financial data
- Standard clean system sans-serif (Tailwind default)

**Color Tokens**:
- Google Blue Brand: `bg-[#1A73E8]` (custom hex for primary actions)
- Emerald Semantic: `bg-emerald-50 text-emerald-700` (Paid status)
- Amber Semantic: `bg-amber-50 text-amber-700` (Pending status)
- Rose Semantic: `bg-rose-50 text-rose-700` (Overdue status)
- Premium Gradient: `from-indigo-600 via-purple-600 to-pink-600` (Gemini tier alert banner)

**CSS Implementation**:
- Update `app/globals.css` with custom CSS variables for brand colors
- Leverage Tailwind 4.2+ with shadcn base-nova foundation
- Add smooth transition utilities for hover/active state animations

### 2. Master Responsive Persistent Layout

**IrentLayout** (`components/layout/irent-layout.tsx`)
- **Role**: Master shell managing unified view with single tab context state
- **Authentication Gate**: 
  - `isLoggedIn` state (default: false) controls initial view
  - When false: Renders beautiful Material Design 3 Sign-In/Setup card collecting Landlord Info (Email, Password, Phone, Property Address)
  - When true: Displays 5-tab dashboard with full functionality
  - Card includes validation, submit button, and link to toggle between Sign-In and Registration modes
- **State Management**: 
  - `activeTab` state tracks current view: 'ROOM' | 'REPORT' | 'SALES' | 'UPDATES' | 'CHAT'
  - **Configuration rates** (dynamic, editable by owner):
    - `electricityRate` (default: 15) - ₱ per kWh
    - `waterRate` (default: 25) - ₱ per m³
  - All operational mock data (rooms, ledger, messages) lifted here for seamless preservation during tab switching
- **Responsive Switching**: Uses `md:` breakpoint to toggle between desktop and mobile layouts
- **Desktop Layout**: Fixed left sidebar (DesktopNavigation) + main content area
- **Mobile Layout**: Main content area + fixed bottom sticky navigation (MobileBottomNav)

**DesktopNavigation** (`components/layout/desktop-navigation.tsx`)
- **Icon Rail Pattern**: Left sidebar fixed at `w-16` (64px) per Google Material Design 3 standard
- **Visual States**:
  - Default: Compact icons only, `w-16`, showing only lucide-react icons for each tab
  - Hover: Expands to `w-64`, smooth `transition-all duration-300`, revealing full tab labels + "iRent v1.0" header text
  - Active Tab: Highlighted with brand color (`bg-blue-100` or subtle highlight)
- **Interactive Features**:
  - Hover tooltips on each icon (ROOM, REPORT, SALES, UPDATES, CHAT)
  - Smooth CSS transition (no JavaScript animation) for width expansion
  - All icons from lucide-react with consistent sizing (24px)
  - Click handler updates `activeTab` state in parent IrentLayout

**MobileBottomNav** (`components/layout/mobile-bottom-nav.tsx`)
- **Layout**: Fixed bottom sticky bar (height: 64px)
- **Design**: 
  - Multi-row flex layout optimized for single-thumb access
  - Icon + text labels centered per button
  - Large touch targets (minimum 44px) for ergonomic mobile interaction
  - Background: White with `border-t border-gray-100`
- **Visibility**: Only displayed on mobile breakpoints (below `md:` threshold)

### 3. Modular Tab Specifications

**ROOM TAB** (`components/tabs/room-tab.tsx`)
- **Empty State**: If `rooms.length === 0`, display centered Material Design 3 empty state with:
  - Subtle lucide icon (e.g., `Home` icon in gray)
  - Headline text: "No rooms configured"
  - Description: "Click '+ Add New Room' above to create your first unit."
  - Optional: Small illustration or empty card placeholder
- **Header Controls**: 
  - Button labeled "+ Add New Room"
  - **Conditional Logic**: If `rooms.length >= 1`, switch button to disabled styling with alert subtitle ("Free Tier: Max 1 room reached")
- **Card Grid**: Multi-tenant rental card layout displaying:
  - Room Number, Tenant Name, Base Rent amount (in ₱, monospace font), Status Badge
- **Wizard Handler**: Clicking any room card opens BillingWizard modal
- **Mock Data**: Structured room array lifted to IrentLayout for state preservation

**BillingWizard Modal** (`components/billing/billing-wizard.tsx`)
- **Container**: Built using `shadcn/ui Dialog` component
- **Step Tracking**: Local state tracks wizard progress (1 → 2 → 3)
- **Step 1 - Electricity OCR Simulator**:
  - Animated scanner viewfinder: Radial blinking circle animation (CSS-based)
  - Button: "📷 Simulate Meter Snap" with temporary loading spinner
  - Editable fields: "Previous Meter (kWh)" and "Current Meter (kWh)" text inputs
  - Interactive update: Clicking meter snap auto-fills realistic simulated values
- **Step 2 - Water OCR Simulator**:
  - Identical layout to electricity step
  - Editable fields: "Previous Meter (m³)" and "Current Meter (m³)" text inputs
  - Same loading spinner and simulation behavior
- **Step 3 - Calculation Sheet Matrix**:
  - **Explicit Formula** (uses dynamic rates from parent state): `Total Due = Base Rent + ((Current Elec - Prev Elec) * electricityRate) + ((Current Water - Prev Water) * waterRate)`
  - Display breakdown grid with monospace numbers and Philippine Peso formatting
  - Action Button: "Send Invoice to Tenant" (primary action, blue background)

**REPORT TAB** (`components/tabs/report-tab.tsx`)
- **Empty State**: If `ledger.length === 0`, display centered Material Design 3 empty state
- **Table Structure**: Wide accounting ledger using `shadcn/ui Table`
- **Columns**: Unit | Tenant | Month | Cost (₱, monospace) | Status | Action
- **Payment Status Badge**: Pending (amber), Paid (emerald), Overdue (rose)
- **Interactive Mark as Paid**: Button updates badge with smooth animation

**SALES TAB** (`components/tabs/sales-tab.tsx`)
- 3 metric cards: Total Gross Income, Month-on-Month Growth, Year-on-Year ROI
- Financial performance grid with chronological monthly data

**UPDATES TAB** (`components/tabs/updates-tab.tsx`)
- Alert banner for free tier restrictions with Gemini gradient
- 3 pricing tier comparison cards (Free, Pro, Premium AI)

**CHAT TAB** (`components/tabs/chat-tab.tsx`)
- Split-pane layout with tenant list (left) and message log (right)
- Empty states for no tenants and no messages
- Administrative broadcast console section below

### 4. State Management & Data Architecture

**Lifted State in IrentLayout**:
- `isLoggedIn` (boolean, default: false) - Controls auth gate visibility
- `landlordInfo` (object) - Stores email, phone, property address
- `electricityRate` (number, default: 15) - ₱ per kWh (configurable)
- `waterRate` (number, default: 25) - ₱ per m³ (configurable)
- `rooms`, `ledger`, `sales`, `tenants`, `messages` arrays - All lifted for tab switching preservation

**Component Structure**:
- Tab components receive data via typed props from IrentLayout
- Local state for UI interactions (wizard steps, input fields)
- React hooks only; prepared for Zustand/Redux migration

**shadcn/ui Components**:
- Dialog, Card, Badge, Button, Table, Input - All core UI elements

### 5. Interactive Features & Animations

**Empty State UI Patterns**:
- Subtle lucide icons in gray
- Light gray typography
- Centered flex layouts
- Consistent messaging across all tabs

**Animations**:
- Button hover scale: `hover:scale-105 transition-all duration-200`
- Icon rail expansion: `transition-all duration-300`
- Badge transitions: `scale-in transition-all duration-300`

### 6. Implementation Files & Directory Structure

**Type Safety** (`types/rent.ts`):
- Central TypeScript definitions for all props and data models
- Interfaces: Room, LedgerEntry, SalesData, Tenant, Message, LandlordInfo

**Components Created**:
- `components/auth/auth-card.tsx` - Sign-in/registration
- `components/layout/irent-layout.tsx` - Master wrapper with state
- `components/layout/desktop-navigation.tsx` - Icon rail sidebar
- `components/layout/mobile-bottom-nav.tsx` - Mobile nav
- `components/tabs/room-tab.tsx` - Room management
- `components/tabs/report-tab.tsx` - Payment ledger
- `components/tabs/sales-tab.tsx` - Analytics
- `components/tabs/updates-tab.tsx` - Pricing tiers
- `components/tabs/chat-tab.tsx` - Messaging
- `components/billing/billing-wizard.tsx` - 3-step modal
- `components/billing/billing-calculation-utils.ts` - Formulas
- `components/empty-states/empty-state.tsx` - Reusable empty UI
- `lib/mock-data.ts` - Mock data structure
- `components/ui/dialog.tsx` - Dialog component

**Files Updated**:
- `app/page.tsx` - Entry point with IrentLayout
- `app/globals.css` - Design variables and animations
- `app/layout.tsx` - Metadata updates

## Billing Formula Reference

```javascript
Total Due = Base Rent + ((Current Electricity - Previous Electricity) × electricityRate) + ((Current Water - Previous Water) × waterRate)
```

**Default Rates**:
- Electricity: ₱15/kWh
- Water: ₱25/m³

## Color & Design System Reference

**Palette**:
- Canvas: `#F8F9FA` (bg-slate-50)
- Brand Blue: `#1A73E8`
- Paid: `bg-emerald-50 text-emerald-700`
- Pending: `bg-amber-50 text-amber-700`
- Overdue: `bg-rose-50 text-rose-700`

**Typography**:
- Headers: Off-Black `#202124`
- Body: Slate Gray `#5F6368`
- Numbers: Monospace font

## Status: Complete

The iRent v1.0 application has been fully implemented with all planned features:
✓ Authentication system
✓ 5-tab dashboard (Rooms, Reports, Sales, Updates, Chat)
✓ Dynamic billing wizard with formula calculation
✓ Material Design 3 empty states
✓ Type-safe component architecture
✓ Responsive desktop/mobile layouts
✓ Icon rail navigation with hover expansion
✓ Mock data with tab state preservation
