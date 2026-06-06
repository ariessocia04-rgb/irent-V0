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

  const handleSave = () => {
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

    // Simulate save delay
    setTimeout(() => {
      onComplete({
        ...tenant,
        name,
        phone,
        password,
        isFirstLogin: false,
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Welcome to iRent!</DialogTitle>
          <DialogDescription>
            Please complete your profile and update your password to continue.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md">
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-950">Full Name</label>
            <Input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-950">Phone Number</label>
            <Input
              placeholder="+63 9XX XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-950">New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-950">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Complete Setup'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
