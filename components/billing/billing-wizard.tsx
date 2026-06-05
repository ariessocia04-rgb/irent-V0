'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BillingWizardProps } from '@/types/rent';
import {
  calculateBillingDue,
  formatCurrency,
  generateMeterReading,
} from '@/components/billing/billing-calculation-utils';
import { Card } from '@/components/ui/card';

export function BillingWizard({
  room,
  isOpen,
  onClose,
  electricityRate,
  waterRate,
  onInvoiceSend,
}: BillingWizardProps) {
  const [step, setStep] = useState(1);
  const [prevElectricity, setPrevElectricity] = useState('0');
  const [currentElectricity, setCurrentElectricity] = useState('0');
  const [prevWater, setPrevWater] = useState('0');
  const [currentWater, setCurrentWater] = useState('0');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSide, setSimSide] = useState<'elec' | 'water' | null>(null);

  const handleMeterSnap = (side: 'elec' | 'water') => {
    setIsSimulating(true);
    setSimSide(side);

    setTimeout(() => {
      if (side === 'elec') {
        const prev = Math.floor(Math.random() * 5000) + 100;
        const curr = prev + Math.floor(Math.random() * 500) + 50;
        setPrevElectricity(prev.toString());
        setCurrentElectricity(curr.toString());
      } else {
        const prev = Math.floor(Math.random() * 200) + 10;
        const curr = prev + Math.floor(Math.random() * 50) + 5;
        setPrevWater(prev.toString());
        setCurrentWater(curr.toString());
      }
      setIsSimulating(false);
      setSimSide(null);
    }, 1500);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSendInvoice = () => {
    const calculation = calculateBillingDue(
      room.baseRent,
      parseFloat(currentElectricity),
      parseFloat(prevElectricity),
      parseFloat(currentWater),
      parseFloat(prevWater),
      electricityRate,
      waterRate
    );
    onInvoiceSend(calculation.totalDue);
    onClose();
    setStep(1);
  };

  const calculation =
    step === 3
      ? calculateBillingDue(
          room.baseRent,
          parseFloat(currentElectricity),
          parseFloat(prevElectricity),
          parseFloat(currentWater),
          parseFloat(prevWater),
          electricityRate,
          waterRate
        )
      : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Billing Invoice - Room {room.number}</DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? 'Electricity' : step === 2 ? 'Water' : 'Calculation'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Electricity */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Camera Scanner */}
              <div className="flex justify-center py-8">
                <div className="relative w-32 h-32 border-2 border-dashed border-[#1A73E8] rounded-lg flex items-center justify-center bg-blue-50">
                  <svg
                    className="absolute w-24 h-24 animate-radio-blink"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="#1A73E8"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="15"
                      fill="none"
                      stroke="#1A73E8"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </svg>
                  <p className="text-xs text-[#1A73E8] font-semibold text-center px-4">
                    Position meter here
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-950">
                  Previous Meter (kWh)
                </label>
                <Input
                  type="number"
                  value={prevElectricity}
                  onChange={(e) => setPrevElectricity(e.target.value)}
                  className="border-gray-100"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-950">
                  Current Meter (kWh)
                </label>
                <Input
                  type="number"
                  value={currentElectricity}
                  onChange={(e) => setCurrentElectricity(e.target.value)}
                  className="border-gray-100"
                  placeholder="0"
                />
              </div>

              {/* Simulation Button */}
              <Button
                onClick={() => handleMeterSnap('elec')}
                disabled={isSimulating && simSide === 'elec'}
                className="w-full bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white"
              >
                {isSimulating && simSide === 'elec' ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⚙️</span>
                    Simulating...
                  </>
                ) : (
                  <>
                    📷 Simulate Meter Snap
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Water */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Camera Scanner */}
              <div className="flex justify-center py-8">
                <div className="relative w-32 h-32 border-2 border-dashed border-[#1A73E8] rounded-lg flex items-center justify-center bg-blue-50">
                  <svg
                    className="absolute w-24 h-24 animate-radio-blink"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="#1A73E8"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="15"
                      fill="none"
                      stroke="#1A73E8"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </svg>
                  <p className="text-xs text-[#1A73E8] font-semibold text-center px-4">
                    Position meter here
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-950">
                  Previous Meter (m³)
                </label>
                <Input
                  type="number"
                  value={prevWater}
                  onChange={(e) => setPrevWater(e.target.value)}
                  className="border-gray-100"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-950">
                  Current Meter (m³)
                </label>
                <Input
                  type="number"
                  value={currentWater}
                  onChange={(e) => setCurrentWater(e.target.value)}
                  className="border-gray-100"
                  placeholder="0"
                />
              </div>

              {/* Simulation Button */}
              <Button
                onClick={() => handleMeterSnap('water')}
                disabled={isSimulating && simSide === 'water'}
                className="w-full bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white"
              >
                {isSimulating && simSide === 'water' ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⚙️</span>
                    Simulating...
                  </>
                ) : (
                  <>
                    📷 Simulate Meter Snap
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 3: Calculation */}
          {step === 3 && calculation && (
            <div className="space-y-4">
              <Card className="p-4 bg-gray-50 border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Base Rent</span>
                    <span className="font-mono font-semibold text-gray-950">
                      {formatCurrency(calculation.baseRent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">
                      Electricity ({currentElectricity} - {prevElectricity} kWh @
                      ₱{electricityRate}/kWh)
                    </span>
                    <span className="font-mono font-semibold text-gray-950">
                      {formatCurrency(calculation.electricityCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">
                      Water ({currentWater} - {prevWater} m³ @
                      ₱{waterRate}/m³)
                    </span>
                    <span className="font-mono font-semibold text-gray-950">
                      {formatCurrency(calculation.waterCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 pt-3">
                    <span className="font-semibold text-gray-950">Total Due</span>
                    <span className="font-mono text-2xl font-bold text-[#1A73E8]">
                      {formatCurrency(calculation.totalDue)}
                    </span>
                  </div>
                </div>
              </Card>
              <p className="text-xs text-gray-600">
                Formula: Base Rent + ((Current Elec - Prev Elec) × {electricityRate}) +
                ((Current Water - Prev Water) × {waterRate})
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={handleNextStep}
                className="flex-1 bg-[#1A73E8] hover:bg-[#1a73e8]/90 text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSendInvoice}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Send Invoice to Tenant
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
