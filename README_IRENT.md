# iRent v1.0 - Rental Property Management System

A production-ready React Next.js application for managing rental properties with a beautiful Material Design 3 interface.

## 🚀 Features

- **Authentication System**: Sign-in/registration with landlord information collection
- **5-Tab Dashboard**:
  - 🏠 **Rooms**: Multi-tenant property management with billing wizard
  - 📊 **Reports**: Payment ledger with status tracking
  - 💰 **Sales**: ROI analytics and financial performance
  - 📈 **Updates**: Subscription tier management
  - 💬 **Chat**: Tenant messaging and broadcast console

- **Billing Wizard**: 3-step interactive modal
  - Electricity meter simulator with animated scanner
  - Water meter simulator
  - Automatic calculation with dynamic rates

- **Responsive Design**: Optimized for desktop (sidebar) and mobile (bottom nav)
- **Material Design 3**: Google-inspired clean aesthetic
- **Type-Safe**: Full TypeScript support with comprehensive interfaces
- **Empty States**: Beautiful UI patterns for empty data

## 📋 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Architecture

### State Management
All state is centralized in `IrentLayout` component for seamless tab switching:
- Authentication (isLoggedIn, landlordInfo)
- Configuration (electricityRate, waterRate)
- Data (rooms, ledger, sales, tenants, messages)

### Component Structure
```
IrentLayout (Master)
├── AuthCard (Sign-in/registration)
├── DesktopNavigation (Icon rail sidebar)
├── MobileBottomNav (Bottom sticky nav)
└── Tabs (Room, Report, Sales, Updates, Chat)
    └── BillingWizard (Modal for invoices)
```

### File Organization
```
components/
├── auth/           (Authentication UI)
├── billing/        (Invoice wizard + formulas)
├── empty-states/   (Reusable empty UI)
├── layout/         (Master layout + navigation)
├── tabs/           (5 dashboard tabs)
└── ui/             (shadcn/ui components)

types/              (TypeScript interfaces)
lib/                (Mock data + utilities)
docs/               (Architecture guides)
```

## 🎨 Design System

### Color Palette
- **Canvas**: `#F8F9FA` (bg-slate-50)
- **Brand**: `#1A73E8` (Google Blue)
- **Paid**: Emerald (`bg-emerald-50 text-emerald-700`)
- **Pending**: Amber (`bg-amber-50 text-amber-700`)
- **Overdue**: Rose (`bg-rose-50 text-rose-700`)

### Typography
- **Headers**: Off-Black (`#202124`)
- **Body**: Slate Gray (`#5F6368`)
- **Numbers**: Monospace font

## 💾 Billing Formula

```
Total Due = Base Rent + ((Current Elec - Prev Elec) × ₱15) + ((Current Water - Prev Water) × ₱25)
```

**Default Rates**:
- Electricity: ₱15/kWh
- Water: ₱25/m³

Rates are configurable through state management.

## 📱 Responsive Design

- **Desktop** (md+): Left sidebar icon rail (w-16 → w-64 hover)
- **Tablet** (sm-md): Hybrid layout
- **Mobile** (<sm): Bottom sticky navigation with full-width content

All touch targets optimized to minimum 44px for mobile usability.

## 🔐 Authentication

Currently using mock authentication. To test:
1. Enter any email and password
2. Fill in phone and address
3. Click "Sign In"
4. Access the full dashboard

## 📊 Mock Data

The application includes realistic mock data for:
- 1 sample room (Room 101, Juan Dela Cruz, ₱1,500 base rent)
- 3 payment records in ledger
- Monthly sales data with growth metrics
- 2 active tenants
- Sample messages

All data persists across tab switches during the session.

## 🛠️ Development

### Key Technologies
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

### Component Development Pattern

1. **Define types** in `types/rent.ts`
2. **Create component** in appropriate folder
3. **Use shadcn components** for UI elements
4. **Pass props from IrentLayout** for data
5. **Use React hooks** for local state
6. **Test in browser** with agent-browser

### Adding a New Feature

1. Review `docs/ARCHITECTURE.md` for patterns
2. Create component file in appropriate folder
3. Add TypeScript interface in `types/rent.ts`
4. Update `IrentLayout` state if needed
5. Pass props from parent to child
6. Test tab switching for state persistence

## 📖 Documentation

- **`docs/IMPLEMENTATION_PLAN.md`**: Complete project specification
- **`docs/ARCHITECTURE.md`**: Detailed architecture reference and development guide
- **`types/rent.ts`**: TypeScript interface definitions

## 🎯 Current Status

✅ Complete Implementation:
- Authentication system
- 5-tab dashboard
- Billing wizard with animations
- Empty states for all tabs
- Responsive layouts
- Type-safe architecture
- Mock data system

## 🔄 Future Enhancements

1. Persistent storage (LocalStorage/Backend)
2. Real authentication (JWT/OAuth)
3. Database integration
4. Toast notifications
5. Report export (CSV/PDF)
6. Real-time updates (WebSockets)
7. Settings panel for rate customization
8. Multi-user support

## 🐛 Troubleshooting

### Page not loading
- Check browser console for errors
- Verify all dependencies installed: `pnpm install`
- Clear cache and reload

### Animations not working
- Ensure globals.css is loaded
- Check Tailwind configuration
- Verify browser supports CSS transitions

### State not persisting between tabs
- Check IrentLayout is properly lifting state
- Verify props are passed correctly
- Use React DevTools to inspect component tree

## 📝 License

Built with v0 - Vercel's AI-powered design assistant

---

**Questions or need help?** Check the documentation files in `/docs` or review the component comments for detailed explanations.
