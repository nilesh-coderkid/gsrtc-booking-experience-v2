import React, { useState } from 'react';
import { BusSchedule } from '@gsrtc/types';
import { BusCard } from './BusCard';
import { BusService, BusFilters } from '../../services/busService';
import { Filter, SlidersHorizontal, ArrowUpDown, BusFront } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface BusListProps {
  schedules: BusSchedule[];
  selectedScheduleId: string | null;
  onSelectSchedule: (schedule: BusSchedule) => void;
  filters: BusFilters;
  onFilterChange: (newFilters: BusFilters) => void;
}

export const BusList: React.FC<BusListProps> = ({
  schedules,
  selectedScheduleId,
  onSelectSchedule,
  filters,
  onFilterChange,
}) => {
  const { t } = useLanguage();
  const [showAllFilters, setShowAllFilters] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Filters & Sorting Toolbar */}
      <div className="bg-white rounded-2xl p-4 mb-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Amenity Quick Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 text-[#002B49]" />
            <span>Filters:</span>
          </span>

          <button
            onClick={() => onFilterChange({ ...filters, hasAc: !filters.hasAc })}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer border ${
              filters.hasAc
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            ❄️ AC Buses
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, isSleeper: !filters.isSleeper })}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer border ${
              filters.isSleeper
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            🛏️ Sleeper Berths
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, hasCharging: !filters.hasCharging })}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer border ${
              filters.hasCharging
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            🔌 Charging Ports
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, hasGps: !filters.hasGps })}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer border ${
              filters.hasGps
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            📍 Live GPS
          </button>
        </div>

        {/* Quick Sorting Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#002B49]" />
            <span>Sort:</span>
          </span>

          <button
            onClick={() => onFilterChange({ ...filters, sortBy: 'FARE_LOW' })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              filters.sortBy === 'FARE_LOW'
                ? 'bg-[#002B49] text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Lowest Fare
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, sortBy: 'DURATION_SHORT' })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              filters.sortBy === 'DURATION_SHORT'
                ? 'bg-[#002B49] text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Fastest Route
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, sortBy: 'DEPARTURE_EARLY' })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              filters.sortBy === 'DEPARTURE_EARLY'
                ? 'bg-[#002B49] text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Earliest Departure
          </button>
        </div>
      </div>

      {/* Bus Results Count Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-bold text-slate-800">
          Available GSRTC Services ({schedules.length})
        </h2>
        <span className="text-xs text-slate-500">
          Showing real-time scheduled state transport buses
        </span>
      </div>

      {/* List of Bus Cards */}
      {schedules.length > 0 ? (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <BusCard
              key={schedule.id}
              schedule={schedule}
              isSelected={selectedScheduleId === schedule.id}
              onSelectSeats={() => onSelectSchedule(schedule)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-[#E8590C] mb-4">
            <BusFront className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No direct buses found for selected filters
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Try resetting your amenity filters or check our high-frequency routes like Ahmedabad to Statue of Unity or Surat.
          </p>
          <button
            onClick={() =>
              onFilterChange({
                busClass: 'ALL',
                hasAc: false,
                isSleeper: false,
                hasCharging: false,
                hasGps: false,
                sortBy: 'DEPARTURE_EARLY',
              })
            }
            className="px-5 py-2 bg-[#002B49] text-white text-xs font-bold rounded-xl shadow cursor-pointer hover:bg-[#00385F] transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
