import React from 'react';
import { Bus, ShieldCheck, PhoneCall, Mail, RotateCcw, Heart } from 'lucide-react';
import { GSRTCStorageEngine } from '../../services/storageEngine';

export const Footer: React.FC = () => {
  const handleResetData = () => {
    if (window.confirm('Reset all demo bookings, locks, and local storage to factory defaults?')) {
      GSRTCStorageEngine.resetToFactoryDefaults();
    }
  };

  return (
    <footer className="bg-[#001729] text-white pt-12 pb-8 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: About GSRTC */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E8590C] flex items-center justify-center font-bold text-white">
                <Bus className="w-5 h-5" />
              </div>
              <span className="text-base font-bold tracking-tight">GSRTC Gujarat</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gujarat State Road Transport Corporation is a state-owned public passenger transit authority operating 8,000+ daily routes across Gujarat and neighboring states.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Government Undertaking</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
              Fleet & Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Volvo Multi-Axle AC Luxury Coach</li>
              <li>• Green Gujarat Electric Buses (EV)</li>
              <li>• Gurjarnagari 2x2 Express Services</li>
              <li>• 2+1 Sleeper Night Transit Services</li>
              <li>• Statue of Unity (Ekta Express Tour)</li>
              <li>• Student & Monthly Commuter Passes</li>
            </ul>
          </div>

          {/* Col 3: Passenger Safety & Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
              Help & Grievance Redressal
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
                <span>Toll-Free: 1800 233 666666</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                <span>Women Helpline: 181 (Abhayam)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>customercare@gsrtc.gujarat.gov.in</span>
              </li>
              <li className="text-[11px] text-slate-400 pt-1">
                Central Bus Stand, Geeta Mandir, Ahmedabad - 380022
              </li>
            </ul>
          </div>

          {/* Col 4: Testing & Tech Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
              Modern Transit Engine
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Built with React 19, TypeScript & Tailwind CSS with atomic client-side seat locking and cross-tab multi-user synchronization.
            </p>
            <button
              onClick={handleResetData}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold text-slate-200 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
              <span>Reset Demo Seed Data</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Gujarat State Road Transport Corporation (GSRTC). All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for Gujarat State Travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
