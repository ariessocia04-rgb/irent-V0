# iRent v1.0 - Production Architecture

This project is a full-stack rental management system designed for scale.

## 🏗 Architecture
- **Frontend**: Next.js (App Router) deployed on **Vercel**.
- **Database & Auth**: **Supabase** (PostgreSQL, GoTrue, Realtime).
- **Backend**: Node.js/Express API deployed on **Render** (for administrative tasks like secure tenant creation).

## 🚀 Key Features
- **Sliding Sidebar**: Smooth, professional navigation layout.
- **Modern Chat**: Real-time messaging with tenants.
- **Unit Management**: Full lifecycle from unit provisioning to tenant onboarding.
- **Role-Based Access**: Specialized dashboards for Landlords and Tenants.

## 🛠 Setup & Deployment

### 1. Supabase Config
- Create a project on Supabase.
- Run the migrations provided in the `docs/migrations` (or apply the ones initialized during development).
- Enable RLS policies for profiles, rooms, and messages.

### 2. Backend (Render)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Env Vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### 3. Frontend (Vercel)
- Env Vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_BACKEND_URL` (URL of your Render service)

## 📦 Tech Stack
- **Next.js 16**
- **Tailwind CSS 4**
- **Lucide Icons**
- **Supabase SDK**
- **Express.js**
