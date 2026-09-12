import React, { useState } from 'react';
import { BusSchedule, Passenger, RouteStop } from '@gsrtc/types';
import { BookingService } from '../../services/bookingService';
import { GSRTCStorageEngine } from '../../services/storageEngine';
import { SpeechEngine } from '../../speech/speechEngine';
import { useLanguage } from '../../hooks/useLanguage';
import confetti from 'canvas-confetti';
import { UserCheck, Shield, MapPin, Wallet, QrCode, CreditCard, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

interface PassengerCheckoutProps {
  schedule: BusSchedule;
  journeyDate: string;
  selectedSeats: number[];
  onBack: () => void;
  onBookingSuccess: (pnr: string) => void;
}

export const PassengerCheckout: React.FC<PassengerCheckoutProps> = ({
  schedule,
  journeyDate,
  selectedSeats,
  onBack,
  onBookingSuccess,
}) => {
  const { t } = useLanguage();
  const [boardingStop, setBoardingStop] = useState<RouteStop>(schedule.routeStops[0]);
  const [droppingStop, setDroppingStop] = useState<RouteStop>(
    schedule.routeStops[schedule.routeStops.length - 1]
  );

  // Initialize passenger records for each selected seat (unfilled by default)
  const [passengers, setPassengers] = useState<Passenger[]>(
    selectedSeats.map((seatNumber) => ({
      seatNumber,
      fullName: '',
      age: 0,
      gender: 'MALE',
      isSingleLady: false,
      concessionType: 'NONE',
    }))
  );

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'WALLET' | 'CARD'>('UPI');
  const [walletBalance, setWalletBalance] = useState(GSRTCStorageEngine.getWalletBalance());
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const baseFareTotal = selectedSeats.reduce((sum, seatNum) => {
    const seatObj = schedule.seats.find((s) => s.seatNumber === seatNum);
    return sum + (seatObj?.basePrice || schedule.baseFare);
  }, 0);

  // Dynamic fee calculation based on actual distance and schedule amenities
  const tollFee = Math.max(10, Math.round(schedule.distanceKm * 0.07));
  const amenitiesFee =
    (schedule.amenities.hasAc ? 15 : 5) +
    (schedule.amenities.hasCharging ? 5 : 0) +
    (schedule.amenities.hasWater ? 5 : 0);
  const gstAmount = Math.round((baseFareTotal + tollFee + amenitiesFee) * 0.05 * 100) / 100;
  const totalAmount = Math.round((baseFareTotal + tollFee + amenitiesFee + gstAmount) * 100) / 100;

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handlePayAndConfirm = () => {
    setErrorMsg(null);

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].fullName.trim()) {
        setErrorMsg(`Please enter full name for Passenger on Seat ${passengers[i].seatNumber}.`);
        return;
      }
      if (!passengers[i].age || passengers[i].age < 1 || passengers[i].age > 120) {
        setErrorMsg(`Please enter a valid age (1-120) for Passenger on Seat ${passengers[i].seatNumber}.`);
        return;
      }
    }

    if (paymentMethod === 'WALLET' && walletBalance < totalAmount) {
      setErrorMsg(`Insufficient wallet balance. You have ₹${walletBalance.toFixed(2)}, but total is ₹${totalAmount.toFixed(2)}.`);
      return;
    }

    setIsProcessing(true);
    SpeechEngine.speak('Processing your booking');

    // Simulate fast payment verification (800ms)
    setTimeout(() => {
      const newBooking = BookingService.createBooking({
        schedule,
        journeyDate,
        boardingStop,
        droppingStop,
        passengers,
        selectedSeatNumbers: selectedSeats,
        baseFareTotal,
        tollFee,
        amenitiesFee,
        gstAmount,
        totalPaid: totalAmount,
        paymentMethod,
      });

      setIsProcessing(false);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }

      SpeechEngine.speak(`Booking confirmed. Your PNR is ${newBooking.pnr}`);
      onBookingSuccess(newBooking.pnr);
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-[#002B49] hover:text-[#E8590C] transition mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Seat Selection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Boarding Stop & Passenger Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Boarding & Dropping Points Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E8590C]" />
              <span>Select Boarding & Dropping Points</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Boarding Point (Depot Stand)
                </label>
                <select
                  value={boardingStop.stationId}
                  onChange={(e) => {
                    const st = schedule.routeStops.find((s) => s.stationId === e.target.value);
                    if (st) setBoardingStop(st);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                >
                  {schedule.routeStops.map((st) => (
                    <option key={st.stationId} value={st.stationId}>
                      {st.stationNameEn} • {st.scheduledTime} ({st.platform || 'General Bay'})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Please report 15 minutes before scheduled departure time.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Dropping Point
                </label>
                <select
                  value={droppingStop.stationId}
                  onChange={(e) => {
                    const st = schedule.routeStops.find((s) => s.stationId === e.target.value);
                    if (st) setDroppingStop(st);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                >
                  {schedule.routeStops.map((st) => (
                    <option key={st.stationId} value={st.stationId}>
                      {st.stationNameEn} • Est. {st.scheduledTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Passenger Information Cards */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>Passenger Details ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})</span>
            </h3>

            <div className="space-y-4">
              {passengers.map((p, idx) => (
                <div
                  key={p.seatNumber}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-[#002B49] text-white px-2.5 py-0.5 rounded-md">
                      Seat #{p.seatNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Passenger {idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Full Name (as per Govt ID)
                      </label>
                      <input
                        type="text"
                        value={p.fullName}
                        onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={p.age || ''}
                        placeholder="Age"
                        onChange={(e) => handlePassengerChange(idx, 'age', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Gender
                      </label>
                      <select
                        value={p.gender}
                        onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                      >
                        <option value="MALE">Male (પુરુષ)</option>
                        <option value="FEMALE">Female (સ્ત્રી)</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Female Passenger Safety Quota Checkbox */}
                  {p.gender === 'FEMALE' && (
                    <label className="flex items-center gap-2 cursor-pointer mt-1 bg-pink-50 p-2 rounded-lg border border-pink-200">
                      <input
                        type="checkbox"
                        checked={p.isSingleLady}
                        onChange={(e) => handlePassengerChange(idx, 'isSingleLady', e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded"
                      />
                      <span className="text-xs font-bold text-pink-900">
                        Single Female Traveler (Reserve adjacent seat protection)
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Simulator Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Select Payment Method (Fast Simulator)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UPI QR Option */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col items-center text-center ${
                  paymentMethod === 'UPI'
                    ? 'border-[#002B49] bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <QrCode className="w-7 h-7 text-[#002B49] mb-1" />
                <span className="text-xs font-bold text-slate-900">Instant UPI</span>
                <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm QR</span>
              </div>

              {/* GSRTC Smart Wallet */}
              <div
                onClick={() => setPaymentMethod('WALLET')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col items-center text-center ${
                  paymentMethod === 'WALLET'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Wallet className="w-7 h-7 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">GSRTC Wallet</span>
                <span className="text-[10px] text-emerald-700 font-bold">
                  Bal: ₹{walletBalance.toFixed(2)}
                </span>
              </div>

              {/* Debit/Credit Card */}
              <div
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col items-center text-center ${
                  paymentMethod === 'CARD'
                    ? 'border-[#002B49] bg-blue-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-7 h-7 text-[#002B49] mb-1" />
                <span className="text-xs font-bold text-slate-900">Cards / NetBanking</span>
                <span className="text-[10px] text-slate-500">RuPay, Visa, SBI, BoB</span>
              </div>
            </div>

            {/* UPI Simulator Details */}
            {paymentMethod === 'UPI' && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 bg-white border border-slate-300 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] text-slate-700">
                  [UPI QR]
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block">Instant Mock Checkout</span>
                  Clicking confirm will simulate instant payment verification and generate your digital ticket.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Fare Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>{t('fareSummary')}</span>
            </h3>

            {/* Journey Summary */}
            <div className="py-3 border-b border-slate-100 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Bus Number:</span>
                <span className="font-mono font-bold text-slate-900">{schedule.busNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Journey Date:</span>
                <span className="font-semibold text-slate-900">{journeyDate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Seats:</span>
                <span className="font-bold text-[#E8590C]">
                  {selectedSeats.join(', ')} ({selectedSeats.length})
                </span>
              </div>
            </div>

            {/* Cost Breakup */}
            <div className="py-3 border-b border-slate-100 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({selectedSeats.length} seats):</span>
                <span className="font-semibold text-slate-900">₹{baseFareTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State Road Toll:</span>
                <span>₹{tollFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Passenger Amenities Fund:</span>
                <span>₹{amenitiesFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5% Transit Tax):</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Payable */}
            <div className="py-3 flex items-baseline justify-between mb-4">
              <span className="text-sm font-bold text-slate-800">Total Payable:</span>
              <span className="text-2xl font-black text-[#002B49] font-mono">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handlePayAndConfirm}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95 ${
                isProcessing
                  ? 'bg-slate-400 text-white cursor-wait'
                  : 'bg-gradient-to-r from-[#E8590C] to-[#ff7a29] hover:from-[#d34f07] hover:to-[#e86919] text-white shadow-orange-500/30'
              }`}
            >
              {isProcessing ? (
                <span>Generating E-Ticket...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t('payNow')}</span>
                </>
              )}
            </button>

            <div className="mt-3 text-center text-[10px] text-slate-400">
              🔒 256-bit SSL Encrypted • Direct GSRTC Reservation Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
