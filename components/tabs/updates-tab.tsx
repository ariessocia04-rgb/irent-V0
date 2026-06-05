'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UpdatesTabProps } from '@/types/rent';
import { Check } from 'lucide-react';

export function UpdatesTab({ roomCount }: UpdatesTabProps) {
  const isFreeTierActive = roomCount >= 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-950">Plans & Updates</h1>
        <p className="text-gray-600 text-sm mt-1">
          Choose the right plan for your rental business
        </p>
      </div>

      {/* Alert Banner */}
      {isFreeTierActive && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg p-4 text-white animate-slide-in-up">
          <p className="font-semibold text-sm">
            Free Tier Active: Restricted to 1 Active Property Node Management
          </p>
        </div>
      )}

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Free Tier */}
        <Card className="p-6 border-gray-100">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-950">Free</h3>
              <p className="text-2xl font-bold text-gray-950 mt-1">$0</p>
              <p className="text-gray-600 text-xs mt-1">per month</p>
            </div>
            <div className="bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
              <p className="font-semibold text-amber-700 text-sm">1 Room Max</p>
            </div>
            <ul className="space-y-2">
              {[
                'Basic room management',
                'Payment tracking',
                'Simple reports',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled cursor-not-allowed"
              disabled
            >
              Active
            </Button>
          </div>
        </Card>

        {/* Pro Tier */}
        <Card className="p-6 border-2 border-indigo-200">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-950">Pro</h3>
              <p className="text-2xl font-bold text-gray-950 mt-1">$99</p>
              <p className="text-gray-600 text-xs mt-1">per month</p>
            </div>
            <div className="bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
              <p className="font-semibold text-blue-700 text-sm">5 Rooms Max</p>
            </div>
            <ul className="space-y-2">
              {[
                'Advanced room management',
                'Priority support',
                'Detailed analytics',
                'Expense tracking',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white">
              Upgrade Now
            </Button>
          </div>
        </Card>

        {/* Premium AI Tier */}
        <Card className="p-6 border-2 border-transparent bg-gradient-to-b from-indigo-50 to-purple-50">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-950">Premium AI</h3>
                <p className="text-2xl font-bold text-gray-950 mt-1">$299</p>
                <p className="text-gray-600 text-xs mt-1">per month</p>
              </div>
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:bg-gradient-to-r">
                Popular
              </Badge>
            </div>
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-2 rounded-md border border-indigo-300">
              <p className="font-semibold text-indigo-700 text-sm">
                Unlimited Rooms
              </p>
            </div>
            <ul className="space-y-2">
              {[
                'All Pro features',
                'AI-powered insights',
                'Automated billing',
                'Tenant management',
                '24/7 Priority support',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
              Get Premium
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
