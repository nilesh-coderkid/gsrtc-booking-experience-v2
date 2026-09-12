import React, { useState, useEffect } from 'react';
import { BusSchedule, BusTrackingLocation, Booking } from '@gsrtc/types';
import { TrackingService } from '../../services/trackingService';
import { GSRTCStorageEngine } from '../../services/storageEngine';
import { BookingService } from '../../services/bookingService';
import { Navigation, Compass, Zap, Clock, MapPin, Search, ShieldCheck, Utensils, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface LiveBusTrackerProps {
  initialPnr?: string;
}

export const LiveBusTracker: React.FC<LiveBusTrackerProps> = ({ initialPnr }) => {
  const { lang, t } = useLanguage();
  const defaultTarget =
    initialPnr ||
    GSRTCStorageEngine.getBookings()[0]?.pnr ||
    GSRTCStorageEngine.getSchedules()[0]?.busNumber ||
    '';
  const [searchPnr, setSearchPnr] = useState(defaultTarget);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [activeSchedule, setActiveSchedule] = useState<BusSchedule | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<BusTrackingLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialPnr) {
      setSearchPnr(initialPnr);
      handleTrackPnr(initialPnr);
    } else {
      handleTrackPnr(searchPnr);
    }
  }, [initialPnr]);

  // Periodic GPS Telemetry Refresh
  useEffect(() => {
    if (!activeSchedule) return;

    const interval = setInterval(() => {
      setTrackingInfo(TrackingService.getLiveLocation(activeSchedule));
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSchedule]);

  const handleTrackPnr = (pnrToSearch: string) => {
    setErrorMsg(null);
    const booking = BookingService.getBookingByPnr(pnrToSearch.trim());

    if (booking) {
      setActiveBooking(booking);
      const schedule = GSRTCStorageEngine.getScheduleById(booking.scheduleId) || GSRTCStorageEngine.getSchedules()[0];
      setActiveSchedule(schedule);
      setTrackingInfo(TrackingService.getLiveLocation(schedule));
    } else {
      // Fallback: check if matches a schedule ID or bus number, or show first active schedule
      const schedules = GSRTCStorageEngine.getSchedules();
      const match = schedules.find(
        (s) => s.busNumber.toLowerCase().includes(pnrToSearch.toLowerCase()) || s.id === pnrToSearch
      );
      if (match) {
        setActiveBooking(null);
        setActiveSchedule(match);
        setTrackingInfo(TrackingService.getLiveLocation(match));
      } else {
        // Default to first schedule
        const defaultSched = schedules[0];
        setActiveSchedule(defaultSched);
        setTrackingInfo(TrackingService.getLiveLocation(defaultSched));
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Search Bar for PNR or Bus Number */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#E8590C]" />
              <span>Real-Time GSRTC GPS Bus Tracking</span>
            </h2>
            <p className="text-xs text-slate-500">
              Track live highway location, speed, and expected arrival time for any GSRTC bus
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchPnr}
                onChange={(e) => setSearchPnr(e.target.value)}
                placeholder="Enter PNR or Bus Number"
                className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#002B49]"
              />
            </div>
            <button
              onClick={() => handleTrackPnr(searchPnr)}
              className="px-4 py-2 bg-[#002B49] hover:bg-[#00385F] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2 text-xs bg-red-50 text-red-700 rounded-lg">{errorMsg}</div>
        )}
      </div>

      {/* Live Tracking Display */}
      {activeSchedule && trackingInfo && (
        <div className="space-y-6">
          {/* Status & Speedometer Bar */}
          <div className="bg-gradient-to-r from-[#002B49] to-[#00406c] text-white rounded-2xl p-5 shadow-lg border border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E8590C] flex items-center justify-center font-bold text-white shadow-md">
                  <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono">
                      #{activeSchedule.busNumber}
                    </span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>GPS Connected</span>
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    {activeSchedule.busNameEn}
                  </h3>
                </div>
              </div>

              {/* Real-Time Telemetry Stats */}
              <div className="flex items-center gap-4">
                {/* Speedometer */}
                <div className="bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] text-slate-300 block uppercase font-bold">Live Speed</span>
                  <span className="text-xl font-black font-mono text-amber-300">
                    {trackingInfo.speedKmh} <span className="text-xs font-normal">km/h</span>
                  </span>
                </div>

                {/* Battery Indicator if Electric */}
                {trackingInfo.batteryPercentage !== undefined && (
                  <div className="bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/10 text-center">
                    <span className="text-[10px] text-slate-300 block uppercase font-bold flex items-center justify-center gap-0.5">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>EV Battery</span>
                    </span>
                    <span className="text-xl font-black font-mono text-emerald-300">
                      {trackingInfo.batteryPercentage}%
                    </span>
                  </div>
                )}

                {/* Last Ping */}
                <div className="hidden md:block bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Last GPS Ping</span>
                  <span className="text-xs font-mono text-slate-200">{trackingInfo.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Current Highway Status Text */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-300">Live Status:</span>
                <span>{trackingInfo.statusText}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Next Stop: <span className="text-white font-bold">{trackingInfo.nextUpcomingStop}</span> at{' '}
                <span className="text-amber-300 font-bold">{trackingInfo.estimatedArrivalNextStop}</span>
              </div>
            </div>
          </div>

          {/* Interactive Route Stop Progression Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center justify-between">
              <span>{lang === 'gu' ? 'રૂટ સ્ટોપ અને સમયપત્રક' : 'Route Milestones & Scheduled Stops'}</span>
              <span className="text-xs font-normal text-slate-500 normal-case flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{lang === 'gu' ? 'લાઈવ ઓટો-રીફ્રેશ' : 'Auto-refreshing live'}</span>
              </span>
            </h4>

            <div className="space-y-0">
              {activeSchedule.routeStops.map((stop, idx) => {
                const isOrigin = idx === 0;
                const isDestination = idx === activeSchedule.routeStops.length - 1;
                const isPassed = idx < (activeSchedule.routeStops.length > 2 ? 1 : 0);
                const isCurrent = idx === 1;

                return (
                  <div key={stop.stationId} className="flex items-start gap-4 group">
                    {/* Left Column: Milestone Node & Connecting Line (Strictly Independent Column) */}
                    <div className="flex flex-col items-center shrink-0 w-8">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm z-10 transition-transform group-hover:scale-105 ${
                          isCurrent
                            ? 'bg-[#E8590C] text-white ring-orange-100 shadow-md animate-pulse'
                            : isPassed
                            ? 'bg-[#059669] text-white ring-emerald-100'
                            : 'bg-slate-100 text-slate-600 ring-slate-100 border border-slate-200'
                        }`}
                      >
                        {isCurrent ? '🚌' : isPassed ? '✓' : idx + 1}
                      </div>

                      {!isDestination && (
                        <div
                          className={`w-0.5 flex-1 min-h-[44px] my-1 ${
                            isPassed ? 'bg-[#059669]' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>

                    {/* Right Column: Stop Details & Time */}
                    <div className={`flex-1 flex items-start justify-between gap-4 pt-1 ${!isDestination ? 'pb-7' : 'pb-1'}`}>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {lang === 'gu' ? stop.stationNameGu : stop.stationNameEn}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-orange-100 text-[#E8590C] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                              {lang === 'gu' ? 'હાલ પહોંચી રહ્યા છીએ' : 'Approaching Now'}
                            </span>
                          )}
                          {isOrigin && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                              {lang === 'gu' ? 'શરૂઆત' : 'Origin'}
                            </span>
                          )}
                          {isDestination && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                              {lang === 'gu' ? 'ગંતવ્ય' : 'Terminal'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {stop.platform ? `${lang === 'gu' ? 'પ્લેટફોર્મ: ' : 'Platform: '}${stop.platform}` : 'Express Stop'} •{' '}
                          {stop.distanceFromOriginKm} km {lang === 'gu' ? 'અંતર' : 'from start'}
                        </div>
                      </div>

                      {/* Scheduled & Estimated Time */}
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                          {stop.scheduledTime}
                        </div>
                        <div className="text-[10px] text-[#059669] font-semibold">
                          {lang === 'gu' ? 'સમયસર' : 'On Schedule'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Meal Stop Callout on Route */}
            {activeSchedule.mealStop && (
              <div className="mt-8 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">
                    Scheduled Refreshment Break: {activeSchedule.mealStop.locationName}
                  </span>
                  <span className="text-amber-800">
                    {activeSchedule.mealStop.durationMinutes} minutes pause at {activeSchedule.mealStop.expectedArrivalTime} ({activeSchedule.mealStop.highwayName})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
