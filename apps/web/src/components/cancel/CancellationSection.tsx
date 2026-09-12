import React, { useState } from 'react';
import { Booking } from '@gsrtc/types';
import { BookingService } from '../../services/bookingService';
import { GSRTCStorageEngine } from '../../services/storageEngine';
import { XCircle, Search, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, Wallet } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const CancellationSection: React.FC = () => {
  const { t } = useLanguage();
  const [pnrInput, setPnrInput] = useState('');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResultMsg(null);

    const b = BookingService.getBookingByPnr(pnrInput.trim());
    if (!b) {
      setErrorMsg('No confirmed booking found with this PNR number. Please verify.');
      setActiveBooking(null);
      return;
    }

    setActiveBooking(b);
  };

  const handleCancelTicket = () => {
    if (!activeBooking) return;
    const res = BookingService.cancelBooking(activeBooking.pnr);
    if (res.success) {
      setResultMsg({ success: true, text: res.message });
      // Refresh active booking
      const refreshed = BookingService.getBookingByPnr(activeBooking.pnr);
      if (refreshed) setActiveBooking(refreshed);
    } else {
      setResultMsg({ success: false, text: res.message });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-1">
          <XCircle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Instant Ticket Cancellation & Automated Refund Engine
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          No more sending emails to refund desk. Calculate your refund policy tier and receive instant wallet credit in 1 click.
        </p>

        {/* PNR Search Box */}
        <form onSubmit={handleLookup} className="mt-5 flex gap-2 max-w-md">
          <input
            type="text"
            required
            value={pnrInput}
            onChange={(e) => setPnrInput(e.target.value)}
            placeholder="Enter 10-digit PNR (e.g. GSRTC-982341)"
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Lookup</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Ticket Details & Cancellation Action */}
      {activeBooking && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-mono">PNR: {activeBooking.pnr}</span>
              <h3 className="text-base font-bold text-slate-900">
                {activeBooking.sourceStation.nameEn} ⇄ {activeBooking.destinationStation.nameEn}
              </h3>
              <span className="text-xs text-slate-500">
                Date: {activeBooking.journeyDate} • Bus #{activeBooking.busNumber}
              </span>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                activeBooking.status === 'CONFIRMED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              Status: {activeBooking.status}
            </span>
          </div>

          {/* Refund Calculation Summary */}
          {activeBooking.status === 'CONFIRMED' ? (
            <div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs mb-4">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Cancellation & Refund Calculation
                </h4>
                <div className="flex justify-between text-slate-600">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono font-bold text-slate-900">₹{activeBooking.totalPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Cancellation Charge (15%):</span>
                  <span className="text-red-600 font-mono">-₹{(activeBooking.totalPaid * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-800 font-bold pt-2 border-t border-slate-200">
                  <span>Net Refundable to GSRTC Wallet:</span>
                  <span className="font-mono text-emerald-700 text-sm">
                    ₹{(activeBooking.totalPaid * 0.85).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 text-xs text-red-900">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                  <span>
                    Proceeding will cancel your seat reservation and credit your refund to your wallet immediately.
                  </span>
                </div>

                <button
                  onClick={handleCancelTicket}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition whitespace-nowrap active:scale-95"
                >
                  Confirm Cancellation & Refund
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Ticket Cancelled</span>
              <p className="text-slate-600">
                Refund of <span className="font-mono font-bold text-emerald-700">₹{activeBooking.refundAmount?.toFixed(2)}</span> was processed on {activeBooking.cancellationTime}.
              </p>
            </div>
          )}

          {resultMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                resultMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resultMsg.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Official Policy Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Official GSRTC Cancellation Policy Rules
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">&gt; 24 Hours Prior</span>
            <span className="text-emerald-700 font-semibold text-sm">90% Refund</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">10% cancellation charge</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">12 - 24 Hours Prior</span>
            <span className="text-amber-700 font-semibold text-sm">75% Refund</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">25% cancellation charge</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">&lt; 12 Hours Prior</span>
            <span className="text-red-700 font-semibold text-sm">50% Refund</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">50% cancellation charge</span>
          </div>
        </div>
      </div>
    </div>
  );
};
