'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tenant } from '@/types/rent';
import { supabase } from '@/lib/supabase';

interface TenantOnboardingModalProps {
  tenant: Tenant;
  isOpen: boolean;
  onComplete: (updatedTenant: Tenant) => void;
}

export function TenantOnboardingModal({ tenant, isOpen, onComplete }: TenantOnboardingModalProps) {
  const [name, setName] = useState(tenant.name);
  const [phone, setPhone] = useState(tenant.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setError('');

    if (!name || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Update Password
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;

      // 2. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          phone: phone,
          is_first_login: false // Assuming we add this column or handle via metadata
        })
        .eq('id', tenant.id);

      if (profileError) throw profileError;

      onComplete({
        ...tenant,
        name,
        phone,
        isFirstLogin: false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-950">Welcome to iRent!</DialogTitle>
          <DialogDescription className="font-medium text-gray-500">
            Finalize your resident profile and secure your account with a new password.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
            <p className="text-sm text-rose-700 font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Full Name</label>
            <Input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <Input
              placeholder="+63 9XX XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border-gray-100 bg-gray-50 focus:ring-4 focus:ring-blue-50 py-6"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-[#1A73E8] hover:bg-blue-700 text-white py-7 rounded-xl font-black shadow-lg transition-all active:scale-95"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'SECURING ACCOUNT...' : 'ACTIVATE PROFILE'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
