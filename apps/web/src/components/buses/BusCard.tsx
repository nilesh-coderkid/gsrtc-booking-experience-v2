import React from 'react';
import { BusSchedule } from '@gsrtc/types';
import { Clock, ShieldCheck, Zap, Utensils, Star, Wifi, BatteryCharging, Navigation, ChevronRight, Wind } from 'lucide-react';
import { BusService } from '../../services/busService';
import { useLanguage } from '../../hooks/useLanguage';

interface BusCardProps {
  schedule: BusSchedule;
  isSelected: boolean;
  onSelectSeats: () => void;
}

export const BusCard: React.FC<BusCardProps> = ({ schedule, isSelected, onSelectSeats }) => {
  const { lang, t } = useLanguage();
  const seatPreview = BusService.getSeatPreview(schedule);

  const getBusClassBadge = () => {
    switch (schedule.busClass) {
      case 'VOLVO_AC':
        return { label: 'Volvo AC Luxury', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'ELECTRIC_EXPRESS':
        return { label: 'Green EV Express', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'SLEEPER_NON_AC':
        return { label: 'Sleeper 2+1 Coach', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'GURJARNAGARI':
        return { label: 'Gurjarnagari 2x2', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'EXPRESS':
      default:
        return { label: 'Express Standard', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const badge = getBusClassBadge();

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-[#002B49] ring-2 ring-[#002B49]/20 bg-blue-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Section: Bus Identity & Timing */}
        <div className="flex-1">
          {/* Header Row: Bus Name, Class, Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
              {badge.label}
            </span>
            {schedule.isElectric && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>Zero Emission EV</span>
              </span>
            )}
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{schedule.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              #{schedule.busNumber}
            </span>
          </div>

          {/* Bus Name */}
          <h3 className="text-base font-bold text-slate-900 mb-2">
            {lang === 'gu' ? schedule.busNameGu : schedule.busNameEn}
          </h3>

          {/* Time & Journey Diagram */}
          <div className="flex items-center gap-4 py-1">
            <div>
              <div className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                {schedule.departureTime}
              </div>
              <div className="text-xs font-medium text-slate-500 max-w-[140px] truncate">
                {schedule.routeStops[0]?.stationNameEn}
              </div>
            </div>

            {/* Travel Line */}
            <div className="flex-1 max-w-[160px] flex flex-col items-center">
              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3" />
                <span>{schedule.durationFormatted}</span>
              </div>
              <div className="w-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#E8590C]" />
                <div className="flex-1 h-0.5 bg-slate-200 border-t border-dashed border-slate-300" />
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {schedule.distanceKm} km • {schedule.isDirectExpress ? 'Non-Stop' : 'Via Depots'}
              </div>
            </div>

            <div>
              <div className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                {schedule.arrivalTime}
              </div>
              <div className="text-xs font-medium text-slate-500 max-w-[140px] truncate">
                {schedule.routeStops[schedule.routeStops.length - 1]?.stationNameEn}
              </div>
            </div>
          </div>

          {/* Meal Stop Highlight (Bhojanalay Break) */}
          {schedule.mealStop && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50/80 border border-amber-200/60 rounded-lg px-2.5 py-1 w-fit">
              <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-semibold">{t('foodStop')}:</span>
              <span>
                {schedule.mealStop.locationName} ({schedule.mealStop.durationMinutes} mins at {schedule.mealStop.expectedArrivalTime})
              </span>
            </div>
          )}
        </div>

        {/* Right Section: Live Seat Preview & Pricing */}
        <div className="lg:border-l lg:border-slate-100 lg:pl-6 flex flex-row lg:flex-col justify-between lg:justify-center items-end gap-3 min-w-[210px] pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {/* Seat Preview Badges */}
          <div className="flex flex-col items-start lg:items-end gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{seatPreview.totalAvailable} Seats Available</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>🪟 {seatPreview.windowAvailable} Window</span>
              <span>•</span>
              <span className="text-pink-600 font-medium">🚺 {seatPreview.ladiesAvailable} Ladies</span>
            </div>
          </div>

          {/* Price & Booking Action */}
          <div className="flex items-center lg:flex-col lg:items-end gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Starting from</span>
              <div className="text-2xl font-black text-slate-900">
                ₹{schedule.baseFare}
              </div>
            </div>

            <button
              onClick={onSelectSeats}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95 ${
                isSelected
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#002B49] hover:bg-[#00385F] text-white'
              }`}
            >
              <span>{isSelected ? 'Change Seats' : t('selectSeats')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Amenities Micro-Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          {schedule.amenities.hasAc && (
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-blue-500" />
              <span>Air Conditioned</span>
            </span>
          )}
          {schedule.amenities.hasCharging && (
            <span className="flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-500" />
              <span>USB Charging Ports</span>
            </span>
          )}
          {schedule.amenities.hasGps && (
            <span className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-amber-500" />
              <span>GPS Live Tracked</span>
            </span>
          )}
          {schedule.amenities.hasWifi && (
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-purple-500" />
              <span>Free Transit Wi-Fi</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>GSRTC Sanity & Safety Assured</span>
        </div>
      </div>
    </div>
  );
};
