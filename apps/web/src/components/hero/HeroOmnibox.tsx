import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, ArrowRightLeft, Search, History, Sparkles, Shield, Accessibility, Zap, Landmark, Award } from 'lucide-react';
import { Station, QuotaType, RecentSearch } from '@gsrtc/types';
import { GSRTCStorageEngine } from '../../services/storageEngine';
import { SpeechEngine } from '../../speech/speechEngine';
import { useLanguage } from '../../hooks/useLanguage';

interface HeroOmniboxProps {
  fromStationId: string;
  toStationId: string;
  journeyDate: string;
  quota: QuotaType;
  onFromStationChange: (id: string) => void;
  onToStationChange: (id: string) => void;
  onJourneyDateChange: (date: string) => void;
  onQuotaChange: (quota: QuotaType) => void;
  onSearch: () => void;
}

export const HeroOmnibox: React.FC<HeroOmniboxProps> = ({
  fromStationId,
  toStationId,
  journeyDate,
  quota,
  onFromStationChange,
  onToStationChange,
  onJourneyDateChange,
  onQuotaChange,
  onSearch,
}) => {
  const { lang, t } = useLanguage();
  const [stations, setStations] = useState<Station[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = GSRTCStorageEngine.getStations();
    setStations(list);
    setRecentSearches(GSRTCStorageEngine.getRecentSearches());

    const initialFrom = list.find((s) => s.id === fromStationId);
    const initialTo = list.find((s) => s.id === toStationId);

    if (initialFrom) setFromQuery(lang === 'gu' ? initialFrom.nameGu : initialFrom.nameEn);
    if (initialTo) setToQuery(lang === 'gu' ? initialTo.nameGu : initialTo.nameEn);
  }, [fromStationId, toStationId, lang]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setToDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapStations = () => {
    const oldFrom = fromStationId;
    const oldTo = toStationId;
    onFromStationChange(oldTo);
    onToStationChange(oldFrom);

    const fromSt = stations.find((s) => s.id === oldTo);
    const toSt = stations.find((s) => s.id === oldFrom);
    if (fromSt) setFromQuery(lang === 'gu' ? fromSt.nameGu : fromSt.nameEn);
    if (toSt) setToQuery(lang === 'gu' ? toSt.nameGu : toSt.nameEn);

    SpeechEngine.speak('Swapped stations');
  };

  const handleSelectRecent = (recent: RecentSearch) => {
    onFromStationChange(recent.fromId);
    onToStationChange(recent.toId);
    const fromSt = stations.find((s) => s.id === recent.fromId);
    const toSt = stations.find((s) => s.id === recent.toId);
    if (fromSt) setFromQuery(lang === 'gu' ? fromSt.nameGu : fromSt.nameEn);
    if (toSt) setToQuery(lang === 'gu' ? toSt.nameGu : toSt.nameEn);
    onSearch();
  };

  const filteredFromStations = stations.filter((s) => {
    const q = fromQuery.toLowerCase();
    return (
      s.nameEn.toLowerCase().includes(q) ||
      s.nameGu.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  });

  const filteredToStations = stations.filter((s) => {
    const q = toQuery.toLowerCase();
    return (
      s.nameEn.toLowerCase().includes(q) ||
      s.nameGu.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  });

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const quotaTabs: { id: QuotaType; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'GENERAL', label: t('quotaGeneral'), icon: Sparkles },
    { id: 'SINGLE_LADY', label: t('quotaSingleLady'), icon: Shield, badge: 'Protected' },
    { id: 'DIVYANG', label: t('quotaDivyang'), icon: Accessibility, badge: 'Accessible' },
    { id: 'STATUE_OF_UNITY', label: t('quotaSou'), icon: Landmark, badge: 'Direct Tour' },
    { id: 'ELECTRIC_BUS', label: t('quotaElectric'), icon: Zap, badge: 'Eco-Green' },
    { id: 'AWT', label: t('quotaAwt'), icon: Award },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-[#002B49] via-[#00385F] to-[#f8fafc] pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Title & Government Emblem Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-orange-300 border border-white/15 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Government of Gujarat ST Undertaking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            {t('portalTitle')}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-1">
            Book Gujarat ST Volvo AC, Gurjarnagari, Sleeper & Green Electric bus tickets with real-time seat reservation
          </p>
        </div>

        {/* Quota Tabs Container */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center mb-3">
          {quotaTabs.map((q) => {
            const Icon = q.icon;
            const isSelected = quota === q.id;
            return (
              <button
                key={q.id}
                onClick={() => {
                  onQuotaChange(q.id);
                  if (q.id === 'STATUE_OF_UNITY') {
                    onToStationChange('SOU-NV');
                    const sou = stations.find((s) => s.id === 'SOU-NV');
                    if (sou) setToQuery(lang === 'gu' ? sou.nameGu : sou.nameEn);
                  }
                  SpeechEngine.speak(`Selected ${q.label} quota`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#E8590C] to-[#ff7e2e] text-white shadow-lg shadow-orange-500/30 scale-105'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{q.label}</span>
                {q.badge && (
                  <span className="text-[9px] bg-black/20 px-1 rounded-full uppercase font-bold tracking-wider">
                    {q.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Search Omnibox Card */}
        <div className="glass-panel bg-white/95 rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/40">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From Station Input */}
            <div className="md:col-span-4 relative" ref={fromRef}>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t('fromStation')}
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-[#E8590C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => {
                    setFromQuery(e.target.value);
                    setFromDropdownOpen(true);
                  }}
                  onFocus={() => setFromDropdownOpen(true)}
                  placeholder="e.g. Ahmedabad, Vadodara, Surat"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:bg-white transition"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {fromDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-100">
                  {filteredFromStations.length > 0 ? (
                    filteredFromStations.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onFromStationChange(s.id);
                          setFromQuery(lang === 'gu' ? s.nameGu : s.nameEn);
                          setFromDropdownOpen(false);
                          SpeechEngine.speak(`From ${s.nameEn}`);
                        }}
                        className="p-2.5 hover:bg-orange-50 cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-slate-800">
                            {lang === 'gu' ? s.nameGu : s.nameEn}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Code: {s.code} • {s.division} Division
                          </div>
                        </div>
                        {s.isPopular && (
                          <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">
                            Major Hub
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 text-center">No matching bus station found</div>
                  )}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={handleSwapStations}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-orange-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#E8590C] transition shadow-sm cursor-pointer active:scale-95"
                title="Swap Stations"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Station Input */}
            <div className="md:col-span-4 relative" ref={toRef}>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t('toStation')}
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => {
                    setToQuery(e.target.value);
                    setToDropdownOpen(true);
                  }}
                  onFocus={() => setToDropdownOpen(true)}
                  placeholder="e.g. Statue of Unity, Somnath, Rajkot"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:bg-white transition"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {toDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-100">
                  {filteredToStations.length > 0 ? (
                    filteredToStations.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onToStationChange(s.id);
                          setToQuery(lang === 'gu' ? s.nameGu : s.nameEn);
                          setToDropdownOpen(false);
                          SpeechEngine.speak(`To ${s.nameEn}`);
                        }}
                        className="p-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-slate-800">
                            {lang === 'gu' ? s.nameGu : s.nameEn}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Code: {s.code} • {s.division} Division
                          </div>
                        </div>
                        {s.isPopular && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                            Major Hub
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 text-center">No matching bus station found</div>
                  )}
                </div>
              )}
            </div>

            {/* Date Picker & Quick Chips */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t('journeyDate')}
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={journeyDate}
                  min={getTodayDate()}
                  onChange={(e) => onJourneyDateChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:bg-white transition"
                />
              </div>

              {/* Date Quick Shortcuts */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => onJourneyDateChange(getTodayDate())}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                    journeyDate === getTodayDate()
                      ? 'bg-[#002B49] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => onJourneyDateChange(getTomorrowDate())}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                    journeyDate === getTomorrowDate()
                      ? 'bg-[#002B49] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => onJourneyDateChange(getDayAfterTomorrowDate())}
                  className={`text-[10px] px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                    journeyDate === getDayAfterTomorrowDate()
                      ? 'bg-[#002B49] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  +2 Days
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Actions: Search Button & Recent Searches */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {/* Recent Searches Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <History className="w-3.5 h-3.5" />
                <span>{t('recentSearches')}:</span>
              </span>
              {recentSearches.slice(0, 3).map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectRecent(r)}
                  className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-[#E8590C] text-slate-700 px-2.5 py-1 rounded-lg transition font-medium border border-slate-200 cursor-pointer flex items-center gap-1"
                >
                  <span>{r.fromName.split(' ')[0]} ⇄ {r.toName.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Submit Search Button */}
            <button
              onClick={() => {
                const fromSt = stations.find((s) => s.id === fromStationId);
                const toSt = stations.find((s) => s.id === toStationId);
                if (fromSt && toSt) {
                  GSRTCStorageEngine.addRecentSearch({
                    fromId: fromSt.id,
                    fromName: fromSt.nameEn,
                    toId: toSt.id,
                    toName: toSt.nameEn,
                  });
                }
                SpeechEngine.speak('Searching buses');
                onSearch();
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#E8590C] to-[#ff7728] hover:from-[#d14f08] hover:to-[#e86618] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/30 transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t('searchBuses')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
