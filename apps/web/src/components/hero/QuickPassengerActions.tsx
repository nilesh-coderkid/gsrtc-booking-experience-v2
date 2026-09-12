import React from 'react';
import { Ticket, Radio, CalendarClock, Ban, Printer, GraduationCap, Wallet, Headphones } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface QuickPassengerActionsProps {
  onSelectTab: (tab: 'BOOKING' | 'TRACKING' | 'PASS' | 'CANCEL') => void;
  onOpenMyBookings: () => void;
  onOpenHelpline: () => void;
}

export const QuickPassengerActions: React.FC<QuickPassengerActionsProps> = ({
  onSelectTab,
  onOpenMyBookings,
  onOpenHelpline,
}) => {
  const { lang } = useLanguage();

  const scrollToBooking = () => {
    onSelectTab('BOOKING');
    const el = document.getElementById('booking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-[1260px] mx-auto px-4 sm:px-6 py-6" id="quick-actions">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-[#b91d20] tracking-wider uppercase">
            {lang === 'gu' ? 'ઝડપી નાગરિક સેવાઓ' : 'Quick Citizen Services'}
          </span>
          <h2 className="text-2xl font-bold text-[#0B1E33]">
            {lang === 'gu' ? 'મુસાફરો માટે જરૂરી સુવિધાઓ' : 'Essential Passenger Facilities'}
          </h2>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          {lang === 'gu' ? 'તમારી આંગળીના ટેરવે ૧-ક્લિક સેવાઓ' : '1-Click Transit Services'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        {/* 1. Online Ticket */}
        <button
          type="button"
          onClick={scrollToBooking}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#b91d20] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Ticket className="w-5 h-5" />
          </div>
          <span className="font-bold text-[12px] text-slate-900 leading-none">
            {lang === 'gu' ? 'ઓનલાઇન ટિકિટ' : 'Online Ticket'}
          </span>
        </button>

        {/* 2. Live Tracking */}
        <button
          type="button"
          onClick={() => onSelectTab('TRACKING')}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-2 relative group-hover:scale-110 transition-transform">
            <Radio className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 animate-ping" />
          </div>
          <span className="font-bold text-[12px] text-slate-900 leading-none">
            {lang === 'gu' ? 'લાઈવ ટ્રેકિંગ' : 'Live Tracking'}
          </span>
        </button>

        {/* 3. Date Change */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('BOOKING');
            const el = document.getElementById('booking-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <CalendarClock className="w-5 h-5" />
          </div>
          <span className="font-bold text-[12px] text-slate-900 leading-none">
            {lang === 'gu' ? 'તારીખ બદલો' : 'Change Date'}
          </span>
        </button>

        {/* 4. Cancel & Refund */}
        <button
          type="button"
          onClick={() => onSelectTab('CANCEL')}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Ban className="w-5 h-5" />
          </div>
          <span className="font-bold text-[12px] text-slate-900 leading-none">
            {lang === 'gu' ? 'કેન્સલ & રિફંડ' : 'Cancel & Refund'}
          </span>
        </button>

        {/* 5. Print Ticket */}
        <button
          type="button"
          onClick={onOpenMyBookings}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <span className="font-bold text-[12px] text-slate-900 leading-none">
            {lang === 'gu' ? 'ટિકિટ પ્રિન્ટ' : 'Print Ticket'}
          </span>
        </button>

        {/* 6. Student Pass */}
        <button
          type="button"
          onClick={() => onSelectTab('PASS')}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-[12px] text-slate-900 leading-none">
            {lang === 'gu' ? 'વિદ્યાર્થી પાસ' : 'Student Pass'}
          </span>
        </button>

        {/* 7. Smart Wallet */}
        <button
          type="button"
          onClick={onOpenMyBookings}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5 text-[#E8590C]" />
          </div>
          <span className="font-bold text-[12px] text-slate-900 leading-none">
            {lang === 'gu' ? 'સ્માર્ટ વૉલેટ' : 'Smart Wallet'}
          </span>
        </button>

        {/* 8. 24x7 Help */}
        <button
          type="button"
          onClick={onOpenHelpline}
          className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl bg-red-50/70 hover:bg-red-50 border border-red-100 shadow-soft-card hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#b91d20] text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <span className="font-bold text-[12px] text-[#b91d20] leading-none">
            {lang === 'gu' ? '૨૪x૭ સહાય' : '24x7 Help'}
          </span>
        </button>
      </div>
    </section>
  );
};
