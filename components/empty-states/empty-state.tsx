'use client';

import { EmptyStateProps } from '@/types/rent';
import { Button } from '@/components/ui/button';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 text-gray-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-950 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
