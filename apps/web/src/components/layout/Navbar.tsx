import React, { useState, useEffect } from 'react';
import { Bus, MapPin, CreditCard, XCircle, PhoneCall, Globe, Volume2, VolumeX, Wallet, Ticket } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-40 w-full glass-nav text-white shadow-xl">
      {/* Top Advisory Bar */}
      <div className="bg-[#001c30] py-1 px-4 text-xs flex flex-wrap justify-between items-center border-b border-white/10 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-300">Official Portal:</span>
          <span>Government of Gujarat Public Transport Authority • 100% GPS Enabled Fleet</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenHelpline}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition font-medium cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Toll-Free: 1800 233 666666</span>
          </button>
          <span className="hidden sm:inline text-slate-500">|</span>
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition cursor-pointer ${
              voiceActive ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Divyang Audio Assistance"
          >
            {voiceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceActive ? 'Voice: ON' : 'Voice Assist'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap justify-between items-center gap-4">
        {/* Logo & Emblem */}
        <div
          onClick={() => setActiveTab('BOOKING')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#E8590C] to-[#FF8A3D] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                GSRTC
              </span>
              <span className="text-[10px] bg-orange-600/80 text-white uppercase px-1.5 py-0.5 rounded font-bold tracking-wider">
                ગુજરાત એસ.ટી.
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              {t('portalSubtitle')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#001f35]/60 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('BOOKING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === 'BOOKING'
                ? 'bg-gradient-to-r from-[#E8590C] to-[#ff7a29] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>{t('bookBus')}</span>
          </button>

          <button
            onClick={() => setActiveTab('TRACKING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === 'TRACKING'
                ? 'bg-gradient-to-r from-[#E8590C] to-[#ff7a29] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t('liveTracker')}</span>
          </button>

          <button
            onClick={() => setActiveTab('PASS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === 'PASS'
                ? 'bg-gradient-to-r from-[#E8590C] to-[#ff7a29] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{t('busPass')}</span>
          </button>

          <button
            onClick={() => setActiveTab('CANCEL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === 'CANCEL'
                ? 'bg-gradient-to-r from-[#E8590C] to-[#ff7a29] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>{t('cancelRefund')}</span>
          </button>
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="relative flex items-center bg-white/10 rounded-lg p-1 text-xs border border-white/15">
            <Globe className="w-3.5 h-3.5 text-slate-300 ml-1 mr-1" />
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-[#002B49] text-white">English</option>
              <option value="gu" className="bg-[#002B49] text-white">ગુજરાતી</option>
              <option value="hi" className="bg-[#002B49] text-white">हिंदी</option>
            </select>
          </div>

          {/* Wallet Balance Pill */}
          <div
            className="hidden md:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-xs"
            title="Simulated GSRTC Smart Wallet Balance"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">₹{walletBalance.toFixed(2)}</span>
          </div>

          {/* My Bookings Button */}
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-orange-300" />
            <span className="hidden sm:inline">{t('myTickets')}</span>
            {bookingCount > 0 && (
              <span className="bg-[#E8590C] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {bookingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
