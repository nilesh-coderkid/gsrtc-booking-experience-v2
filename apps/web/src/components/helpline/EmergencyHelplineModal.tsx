import React from 'react';
import { PhoneCall, ShieldAlert, HeartHandshake, Building, X, ExternalLink } from 'lucide-react';

interface EmergencyHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelplineModal: React.FC<EmergencyHelplineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center absolute right-5 top-5 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
              Emergency & Support
            </span>
            <h3 className="text-lg font-black text-slate-900 font-serif">
              GSRTC 24x7 Helpline & Passenger Safety
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-5">
          Reach official Gujarat state transit dispatchers, women safety marshals, and local depot managers directly.
        </p>

        <div className="space-y-3">
          {/* Main Toll Free */}
          <a
            href="tel:1800233666666"
            className="flex items-center justify-between p-3.5 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl hover:border-red-400 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Toll-Free Control Room</span>
                <span className="text-xs font-mono font-bold text-red-700">1800 233 666666</span>
              </div>
            </div>
            <span className="text-[10px] bg-white px-2 py-1 rounded-lg border text-red-600 font-bold group-hover:bg-red-600 group-hover:text-white transition">
              Call 24x7
            </span>
          </a>

          {/* Women's Safety Abhayam 181 */}
          <a
            href="tel:181"
            className="flex items-center justify-between p-3.5 bg-pink-50 border border-pink-200 rounded-2xl hover:border-pink-400 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Abhayam Women's Helpline</span>
                <span className="text-xs font-mono font-bold text-pink-700">181 (Gujarat State)</span>
              </div>
            </div>
            <span className="text-[10px] bg-white px-2 py-1 rounded-lg border text-pink-600 font-bold group-hover:bg-pink-600 group-hover:text-white transition">
              Call 181
            </span>
          </a>

          {/* Major Depot Dispatch Contacts */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              Major Division Control Rooms:
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block text-[11px]">Ahmedabad Geeta Mandir</span>
                <span className="font-mono text-[10px]">079-25463360</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block text-[11px]">Vadodara Central</span>
                <span className="font-mono text-[10px]">0265-2429643</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block text-[11px]">Surat Central</span>
                <span className="font-mono text-[10px]">0261-2422016</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block text-[11px]">Rajkot Central</span>
                <span className="font-mono text-[10px]">0281-2224403</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Close Safety Directory
          </button>
        </div>
      </div>
    </div>
  );
};
