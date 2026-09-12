import React, { useState, useEffect } from 'react';
import { BusSchedule, Seat, SeatDeck, QuotaType } from '@gsrtc/types';
import { useSeatLocks } from '../../hooks/useSeatLocks';
import { SeatLockService } from '../../services/seatLockService';
import { SpeechEngine } from '../../speech/speechEngine';
import { useLanguage } from '../../hooks/useLanguage';
import { Lock, Clock, AlertTriangle, Armchair, Bed, ShieldAlert, ArrowRight, X } from 'lucide-react';

interface SeatPickerProps {
  schedule: BusSchedule;
  quota: QuotaType;
  selectedSeats: number[];
  onSeatsChange: (seatNumbers: number[]) => void;
  onProceed: () => void;
  onClose: () => void;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({
  schedule,
  quota,
  selectedSeats,
  onSeatsChange,
  onProceed,
  onClose,
}) => {
  const { lang, t } = useLanguage();
  const [activeDeck, setActiveDeck] = useState<SeatDeck>('LOWER');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const {
    isLockedByMe,
    isLockedByOther,
    getMyHeldSeatNumbers,
    getMyEarliestExpiration,
  } = useSeatLocks(schedule.id);

  const isSleeper = schedule.busClass.includes('SLEEPER');
  const hasUpperDeck = isSleeper && schedule.seats.some((s) => s.deck === 'UPPER');

  // Countdown timer for user's held seats
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const earliest = getMyEarliestExpiration();
      if (!earliest) {
        setRemainingSeconds(null);
        return;
      }
      const diff = Math.max(0, Math.floor((earliest - Date.now()) / 1000));
      setRemainingSeconds(diff);

      if (diff === 0) {
        // Expired! Release locks
        SeatLockService.releaseAllMyLocks(schedule.id);
        onSeatsChange([]);
        setAlertMessage('Your 10-minute temporary seat hold has expired. Please select your seats again.');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [schedule.id, getMyEarliestExpiration]);

  const formatCountdown = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seat: Seat) => {
    setAlertMessage(null);

    // 1. Check if permanently booked
    if (SeatLockService.isSeatBooked(schedule.id, seat.seatNumber)) {
      setAlertMessage(`Seat ${seat.seatLabel} is already booked.`);
      SpeechEngine.speak(`Seat ${seat.seatLabel} is already booked.`);
      return;
    }

    // 2. Check if held by another user in real time
    const otherLock = isLockedByOther(seat.seatNumber);
    if (otherLock.locked) {
      const remainingHold = otherLock.lockedUntil ? Math.max(0, Math.floor((otherLock.lockedUntil - Date.now()) / 1000)) : 600;
      setAlertMessage(
        `🔒 Seat ${seat.seatLabel} is currently held by another passenger. Hold expires in ${formatCountdown(remainingHold)} if not booked.`
      );
      SpeechEngine.speak(`Seat ${seat.seatLabel} is held by another passenger.`);
      return;
    }

    // 3. If already selected by me -> Deselect & release lock
    if (isLockedByMe(seat.seatNumber)) {
      SeatLockService.releaseSeat(schedule.id, seat.seatNumber);
      const updated = selectedSeats.filter((n) => n !== seat.seatNumber);
      onSeatsChange(updated);
      SpeechEngine.speak(`Deselected seat ${seat.seatLabel}`);
      return;
    }

    // 4. Quota check: Single Lady Adjacent Rule
    if (quota === 'SINGLE_LADY' && seat.quota !== 'LADIES' && seat.quota !== 'GENERAL') {
      setAlertMessage('Please select seats marked for ladies or general quota.');
      return;
    }

    // Max 6 seats limit per booking
    if (selectedSeats.length >= 6) {
      setAlertMessage('You can book a maximum of 6 seats in a single transaction.');
      return;
    }

    // 5. Attempt Atomic Lock Acquisition
    const lockResult = SeatLockService.tryLockSeat(schedule.id, seat.seatNumber);
    if (lockResult.success === false) {
      if (lockResult.reason === 'LOCKED_BY_OTHER') {
        setAlertMessage(`🔒 Seat ${seat.seatLabel} was just selected by another passenger!`);
      } else {
        setAlertMessage(`Seat ${seat.seatLabel} is already booked.`);
      }
      return;
    }

    // Successfully locked
    const updated = [...selectedSeats, seat.seatNumber];
    onSeatsChange(updated);
    SpeechEngine.speak(`Selected seat ${seat.seatLabel}. Hold timer started.`);
  };

  const deckSeats = schedule.seats.filter((s) => s.deck === activeDeck);
  const maxRow = Math.max(...deckSeats.map((s) => s.row), 1);
  const maxCol = Math.max(...deckSeats.map((s) => s.col), 4);

  const totalBaseFare = selectedSeats.reduce((sum, seatNum) => {
    const seatObj = schedule.seats.find((s) => s.seatNumber === seatNum);
    return sum + (seatObj?.basePrice || schedule.baseFare);
  }, 0);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-700 max-w-5xl mx-auto my-6 relative animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#E8590C] text-white px-2 py-0.5 rounded font-bold uppercase">
              Seat Selection 2.0
            </span>
            <span className="text-xs text-slate-400 font-mono">#{schedule.busNumber}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
            {lang === 'gu' ? schedule.busNameGu : schedule.busNameEn}
          </h3>
        </div>

        {/* 10-Minute Lock Countdown Banner */}
        {remainingSeconds !== null && (
          <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold pulse-lock">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Hold Timer: {formatCountdown(remainingSeconds)} Remaining</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          title="Close Seat Map"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Alert / Concurrency Notification Toast */}
      {alertMessage && (
        <div className="my-3 p-3 bg-amber-950/80 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Multi-Deck Switcher (For Sleeper Coaches) */}
      {hasUpperDeck && (
        <div className="flex justify-center my-4">
          <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700">
            <button
              onClick={() => setActiveDeck('LOWER')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeDeck === 'LOWER' ? 'bg-[#E8590C] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bed className="w-3.5 h-3.5" />
              <span>{t('lowerDeck')}</span>
            </button>
            <button
              onClick={() => setActiveDeck('UPPER')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeDeck === 'UPPER' ? 'bg-[#E8590C] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bed className="w-3.5 h-3.5" />
              <span>{t('upperDeck')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Seat Map Canvas Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center my-6">
        {/* The Bus Body Frame */}
        <div className="bg-slate-950 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-w-sm sm:max-w-md w-full">
          {/* Driver Cabin Area */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-800 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Front / Driver Cabin</span>
            </div>
            {/* Steering Wheel Icon Indicator */}
            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400">
              <span className="text-xs font-mono font-bold">⎈</span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3">
            {Array.from({ length: maxRow }, (_, rIdx) => {
              const rowNum = rIdx + 1;
              const rowSeats = deckSeats.filter((s) => s.row === rowNum);

              return (
                <div key={rowNum} className="flex items-center justify-between gap-2">
                  {/* Left Column(s) */}
                  <div className="flex items-center gap-2">
                    {rowSeats
                      .filter((s) => s.col <= 2)
                      .map((seat) => renderSeatButton(seat))}
                  </div>

                  {/* Aisle Spacer */}
                  <div className="text-[10px] text-slate-700 font-mono tracking-widest px-2 uppercase select-none">
                    Aisle
                  </div>

                  {/* Right Column(s) */}
                  <div className="flex items-center gap-2">
                    {rowSeats
                      .filter((s) => s.col > 2)
                      .map((seat) => renderSeatButton(seat))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rear Bus Marker */}
          <div className="mt-5 pt-3 border-t border-dashed border-slate-800 text-center text-[10px] text-slate-600 uppercase tracking-widest font-mono">
            Rear End • Emergency Exit
          </div>
        </div>

        {/* Right Legend & Selection Summary */}
        <div className="w-full lg:w-72 flex flex-col justify-between">
          {/* Visual Legend */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              Seat Status Legend
            </h4>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-white border border-slate-400 text-slate-900 text-[10px] font-bold flex items-center justify-center">
                1
              </div>
              <span className="text-slate-300">Available</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-[#005088] border border-blue-400 text-white text-[10px] font-bold flex items-center justify-center shadow">
                ✓
              </div>
              <span className="text-blue-300 font-semibold">Selected by You</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md seat-locked-stripes text-amber-800 flex items-center justify-center border border-amber-500 shadow">
                <Lock className="w-3 h-3" />
              </div>
              <div className="flex flex-col">
                <span className="text-amber-300 font-semibold">Held by Another User</span>
                <span className="text-[10px] text-slate-400">Locked in real-time</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-slate-700 border border-slate-600 text-slate-500 text-[10px] flex items-center justify-center">
                ✕
              </div>
              <span className="text-slate-400">Booked</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-pink-100 border border-pink-400 text-pink-700 text-[10px] font-bold flex items-center justify-center">
                ♀
              </div>
              <span className="text-pink-300">Ladies Quota</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-blue-900/60 border border-blue-400 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                ♿
              </div>
              <span className="text-blue-300">Divyang Quota</span>
            </div>
          </div>

          {/* Selection Checkout Card */}
          <div className="bg-gradient-to-br from-[#002B49] to-[#001c30] rounded-2xl p-5 border border-white/10 shadow-xl mt-4">
            <div className="text-xs text-slate-300 mb-1">Selected Seats:</div>
            <div className="flex items-center gap-1.5 flex-wrap min-h-[32px] mb-3">
              {selectedSeats.length > 0 ? (
                selectedSeats.map((num) => (
                  <span
                    key={num}
                    className="bg-[#E8590C] text-white text-xs font-bold px-2 py-0.5 rounded-md shadow"
                  >
                    Seat {num}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No seats selected yet</span>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-3 border-t border-white/10 mb-4">
              <span className="text-xs text-slate-300">Total Base Fare:</span>
              <span className="text-2xl font-black text-white font-mono">
                ₹{totalBaseFare}
              </span>
            </div>

            <button
              onClick={onProceed}
              disabled={selectedSeats.length === 0}
              className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95 ${
                selectedSeats.length > 0
                  ? 'bg-gradient-to-r from-[#E8590C] to-[#ff7a29] hover:from-[#d34f07] hover:to-[#e86919] text-white shadow-orange-500/30'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{t('proceedToBoarding')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function renderSeatButton(seat: Seat) {
    const isBooked = SeatLockService.isSeatBooked(schedule.id, seat.seatNumber);
    const lockedByMe = isLockedByMe(seat.seatNumber);
    const otherLock = isLockedByOther(seat.seatNumber);
    const isSleeperBerth = seat.seatType.includes('SLEEPER');

    let bgStyle = 'bg-white text-slate-900 hover:bg-orange-50 border-slate-300';
    let icon = null;

    if (isBooked) {
      bgStyle = 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-60';
    } else if (lockedByMe) {
      bgStyle = 'bg-[#005088] text-white border-blue-400 shadow-md ring-2 ring-blue-300 scale-105';
    } else if (otherLock.locked) {
      bgStyle = 'seat-locked-stripes text-amber-900 border-amber-500 cursor-not-allowed shadow-inner';
      icon = <Lock className="w-3 h-3 text-amber-900" />;
    } else if (seat.quota === 'LADIES') {
      bgStyle = 'bg-pink-50 text-pink-800 border-pink-300 hover:bg-pink-100';
    } else if (seat.quota === 'DIVYANG') {
      bgStyle = 'bg-blue-950/60 text-blue-300 border-blue-400 hover:bg-blue-900';
    }

    return (
      <button
        key={seat.seatNumber}
        type="button"
        onClick={() => handleSeatClick(seat)}
        disabled={isBooked}
        className={`border rounded-lg font-bold text-xs flex flex-col items-center justify-center transition active:scale-95 cursor-pointer relative ${
          isSleeperBerth ? 'w-16 h-10' : 'w-10 h-10'
        } ${bgStyle}`}
        title={`Seat ${seat.seatLabel} • ${seat.quota} • ₹${seat.basePrice}`}
      >
        {/* Window Indicator */}
        {seat.isWindow && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-400 ring-1 ring-white" title="Window Seat" />
        )}

        {/* Content */}
        <div className="flex items-center gap-1">
          {icon}
          <span>{seat.seatLabel}</span>
        </div>
      </button>
    );
  }
};
