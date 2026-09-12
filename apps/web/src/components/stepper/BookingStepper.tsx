import React from 'react';
import { Search, Armchair, UserCheck, CheckCircle2 } from 'lucide-react';

export type BookingStep = 1 | 2 | 3 | 4;

interface BookingStepperProps {
  currentStep: BookingStep;
  onStepClick: (step: BookingStep) => void;
  selectedSeatsCount: number;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  onStepClick,
  selectedSeatsCount,
}) => {
  const steps = [
    {
      num: 1 as BookingStep,
      label: '1. Select Bus',
      icon: Search,
      enabled: true,
    },
    {
      num: 2 as BookingStep,
      label: selectedSeatsCount > 0 ? `2. Seats (${selectedSeatsCount} Selected)` : '2. Select Seats',
      icon: Armchair,
      enabled: currentStep >= 2,
    },
    {
      num: 3 as BookingStep,
      label: '3. Passenger & Boarding',
      icon: UserCheck,
      enabled: currentStep >= 3,
    },
    {
      num: 4 as BookingStep,
      label: '4. Payment & E-Ticket',
      icon: CheckCircle2,
      enabled: currentStep >= 4,
    },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm py-2 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = currentStep === s.num;
          const isCompleted = currentStep > s.num;

          return (
            <React.Fragment key={s.num}>
              <button
                onClick={() => s.enabled && onStepClick(s.num)}
                disabled={!s.enabled}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#002B49] text-white shadow-sm ring-2 ring-[#002B49]/20'
                    : isCompleted
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#E8590C] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
                <Icon className="w-4 h-4 sm:hidden" />
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    currentStep > index + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
