import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LiveCounterTicker } from './components/layout/LiveCounterTicker';
import { HeroOmnibox } from './components/hero/HeroOmnibox';
import { BookingStepper, BookingStep } from './components/stepper/BookingStepper';
import { BusList } from './components/buses/BusList';
import { SeatPicker } from './components/seatmap/SeatPicker';
import { PassengerCheckout } from './components/checkout/PassengerCheckout';
import { ETicketView } from './components/ticket/ETicketView';
import { LiveBusTracker } from './components/tracking/LiveBusTracker';
import { BusPassSection } from './components/pass/BusPassSection';
import { CancellationSection } from './components/cancel/CancellationSection';
import { MyBookingsDrawer } from './components/layout/MyBookingsDrawer';
import { EmergencyHelplineModal } from './components/helpline/EmergencyHelplineModal';
import { Footer } from './components/layout/Footer';

import { BusSchedule, QuotaType, Booking } from '@gsrtc/types';
import { BusService, BusFilters } from './services/busService';
import { BookingService } from './services/bookingService';
import { GSRTCStorageEngine } from './services/storageEngine';
import { SeatLockService } from './services/seatLockService';

export function App() {
  // Top-level Navigation View
  const [activeTab, setActiveTab] = useState<'BOOKING' | 'TRACKING' | 'PASS' | 'CANCEL'>('BOOKING');

  // Booking Flow Steps (1: Bus Search, 2: Seat Picker, 3: Passenger/Checkout, 4: E-Ticket)
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);

  // Search Parameters
  const [fromStationId, setFromStationId] = useState('ADI-GM');
  const [toStationId, setToStationId] = useState('SOU-NV');
  const [journeyDate, setJourneyDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [quota, setQuota] = useState<QuotaType>('GENERAL');

  // Bus Filter & Search Results
  const [filters, setFilters] = useState<BusFilters>({
    busClass: 'ALL',
    hasAc: false,
    isSleeper: false,
    hasCharging: false,
    hasGps: false,
    sortBy: 'DEPARTURE_EARLY',
  });
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);

  // Selected & Locked Seats
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // Confirmed Booking / Ticket
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Tracking PNR target
  const [trackingPnr, setTrackingPnr] = useState<string>('GSRTC-982341');

  // Drawers & Modals
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);

  // Initialize Storage & run initial bus search
  useEffect(() => {
    GSRTCStorageEngine.initialize();
    performSearch();
  }, []);

  // When search params change, re-run search if on Step 1
  const performSearch = () => {
    const results = BusService.searchBuses(fromStationId, toStationId, journeyDate, quota, filters);
    setSchedules(results);
    setBookingStep(1);
    setSelectedSchedule(null);
    setSelectedSeats([]);
  };

  // Trigger search when filters change
  useEffect(() => {
    const results = BusService.searchBuses(fromStationId, toStationId, journeyDate, quota, filters);
    setSchedules(results);
  }, [filters, fromStationId, toStationId, quota]);

  // Handle bus selection -> Step 2
  const handleSelectSchedule = (sched: BusSchedule) => {
    // If switching bus, release old locks
    if (selectedSchedule && selectedSchedule.id !== sched.id) {
      SeatLockService.releaseAllMyLocks(selectedSchedule.id);
      setSelectedSeats([]);
    }
    setSelectedSchedule(sched);
    setBookingStep(2);

    // Smooth scroll down to seat picker
    setTimeout(() => {
      const el = document.getElementById('seat-picker-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Step 2 -> Step 3
  const handleProceedToBoarding = () => {
    if (selectedSeats.length === 0) return;
    setBookingStep(3);
    setTimeout(() => {
      const el = document.getElementById('checkout-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Step 3 -> Step 4 (Booking Success)
  const handleBookingSuccess = (pnr: string) => {
    const b = BookingService.getBookingByPnr(pnr);
    if (b) {
      setConfirmedBooking(b);
      setBookingStep(4);
      setTrackingPnr(pnr);
    }
  };

  // Step Navigation in Stepper
  const handleStepClick = (step: BookingStep) => {
    if (step === 1) {
      setBookingStep(1);
    } else if (step === 2 && selectedSchedule) {
      setBookingStep(2);
    } else if (step === 3 && selectedSchedule && selectedSeats.length > 0) {
      setBookingStep(3);
    } else if (step === 4 && confirmedBooking) {
      setBookingStep(4);
    }
  };

  const handleTrackBusFromTicket = (pnr: string) => {
    setTrackingPnr(pnr);
    setActiveTab('TRACKING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBookingFromDrawer = (b: Booking) => {
    setConfirmedBooking(b);
    setActiveTab('BOOKING');
    setBookingStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#E8590C] selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenHelpline={() => setIsHelplineOpen(true)}
      />

      {/* 2. Live Transit Fleet Counter Ticker */}
      <LiveCounterTicker />

      {/* 3. Main Content Views based on active tab */}
      <main className="flex-1 pb-12">
        {/* VIEW A: BOOKING TAB (ONE-PAGE FLOW) */}
        {activeTab === 'BOOKING' && (
          <div className="space-y-2">
            {/* Step Progress Stepper */}
            <BookingStepper
              currentStep={bookingStep}
              onStepClick={handleStepClick}
              selectedSeatsCount={selectedSeats.length}
            />

            {/* STEP 1: Hero Search & Bus List */}
            {bookingStep === 1 && (
              <>
                <HeroOmnibox
                  fromStationId={fromStationId}
                  toStationId={toStationId}
                  journeyDate={journeyDate}
                  quota={quota}
                  onFromStationChange={setFromStationId}
                  onToStationChange={setToStationId}
                  onJourneyDateChange={setJourneyDate}
                  onQuotaChange={setQuota}
                  onSearch={performSearch}
                />

                <BusList
                  schedules={schedules}
                  selectedScheduleId={selectedSchedule?.id || null}
                  onSelectSchedule={handleSelectSchedule}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </>
            )}

            {/* STEP 2: Interactive SeatPicker with Real-Time Lock */}
            {bookingStep === 2 && selectedSchedule && (
              <div id="seat-picker-section" className="px-4 py-4">
                <SeatPicker
                  schedule={selectedSchedule}
                  quota={quota}
                  selectedSeats={selectedSeats}
                  onSeatsChange={setSelectedSeats}
                  onProceed={handleProceedToBoarding}
                  onClose={() => setBookingStep(1)}
                />
              </div>
            )}

            {/* STEP 3: Passenger & Boarding Checkout */}
            {bookingStep === 3 && selectedSchedule && selectedSeats.length > 0 && (
              <div id="checkout-section">
                <PassengerCheckout
                  schedule={selectedSchedule}
                  journeyDate={journeyDate}
                  selectedSeats={selectedSeats}
                  onBack={() => setBookingStep(2)}
                  onBookingSuccess={handleBookingSuccess}
                />
              </div>
            )}

            {/* STEP 4: Confirmed Digital E-Ticket */}
            {bookingStep === 4 && confirmedBooking && (
              <ETicketView
                booking={confirmedBooking}
                onTrackBus={handleTrackBusFromTicket}
                onBookAnother={() => {
                  setConfirmedBooking(null);
                  setSelectedSchedule(null);
                  setSelectedSeats([]);
                  setBookingStep(1);
                  performSearch();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        )}

        {/* VIEW B: LIVE GPS BUS TRACKER */}
        {activeTab === 'TRACKING' && (
          <LiveBusTracker initialPnr={trackingPnr} />
        )}

        {/* VIEW C: DIGITAL BUS PASS PORTAL */}
        {activeTab === 'PASS' && (
          <BusPassSection />
        )}

        {/* VIEW D: CANCELLATION & REFUND SIMULATOR */}
        {activeTab === 'CANCEL' && (
          <CancellationSection />
        )}
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Modals & Drawers */}
      <MyBookingsDrawer
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onSelectBooking={handleSelectBookingFromDrawer}
        onTrackBus={handleTrackBusFromTicket}
      />

      <EmergencyHelplineModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
      />
    </div>
  );
}

export default App;
