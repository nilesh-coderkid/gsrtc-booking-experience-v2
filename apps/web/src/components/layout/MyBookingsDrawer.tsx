import React, { useState, useEffect } from 'react';
import { Booking } from '@gsrtc/types';
import { GSRTCStorageEngine } from '../../services/storageEngine';
import { Ticket, X, MapPin, Calendar, ArrowRight, Printer, CheckCircle2 } from 'lucide-react';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (booking: Booking) => void;
  onTrackBus: (pnr: string) => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectBooking,
  onTrackBus,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBookings(GSRTCStorageEngine.getBookings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#002B49] to-[#00406c] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Ticket className="w-5 h-5 text-orange-400" />
              <h2 className="text-base font-bold">My Stored E-Tickets ({bookings.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bookings List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <div
                  key={b.pnr}
                  className="pt-3 first:pt-0 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#002B49] bg-blue-50 px-2 py-0.5 rounded">
                      {b.pnr}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 mb-1">
                    {b.sourceStation.nameEn.split(' ')[0]} ⇄ {b.destinationStation.nameEn.split(' ')[0]}
                  </div>

                  <div className="text-xs text-slate-500 space-y-0.5 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.journeyDate} • {b.departureTime}</span>
                    </div>
                    <div>Seats: {b.selectedSeatNumbers.join(', ')} • Total: ₹{b.totalPaid.toFixed(2)}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onSelectBooking(b);
                        onClose();
                      }}
                      className="flex-1 py-1.5 bg-[#002B49] hover:bg-[#00385F] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </button>

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => {
                          onTrackBus(b.pnr);
                          onClose();
                        }}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Track Bus GPS"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
                        <span>Track</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                <Ticket className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <span>No tickets booked yet. Book your first journey!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
