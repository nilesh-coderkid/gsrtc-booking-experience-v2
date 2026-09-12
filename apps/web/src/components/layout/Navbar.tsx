import React, { useState, useEffect } from 'react';
import { Bus, MapPin, CreditCard, XCircle, PhoneCall, Volume2, VolumeX, Wallet, Ticket, Search, Radio } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '../../hooks/useLanguage';
import { SpeechEngine } from '../../speech/speechEngine';
import { GSRTCStorageEngine } from '../../services/storageEngine';

interface NavbarProps {
  activeTab: 'BOOKING' | 'TRACKING' | 'PASS' | 'CANCEL';
  setActiveTab: (tab: 'BOOKING' | 'TRACKING' | 'PASS' | 'CANCEL') => void;
  onOpenMyBookings: () => void;
  onOpenHelpline: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMyBookings,
  onOpenHelpline,
}) => {
  const { lang, changeLanguage, t } = useLanguage();
  const [walletBalance, setWalletBalance] = useState<number>(() => GSRTCStorageEngine.getWalletBalance());
  const [voiceActive, setVoiceActive] = useState<boolean>(false);
  const [bookingCount, setBookingCount] = useState<number>(() => GSRTCStorageEngine.getBookings().length);

  useEffect(() => {
    setWalletBalance(GSRTCStorageEngine.getWalletBalance());
    setBookingCount(GSRTCStorageEngine.getBookings().length);

    const handleStorageChange = () => {
      setWalletBalance(GSRTCStorageEngine.getWalletBalance());
      setBookingCount(GSRTCStorageEngine.getBookings().length);
    };

    window.addEventListener('gsrtc_storage_change', handleStorageChange);
    return () => window.removeEventListener('gsrtc_storage_change', handleStorageChange);
  }, []);

  const toggleVoice = () => {
    const next = !voiceActive;
    setVoiceActive(next);
    SpeechEngine.setEnabled(next);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveTab('BOOKING');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all">
      {/* 1. Top Utility Bar in Royal Navy (#0B1E33) */}
      <div className="w-full bg-[#0B1E33] text-white/90 px-4 sm:px-8 text-[12px] py-1.5 transition-all">
        <div className="max-w-[1300px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Gujarat State Undertaking info & Live Radar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#E8590C] animate-pulse" />
              <span className="tracking-wide font-semibold">
                {lang === 'gu' ? 'ગુજરાત રાજ્ય માર્ગ વાહનવ્યવહાર નિગમ' : 'GSRTC • Gujarat State Road Transport Corporation'}
              </span>
              <span className="text-white/30 hidden md:inline">|</span>
              <span className="text-white/70 hidden md:inline text-[11px] font-sans">Government of Gujarat</span>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px]">
              <Radio className="w-3 h-3 text-[#059669] animate-pulse" />
              <span>{lang === 'gu' ? 'લાઈવ: ૮,૪૨૦+ બસો ૧૬ વિભાગોમાં કાર્યરત' : 'Live: 8,420+ Buses Active Across 16 Divisions'}</span>
            </div>
          </div>

          {/* Right: 24x7 Helpline, Voice Assist & Language Switcher */}
          <div className="flex items-center gap-3 text-[12px]">
            {/* Toll-Free Helpline */}
            <button
              onClick={onOpenHelpline}
              className="flex items-center gap-1 hover:text-white transition-colors group cursor-pointer"
              title="24x7 Helpline Assistance"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E8590C] group-hover:scale-110 transition-transform" />
              <span>
                {lang === 'gu' ? 'ટોલ-ફ્રી: ' : 'Toll-Free: '}
                <strong className="font-bold tracking-wider font-sans text-white">1800 233 6655</strong>
              </span>
            </button>

            <span className="text-white/20">|</span>

            {/* Voice Accessibility Button */}
            <button
              onClick={toggleVoice}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full transition cursor-pointer ${
                voiceActive ? 'bg-amber-500/30 text-amber-300 border border-amber-400/40' : 'text-white/70 hover:text-white'
              }`}
              title="Web Speech Bilingual Audio Assistance"
            >
              {voiceActive ? <Volume2 className="w-3 h-3 text-amber-300" /> : <VolumeX className="w-3 h-3" />}
              <span>{voiceActive ? 'Voice: ON' : (lang === 'gu' ? 'ઓડિયો સહાય' : 'Voice')}</span>
            </button>

            <span className="text-white/20">|</span>

            {/* Language Switcher Pills */}
            <div className="flex items-center bg-white/10 p-0.5 rounded-full text-[11px]">
              <button
                onClick={() => changeLanguage('gu')}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                  lang === 'gu'
                    ? 'bg-[#b91d20] text-white shadow-sm flex items-center gap-1'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {lang === 'gu' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                ગુજરાતી
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full font-sans transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#b91d20] text-white font-bold shadow-sm flex items-center gap-1'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {lang === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                English
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-[#b91d20] text-white font-bold shadow-sm flex items-center gap-1'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {lang === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 h-20 flex flex-nowrap items-center justify-between gap-4">
        {/* Emblem & Brand Logo */}
        <div
          onClick={() => {
            setActiveTab('BOOKING');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 shrink-0 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#b91d20] via-[#c62828] to-[#E8590C] flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform duration-300">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[22px] tracking-tight text-[#0B1E33] leading-none whitespace-nowrap font-serif">
                GSRTC
              </span>
              <span className="text-[10px] bg-red-50 text-[#b91d20] border border-red-200/60 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                {lang === 'gu' ? 'આપણી બસ' : 'Our Bus'}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 leading-tight whitespace-nowrap">
              {lang === 'gu' ? 'ગુજરાત એસ.ટી. નિગમ' : 'Gujarat State Transit'}
            </span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab('BOOKING');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-bold text-[14px] px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'BOOKING'
                ? 'text-[#b91d20] bg-red-50/90 shadow-sm ring-1 ring-red-200/50'
                : 'text-slate-700 hover:text-[#b91d20] hover:bg-slate-50'
            }`}
          >
            {lang === 'gu' ? 'ટિકિટ બુકિંગ' : t('bookBus')}
          </button>

          <button
            onClick={() => {
              setActiveTab('TRACKING');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-semibold text-[14px] px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'TRACKING'
                ? 'text-[#b91d20] bg-red-50/90 shadow-sm ring-1 ring-red-200/50 font-bold'
                : 'text-slate-700 hover:text-[#b91d20] hover:bg-slate-50'
            }`}
          >
            {lang === 'gu' ? 'બસ ટ્રેકિંગ' : t('liveTracker')}
          </button>

          <button
            onClick={onOpenMyBookings}
            className="text-slate-700 hover:text-[#b91d20] hover:bg-slate-50 font-semibold text-[14px] px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>{lang === 'gu' ? 'મારી બુકિંગ' : t('myTickets')}</span>
            {bookingCount > 0 && (
              <span className="bg-[#b91d20] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {bookingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('PASS');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-semibold text-[14px] px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'PASS'
                ? 'text-[#b91d20] bg-red-50/90 shadow-sm ring-1 ring-red-200/50 font-bold'
                : 'text-slate-700 hover:text-[#b91d20] hover:bg-slate-50'
            }`}
          >
            {lang === 'gu' ? 'બસ પાસ' : t('busPass')}
          </button>

          <button
            onClick={() => {
              setActiveTab('CANCEL');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`font-semibold text-[14px] px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'CANCEL'
                ? 'text-[#b91d20] bg-red-50/90 shadow-sm ring-1 ring-red-200/50 font-bold'
                : 'text-slate-700 hover:text-[#b91d20] hover:bg-slate-50'
            }`}
          >
            {lang === 'gu' ? 'ટિકિટ રદ & રિફંડ' : t('cancelRefund')}
          </button>

          <button
            onClick={() => scrollToSection('fleet-section')}
            className="text-slate-700 hover:text-[#b91d20] hover:bg-slate-50 font-semibold text-[14px] px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer"
          >
            {lang === 'gu' ? 'સેવાઓ' : 'Services'}
          </button>

          <button
            onClick={() => scrollToSection('destination-section')}
            className="text-slate-700 hover:text-[#b91d20] hover:bg-slate-50 font-semibold text-[14px] px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer"
          >
            {lang === 'gu' ? 'પ્રવાસન' : 'Tourism'}
          </button>

          <button
            onClick={() => scrollToSection('footer-hub')}
            className="text-slate-700 hover:text-[#b91d20] hover:bg-slate-50 font-semibold text-[14px] px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer"
          >
            {lang === 'gu' ? 'માહિતી' : 'Info Hub'}
          </button>
        </nav>

        {/* Right User Actions */}
        <div className="flex items-center gap-3 shrink-0 flex-nowrap">
          {/* Smart Wallet Balance Display */}
          <div
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer text-xs whitespace-nowrap"
            title="GSRTC Smart Wallet Balance"
          >
            <Wallet className="w-4 h-4 text-[#E8590C]" />
            <span className="text-slate-600 font-medium">
              {lang === 'gu' ? 'વૉલેટ:' : 'Wallet:'}
            </span>
            <span className="font-bold text-slate-900 font-sans">
              ₹{walletBalance.toFixed(0)}
            </span>
          </div>

          {/* Search Buses CTA button */}
          <button
            onClick={() => {
              setActiveTab('BOOKING');
              const el = document.getElementById('booking-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c62828] to-[#b91d20] hover:from-[#b91d20] hover:to-[#9b1619] text-white font-bold text-[13px] shadow-glow-red hover:shadow-lg transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{lang === 'gu' ? 'ટિકિટ શોધો' : 'Search Buses'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
