# Premium Mode Guide - iRent v1.0

## Overview
Premium Mode is a demo feature that gives you full access to all iRent features without tier restrictions. It's perfect for testing and showcasing the app's premium capabilities.

---

## How to Enable Premium Mode

Open `components/layout/irent-layout.tsx` and set:

```typescript
const PREMIUM_DEMO_MODE = true;
```

**Default Status**: `true` (Premium mode is active)

---

## What's Included in Premium Mode

### Auto-Login
- No authentication screen needed
- Automatically logged in as `premium@demo.com`
- Phone: `+63 9XX XXX XXXX`
- Property: `Premium Demo Property`

### Rooms Management
- **No Room Limit**: Create unlimited rooms (no 1-room free tier cap)
- **Add Room Button**: Always enabled and fully functional
- **Premium Badge**: Shows "✨ Premium Mode: Unlimited rooms available"
- **Features**: Full access to all room management features

### Subscription Tier
- **Active Tier**: Premium AI ($299/month equivalent)
- **Status**: Shows "Current Plan" button (not "Get Premium")
- **Badge**: Displays "Active ✓" on Premium AI card
- **Banner**: Green gradient "Premium Tier Active" message
- **Access**: All premium features unlocked

### Features Available in Premium Mode

#### Room Management
- ✓ Create unlimited rooms
- ✓ Edit room details
- ✓ Track room status (occupied/vacant)
- ✓ View base rent information

#### Billing & Invoicing
- ✓ 3-step billing wizard with meter simulation
- ✓ Dynamic electricity rates (₱15/kWh)
- ✓ Dynamic water rates (₱25/m³)
- ✓ Send invoices to tenants
- ✓ Full invoice preview

#### Reporting
- ✓ Payment tracking ledger
- ✓ Mark payments as paid
- ✓ View detailed receipts
- ✓ Payment status updates

#### Analytics
- ✓ ROI metrics and calculations
- ✓ Month-on-Month growth tracking
- ✓ Year-on-Year ROI analysis
- ✓ Financial performance timeline

#### Messaging
- ✓ Split-pane chat interface
- ✓ Send messages to tenants
- ✓ Broadcast global announcements
- ✓ Full message history

#### System
- ✓ Desktop icon rail navigation
- ✓ Mobile bottom navigation
- ✓ All 5 dashboard tabs
- ✓ Responsive design (all breakpoints)

---

## UI Indicators

### Premium Badge
- **Location**: Top-right corner, fixed position
- **Color**: Purple/Indigo gradient
- **Text**: "🚀 Premium Mode (Demo)"
- **Always Visible**: On every screen

### Room Tab Banner
- **When Shown**: Always in Premium mode
- **Text**: "✨ Premium Mode: Unlimited rooms available"
- **Color**: Gradient indigo to purple
- **Purpose**: Confirms unlimited room access

### Updates Tab
- **Free Tier Card**: Shows normal state
- **Pro Tier Card**: Shows normal state
- **Premium AI Card**: 
  - Background: Emerald gradient
  - Border: Emerald ring
  - Status: "Active ✓" badge
  - Button: "Current Plan" (green)

- **Top Banner**: 
  - Text: "Premium Tier Active: Unlimited rooms and full feature access"
  - Color: Emerald/green gradient
  - Animation: Slide-in effect

---

## Switching Modes

### To Disable Premium Mode
Edit `components/layout/irent-layout.tsx`:

```typescript
// Change this:
const PREMIUM_DEMO_MODE = true;

// To this:
const PREMIUM_DEMO_MODE = false;
```

Then the app will:
- Show authentication screen
- Require login with email/password
- Reset to free tier (1 room max)
- Show free tier restrictions

---

## Test Scenarios

### Scenario 1: Add Multiple Rooms
1. Click "+ Add New Room" button
2. Observe: New room (102, 103, etc.) is created
3. No "max reached" warning appears
4. Button remains enabled

### Scenario 2: Check Tier Status
1. Navigate to Updates tab
2. Observe: 
   - Premium AI card has green styling
   - "Active ✓" badge appears
   - "Current Plan" button shown
   - Green banner confirms unlimited rooms

### Scenario 3: Create Invoice
1. Click any room's "Create Invoice" button
2. Step through 3-step wizard:
   - Electricity meter simulation
   - Water meter simulation
   - Calculation preview
3. Premium features: No limits on invoices

### Scenario 4: Responsive Design
1. Test on desktop (full icon rail)
2. Test on tablet (responsive grid)
3. Test on mobile (bottom navigation)
4. All features work in all modes

---

## Feature Comparison

| Feature | Free Tier | Premium Mode |
|---------|-----------|--------------|
| Rooms | 1 max | Unlimited |
| Billing | ✓ Limited | ✓ Full |
| Reporting | ✓ Basic | ✓ Advanced |
| Analytics | ✗ Locked | ✓ Full |
| Chat | ✓ Limited | ✓ Full |
| Broadcast | ✗ Locked | ✓ Enabled |
| Priority Support | ✗ No | ✓ Yes |
| Auto-login | ✗ No | ✓ Yes |

---

## Files Modified for Premium Mode

### `components/layout/irent-layout.tsx`
- Added `PREMIUM_DEMO_MODE` flag
- Added `subscriptionTier` state
- Added premium auto-login
- Added premium badge display
- Pass tier to tab components

### `components/tabs/room-tab.tsx`
- Added `isPremium` prop support
- Removed 1-room limit when premium
- Added premium mode banner
- Enabled add room for premium users

### `components/tabs/updates-tab.tsx`
- Added `subscriptionTier` prop support
- Updated Premium AI card styling
- Green banner when premium active
- "Active ✓" and "Current Plan" buttons

---

## How to Switch Between Modes

### Method 1: Code Change
Edit `PREMIUM_DEMO_MODE` in `irent-layout.tsx`
- Requires hot reload

### Future: Admin Toggle
In future updates, we could add:
- Admin dashboard toggle
- Query parameter override (`?mode=premium`)
- Session storage preference

---

## Performance Notes

Premium mode has no performance impact:
- No additional renders
- No extra API calls
- No additional state management
- Lightweight flag-based system

---

## Next Steps

To make premium mode persistent:
1. Add localStorage save for mode preference
2. Add admin settings page
3. Add URL query parameter support
4. Integrate with backend auth system

---

## Questions?

Refer to documentation files:
- `INDEX.md` - Master reference
- `FILE_INVENTORY.md` - File locations
- `docs/ARCHITECTURE.md` - Technical patterns
