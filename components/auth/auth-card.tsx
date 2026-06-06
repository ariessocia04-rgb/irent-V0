'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, LandlordInfo, Tenant } from '@/types/rent';
import { supabase } from '@/lib/supabase';

interface AuthCardProps {
  onSignIn: (user: User) => void;
}

export function AuthCard({ onSignIn }: AuthCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) return false;
    if (isSignUp && (!fullName || !phone || !address)) {
      setError('Please fill in all profile details');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up as Landlord (Owner) by default for public registration
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Initialize profile and role
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            full_name: fullName,
            email: email,
          });

          await supabase.from('user_roles').insert({
            user_id: authData.user.id,
            role: 'owner'
          });

          // Redirect to sign in or auto sign in
          setError('Account created! Please sign in.');
          setIsSignUp(false);
        }
      } else {
        // Sign In
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Fetch Role and Profile
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', authData.user.id)
            .single();

          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          const role = roleData?.role === 'owner' ? 'landlord' : 'tenant';

          if (role === 'landlord') {
            const landlord: LandlordInfo = {
              email: authData.user.email!,
              phone: profileData?.phone || '',
              propertyAddress: profileData?.property_address || '',
              role: 'landlord',
            };
            onSignIn(landlord);
          } else {
            const tenant: Tenant = {
              id: authData.user.id,
              name: profileData?.full_name || 'Tenant',
              avatar: (profileData?.full_name || 'T').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
              email: authData.user.email!,
              role: 'tenant',
              isFirstLogin: false, // We'll handle this based on some condition if needed
            };
            onSignIn(tenant);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-100 shadow-sm overflow-hidden rounded-2xl">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-gray-950">iRent</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {isSignUp ? 'Initialize your property workspace' : 'Welcome back to your dashboard'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
              <p className="text-sm text-rose-700 font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <Input
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                disabled={isLoading}
              />
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+63 9XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Address</label>
                  <Input
                    placeholder="123 Main St, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1A73E8] hover:bg-blue-700 text-white mt-6 py-7 rounded-xl font-black shadow-lg transition-all active:scale-95"
              disabled={isLoading}
            >
              {isLoading
                ? 'PROCESSING...'
                : isSignUp
                ? 'CREATE LANDLORD ACCOUNT'
                : 'SIGN IN TO DASHBOARD'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isSignUp ? 'Already managing properties?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-[#1A73E8] font-bold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Register as Landlord'}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
