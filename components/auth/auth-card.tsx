'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LandlordInfo } from '@/types/rent';

interface AuthCardProps {
  onSignIn: (info: LandlordInfo) => void;
}

export function AuthCard({ onSignIn }: AuthCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) return false;
    if (isSignUp && (!phone || !address)) return false;
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      onSignIn({
        email,
        phone: isSignUp ? phone : '',
        propertyAddress: isSignUp ? address : '',
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-100 shadow-sm">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-950">iRent</h1>
            <p className="text-sm text-gray-600 mt-1">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-md">
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-950 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-100"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-950 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-100"
                disabled={isLoading}
              />
            </div>

            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-950 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+63 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-gray-100"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-950 mb-1">
                    Property Address
                  </label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main St, City, Country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-gray-100"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white mt-6"
              disabled={isLoading}
            >
              {isLoading
                ? 'Loading...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : 'Don&apos;t have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-[#1A73E8] font-medium hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
