import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, ArrowRightLeft, Search, History, Sparkles, Shield, Accessibility, Zap, Landmark, ArrowRight, User } from 'lucide-react';
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
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [passengerCount, setPassengerCount] = useState('1');

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

  // Click outside listener for station dropdowns
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

    SpeechEngine.speak(lang === 'gu' ? 'સ્થળ બદલાયું' : 'Swapped stations');
  };

  const handleSelectCorridor = (fromCode: string, toCode: string) => {
    const fStation = stations.find((s) => s.id === fromCode || s.code === fromCode || s.nameGu.includes(fromCode) || s.nameEn.includes(fromCode));
    const tStation = stations.find((s) => s.id === toCode || s.code === toCode || s.nameGu.includes(toCode) || s.nameEn.includes(toCode));

    if (fStation) {
      onFromStationChange(fStation.id);
      setFromQuery(lang === 'gu' ? fStation.nameGu : fStation.nameEn);
    }
    if (tStation) {
      onToStationChange(tStation.id);
      setToQuery(lang === 'gu' ? tStation.nameGu : tStation.nameEn);
    }

    SpeechEngine.speak(lang === 'gu' ? `રૂટ પસંદ કર્યો: ${fStation?.nameGu} થી ${tStation?.nameGu}` : `Selected ${fStation?.nameEn} to ${tStation?.nameEn}`);

    setTimeout(() => {
      onSearch();
    }, 100);
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

  const getTodayDate = () => new Date().toISOString().split('T')[0];
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

  const quotaOptions: { id: QuotaType; labelGu: string; labelEn: string; icon: React.ElementType }[] = [
    { id: 'GENERAL', labelGu: 'સામાન્ય (General)', labelEn: 'General', icon: Sparkles },
    { id: 'SINGLE_LADY', labelGu: 'મહિલા ક્વોટા (Single Lady)', labelEn: 'Single Lady', icon: Shield },
    { id: 'DIVYANG', labelGu: 'દિવ્યાંગ ક્વોટા (Divyang ♿)', labelEn: 'Divyang ♿', icon: Accessibility },
    { id: 'ELECTRIC_BUS', labelGu: 'ઇલેક્ટ્રિક એક્સપ્રેસ', labelEn: 'Electric Bus', icon: Zap },
    { id: 'STATUE_OF_UNITY', labelGu: 'એકતા નગર સ્પેશિયલ (SOU)', labelEn: 'Statue of Unity', icon: Landmark },
  ];

  const currentFrom = stations.find((s) => s.id === fromStationId);
  const currentTo = stations.find((s) => s.id === toStationId);

  return (
    <div className="w-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F8FAFD 0%, #EEF4FB 40%, #E6EEF9 100%)' }}>
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Hero Greeting Section */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 pt-10 pb-28">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">
              {lang === 'gu'
                ? 'સલામત, સુવિધાજનક અને વિશ્વસનીય મુસાફરી • આપણી એસ.ટી. આપણી શાન'
                : 'Safe, Reliable & Convenient Travel • Gujarat State Road Transport'}
            </span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] leading-tight tracking-tight">
            {lang === 'gu'
              ? 'ગુજરાતમાં તમારી સરળ અને સુરક્ષિત યાત્રા'
              : 'Effortless & Safe Transit Across Gujarat'}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {lang === 'gu'
              ? 'રાજ્યના ૧૮,૦૦૦+ ગામો અને ૨૫૦+ મુખ્ય બસ મથકો સાથે જોડતી આપણી GSRTC સેવા. સરળતાથી ટિકિટ બુક કરો, સીટ પસંદ કરો અને બસ ટ્રેક કરો.'
              : 'Connecting 18,000+ villages and 250+ central bus stations across Gujarat. Book seats in real-time, pick berths, and track buses live.'}
          </p>
        </div>
      </div>

      {/* ELEVATED BOOKING CARD (Floating Stitch Layout) */}
      <div className="max-w-[1260px] mx-auto px-4 sm:px-6 -mt-20 pb-12 relative z-20" id="booking-section">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-slate-100/90 relative">
          {/* Top Row: Quota Selector Pills & Trip Type Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            {/* Quota Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 mr-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>{lang === 'gu' ? 'ક્વોટા:' : 'Quota:'}</span>
              </span>

              {quotaOptions.map((q) => {
                const Icon = q.icon;
                const isSelected = quota === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      onQuotaChange(q.id);
                      if (q.id === 'STATUE_OF_UNITY') {
                        onToStationChange('SOU-NV');
                        const sou = stations.find((s) => s.id === 'SOU-NV');
                        if (sou) setToQuery(lang === 'gu' ? sou.nameGu : sou.nameEn);
                      }
                      SpeechEngine.speak(lang === 'gu' ? `પસંદ કરેલ ક્વોટા: ${q.labelGu}` : `Selected ${q.labelEn} quota`);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'font-bold bg-[#b91d20] text-white shadow-sm ring-2 ring-red-300/40'
                        : 'font-semibold bg-slate-100 hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{lang === 'gu' ? q.labelGu : q.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Trip Type Switcher */}
            <div className="inline-flex bg-slate-100/80 p-1 rounded-2xl shrink-0 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setTripType('oneway')}
                className={`px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  tripType === 'oneway'
                    ? 'font-bold bg-white text-slate-900 shadow-sm'
                    : 'font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'gu' ? 'એક તરફી યાત્રા (One Way)' : 'One Way'}
              </button>
              <button
                type="button"
                onClick={() => setTripType('roundtrip')}
                className={`px-4 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  tripType === 'roundtrip'
                    ? 'font-bold bg-white text-slate-900 shadow-sm'
                    : 'font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{lang === 'gu' ? 'રાઉન્ડ ટ્રીપ (આવવા-જવા)' : 'Round Trip'}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-md">
                  {lang === 'gu' ? '૧૦% છૂટ' : '10% Off'}
                </span>
              </button>
            </div>
          </div>

          {/* Main Inputs: FROM <-> SWAP <-> TO <-> DATE <-> PASSENGERS <-> ACTION */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* 1. FROM Station Input */}
            <div
              className="md:col-span-3 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 rounded-2xl p-4 transition-all focus-within:border-[#b91d20] focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 group relative"
              ref={fromRef}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="flex items-center gap-1.5 text-[#b91d20] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'ક્યાંથી (ઉપડવાનું સ્થળ)' : 'From (Origin)'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-sans tracking-wider">ORIGIN</span>
              </div>
              <input
                type="text"
                value={fromQuery}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setFromDropdownOpen(true);
                }}
                onFocus={() => setFromDropdownOpen(true)}
                placeholder="e.g. Ahmedabad, Surat"
                className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold text-[16px] focus:ring-0 placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-500 block mt-1 truncate">
                {currentFrom ? `${currentFrom.division} Division • Platform 1-12` : 'Select Departure Depot'}
              </span>

              {/* Autocomplete Dropdown */}
              {fromDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-slate-100">
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
                        className="p-3 hover:bg-red-50/50 cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {lang === 'gu' ? s.nameGu : s.nameEn}
                          </div>
                          <div className="text-[11px] text-slate-500 font-sans">
                            {s.nameEn} • {s.code} • {s.division}
                          </div>
                        </div>
                        {s.isPopular && (
                          <span className="text-[10px] bg-red-100 text-[#b91d20] px-2 py-0.5 rounded-full font-bold">
                            Major Hub
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-500 text-center">No station found</div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Swap Interchange Button */}
            <div className="md:col-span-1 flex items-center justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={handleSwapStations}
                className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                title={lang === 'gu' ? 'સ્થળ બદલો (Swap)' : 'Swap Stations'}
              >
                <ArrowRightLeft className="w-5 h-5 text-[#b91d20] group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            {/* 3. TO Station Input */}
            <div
              className="md:col-span-3 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 rounded-2xl p-4 transition-all focus-within:border-[#059669] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 group relative"
              ref={toRef}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="flex items-center gap-1.5 text-[#059669] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'ક્યાં સુધી (ગંતવ્ય)' : 'To (Destination)'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-sans tracking-wider">DESTINATION</span>
              </div>
              <input
                type="text"
                value={toQuery}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setToDropdownOpen(true);
                }}
                onFocus={() => setToDropdownOpen(true)}
                placeholder="e.g. Bhavnagar, Somnath, Kevadia"
                className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold text-[16px] focus:ring-0 placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-500 block mt-1 truncate">
                {currentTo ? `${currentTo.division} Division • CBS Terminal` : 'Select Destination Depot'}
              </span>

              {/* Autocomplete Dropdown */}
              {toDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-slate-100">
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
                        className="p-3 hover:bg-emerald-50/50 cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {lang === 'gu' ? s.nameGu : s.nameEn}
                          </div>
                          <div className="text-[11px] text-slate-500 font-sans">
                            {s.nameEn} • {s.code} • {s.division}
                          </div>
                        </div>
                        {s.isPopular && (
                          <span className="text-[10px] bg-emerald-100 text-[#059669] px-2 py-0.5 rounded-full font-bold">
                            Major Hub
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-500 text-center">No station found</div>
                  )}
                </div>
              )}
            </div>

            {/* 4. JOURNEY DATE Input */}
            <div className="md:col-span-2 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 rounded-2xl p-4 transition-all focus-within:border-slate-800 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100 group">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'gu' ? 'પ્રવાસ તારીખ' : 'Travel Date'}</span>
                </span>
              </div>
              <input
                type="date"
                value={journeyDate}
                min={getTodayDate()}
                onChange={(e) => onJourneyDateChange(e.target.value)}
                className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold text-[15px] focus:ring-0 cursor-pointer"
              />
              <div className="flex items-center gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => onJourneyDateChange(getTodayDate())}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                    journeyDate === getTodayDate()
                      ? 'bg-[#0B1E33] text-white font-bold'
                      : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {lang === 'gu' ? 'આજે' : 'Today'}
                </button>
                <button
                  type="button"
                  onClick={() => onJourneyDateChange(getTomorrowDate())}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                    journeyDate === getTomorrowDate()
                      ? 'bg-[#0B1E33] text-white font-bold'
                      : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {lang === 'gu' ? 'કાલે' : 'Tmrw'}
                </button>
                <button
                  type="button"
                  onClick={() => onJourneyDateChange(getDayAfterTomorrowDate())}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                    journeyDate === getDayAfterTomorrowDate()
                      ? 'bg-[#0B1E33] text-white font-bold'
                      : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  +૨
                </button>
              </div>
            </div>

            {/* 5. PASSENGERS Selector */}
            <div className="md:col-span-1 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 rounded-2xl p-4 transition-all focus-within:border-slate-800 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100 group">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'gu' ? 'મુસાફર' : 'Pax'}</span>
                </span>
              </div>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
                className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold text-[15px] focus:ring-0 cursor-pointer"
              >
                <option value="1">{lang === 'gu' ? '૧ મુસાફર' : '1 Pax'}</option>
                <option value="2">{lang === 'gu' ? '૨ મુસાફરો' : '2 Pax'}</option>
                <option value="3">{lang === 'gu' ? '૩ મુસાફરો' : '3 Pax'}</option>
                <option value="4">{lang === 'gu' ? '૪ મુસાફરો' : '4 Pax'}</option>
                <option value="5">{lang === 'gu' ? '૫+ જૂથ' : '5+ Group'}</option>
              </select>
              <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                {lang === 'gu' ? 'પુખ્ત વય' : 'Adult'}
              </span>
            </div>

            {/* 6. SEARCH ACTION BUTTON (Prominent GSRTC Vermilion Gradient) */}
            <div className="md:col-span-2 flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (currentFrom && currentTo) {
                    GSRTCStorageEngine.addRecentSearch({
                      fromId: currentFrom.id,
                      fromName: currentFrom.nameEn,
                      toId: currentTo.id,
                      toName: currentTo.nameEn,
                    });
                  }
                  SpeechEngine.speak(lang === 'gu' ? 'બસો શોધી રહ્યા છીએ' : 'Searching buses');
                  onSearch();
                }}
                className="w-full h-full min-h-[58px] rounded-2xl bg-gradient-to-r from-[#c62828] to-[#b71c1c] hover:from-[#b71c1c] hover:to-[#9b1619] text-white px-5 py-3 shadow-glow-red hover:shadow-xl transition-all flex items-center justify-center gap-2 font-bold text-[15px] transform active:scale-95 group cursor-pointer"
              >
                <Search className="w-5 h-5" />
                <span>{lang === 'gu' ? 'બસ શોધો' : 'Search Buses'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Quick Popular Corridors Chips in Gujarati */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-bold flex items-center gap-1 whitespace-nowrap">
              <History className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>{lang === 'gu' ? 'લોકપ્રિય રૂટ્સ:' : 'Popular Routes:'}</span>
            </span>

            <button
              type="button"
              onClick={() => handleSelectCorridor('ADI-GM', 'ST-CB')}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#b91d20] hover:text-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {lang === 'gu' ? 'અમદાવાદ → સુરત' : 'Ahmedabad → Surat'}
            </button>

            <button
              type="button"
              onClick={() => handleSelectCorridor('BRC-CB', 'SOU-NV')}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#b91d20] hover:text-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {lang === 'gu' ? 'વડોદરા → એકતા નગર (SOU)' : 'Vadodara → SOU'}
            </button>

            <button
              type="button"
              onClick={() => handleSelectCorridor('RJT-CB', 'SMN-TR')}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#b91d20] hover:text-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {lang === 'gu' ? 'રાજકોટ → સોમનાથ' : 'Rajkot → Somnath'}
            </button>

            <button
              type="button"
              onClick={() => handleSelectCorridor('ADI-GM', 'BVN-CB')}
              className="px-3 py-1 rounded-full bg-red-50 text-[#b91d20] font-bold hover:bg-[#b91d20] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              {lang === 'gu' ? 'અમદાવાદ → ભાવનગર (ડાયરેક્ટ)' : 'Ahmedabad → Bhavnagar'}
            </button>

            <button
              type="button"
              onClick={() => handleSelectCorridor('ST-CB', 'DWK-TR')}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#b91d20] hover:text-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {lang === 'gu' ? 'સુરત → દ્વારકા' : 'Surat → Dwarka'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
