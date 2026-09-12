import React, { useState, useEffect } from 'react';
import { Bus, Users, Navigation, Zap } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const LiveCounterTicker: React.FC = () => {
  const { t } = useLanguage();
  const [passengers, setPassengers] = useState(1284920);
  const [busesOnRoad, setBusesOnRoad] = useState(7842);

  // Micro-simulate active bus movements and ticket counter
  useEffect(() => {
    const interval = setInterval(() => {
      setPassengers((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setBusesOnRoad((prev) => 7840 + Math.floor(Math.sin(Date.now() / 10000) * 15));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#00223b] border-y border-white/10 py-3 px-4 text-white shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
        <div className="flex flex-col items-center justify-center p-1">
          <div className="flex items-center gap-1.5 text-orange-400 mb-0.5">
            <Bus className="w-4 h-4" />
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white font-mono">
              {busesOnRoad.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium">
            {t('activeFleetOnRoad')}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-1">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-0.5">
            <Users className="w-4 h-4" />
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white font-mono">
              {passengers.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium">
            {t('dailyPassengers')}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 pt-2 md:pt-1">
          <div className="flex items-center gap-1.5 text-blue-400 mb-0.5">
            <Navigation className="w-4 h-4" />
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white font-mono">
              100% GPS
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium">
            Real-Time Vehicle Tracking
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 pt-2 md:pt-1">
          <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
            <Zap className="w-4 h-4" />
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white font-mono">
              520+ Green EV
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium">
            Zero-Emission Electric Fleet
          </span>
        </div>
      </div>
    </div>
  );
};
