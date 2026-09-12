import React from 'react';
import { Booking } from '@gsrtc/types';
import { CheckCircle2, Printer, Share2, MapPin, Bus, Clock, Calendar, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface ETicketViewProps {
  booking: Booking;
  onTrackBus: (pnr: string) => void;
  onBookAnother: () => void;
}

export const ETicketView: React.FC<ETicketViewProps> = ({
  booking,
  onTrackBus,
  onBookAnother,
}) => {
  const { lang } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `🚌 GSRTC Confirmed E-Ticket\nPNR: ${booking.pnr}\nFrom: ${booking.sourceStation.nameEn}\nTo: ${booking.destinationStation.nameEn}\nDate: ${booking.journeyDate}\nSeats: ${booking.selectedSeatNumbers.join(', ')}\nTotal: ₹${booking.totalPaid}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-emerald-900">
              Booking Confirmed! E-Ticket Generated
            </h2>
            <p className="text-xs text-emerald-700">
              Your official GSRTC boarding pass is ready. An SMS & WhatsApp notification has been simulated.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* The Printable E-Ticket Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-[#002B49] to-[#004b80] text-white p-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8590C] flex items-center justify-center font-bold text-white shadow-md">
              <Bus className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded font-bold">
                Government of Gujarat • GSRTC
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-serif">
                Electronic Reservation Slip (E-Ticket)
              </h1>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-300">PNR NUMBER</div>
            <div className="text-2xl font-mono font-black text-amber-300 tracking-wider">
              {booking.pnr}
            </div>
          </div>
        </div>

        {/* Ticket Body Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Origin -> Destination Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Origin Depot</span>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'gu' ? booking.sourceStation.nameGu : booking.sourceStation.nameEn}
              </div>
              <div className="text-xs font-mono font-semibold text-[#E8590C]">
                {booking.departureTime}
              </div>
            </div>

            <div className="text-center py-2 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Journey Date: {booking.journeyDate}
              </span>
              <div className="w-full flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E8590C]" />
                <div className="flex-1 max-w-[120px] h-0.5 bg-slate-300 border-t border-dashed" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 mt-1">
                Bus #{booking.busNumber}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destination Depot</span>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'gu' ? booking.destinationStation.nameGu : booking.destinationStation.nameEn}
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-600">
                {booking.arrivalTime}
              </div>
            </div>
          </div>

          {/* Boarding Info & QR Code Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left Boarding details */}
            <div className="sm:col-span-8 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-700">Official Boarding Point:</span>
                  <div className="text-xs text-slate-600">
                    {booking.boardingStop.stationNameEn} • Platform: {booking.boardingStop.platform || 'General Express Bay'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Scheduled Departure: {booking.departureTime} (Reporting: 15 mins prior)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Class:</span>
                  <span className="font-bold text-slate-800">{booking.busClass.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Seats Reserved:</span>
                  <span className="font-black text-[#E8590C] text-sm font-mono">
                    {booking.selectedSeatNumbers.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Fare Paid:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    ₹{booking.totalPaid.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic QR Code for Conductor */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              {/* Simulated high-density QR box */}
              <div className="w-24 h-24 bg-white border-2 border-slate-800 p-1.5 rounded-lg flex items-center justify-center shadow-sm">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1.5 font-bold">
                SCAN FOR BOARDING
              </span>
              <span className="text-[9px] text-slate-400">Anti-counterfeit cryptographic token</span>
            </div>
          </div>

          {/* Passenger Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5">Seat No.</th>
                  <th className="p-2.5">Passenger Name</th>
                  <th className="p-2.5">Age</th>
                  <th className="p-2.5">Gender</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {booking.passengers.map((p) => (
                  <tr key={p.seatNumber} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-[#002B49]">#{p.seatNumber}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{p.fullName}</td>
                    <td className="p-2.5 text-slate-600">{p.age} yrs</td>
                    <td className="p-2.5 text-slate-600">{p.gender}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">CONFIRMED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advisory Notes */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GSRTC Passenger Travel Advisory:</span>
            </div>
            <p>1. Please carry a valid original Government Photo ID proof during the journey.</p>
            <p>2. E-Ticket shown on mobile/SMS/WhatsApp is valid for travel. Physical printout is optional.</p>
            <p>3. Toll-Free 24x7 Customer Support & Grievance: 1800 233 666666.</p>
          </div>
        </div>

        {/* Ticket Footer Action Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={onBookAnother}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            ← Book Another Journey
          </button>

          <button
            onClick={() => onTrackBus(booking.pnr)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#002B49] hover:bg-[#003c66] text-white font-bold text-xs rounded-xl shadow transition cursor-pointer active:scale-95"
          >
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>Track This Bus Live on GPS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
