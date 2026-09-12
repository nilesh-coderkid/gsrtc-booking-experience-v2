import { Booking, Passenger, RouteStop, BusSchedule } from '@gsrtc/types';
import { GSRTCStorageEngine } from './storageEngine';
import { SeatLockService } from './seatLockService';

export interface CreateBookingParams {
  schedule: BusSchedule;
  journeyDate: string;
  boardingStop: RouteStop;
  droppingStop: RouteStop;
  passengers: Passenger[];
  selectedSeatNumbers: number[];
  baseFareTotal: number;
  tollFee: number;
  amenitiesFee: number;
  gstAmount: number;
  totalPaid: number;
  paymentMethod: 'UPI' | 'CARD' | 'WALLET';
}

export class BookingService {
  public static createBooking(params: CreateBookingParams): Booking {
    const stations = GSRTCStorageEngine.getStations();
    const sourceStation = stations.find((s) => s.id === params.schedule.sourceStationId) || stations[0];
    const destinationStation = stations.find((s) => s.id === params.schedule.destinationStationId) || stations[1];

    // Generate unique 6-digit PNR
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const pnr = `GSRTC-${randomNum}`;

    const newBooking: Booking = {
      pnr,
      scheduleId: params.schedule.id,
      busNumber: params.schedule.busNumber,
      busClass: params.schedule.busClass,
      sourceStation,
      destinationStation,
      journeyDate: params.journeyDate,
      departureTime: params.schedule.departureTime,
      arrivalTime: params.schedule.arrivalTime,
      boardingStop: params.boardingStop,
      droppingStop: params.droppingStop,
      passengers: params.passengers,
      selectedSeatNumbers: params.selectedSeatNumbers,
      baseFareTotal: params.baseFareTotal,
      tollFee: params.tollFee,
      amenitiesFee: params.amenitiesFee,
      gstAmount: params.gstAmount,
      totalPaid: params.totalPaid,
      paymentMethod: params.paymentMethod,
      paymentId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      bookingTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'CONFIRMED',
      qrCodeValue: `GSRTC-E-TICKET|PNR:${pnr}|BUS:${params.schedule.busNumber}|SEATS:${params.selectedSeatNumbers.join(',')}|DATE:${params.journeyDate}`,
    };

    // If paid by wallet, deduct
    if (params.paymentMethod === 'WALLET') {
      GSRTCStorageEngine.updateWalletBalance(-params.totalPaid);
    }

    // Finalize seat locks into confirmed reservation
    SeatLockService.finalizeSeatBooking(params.schedule.id, params.selectedSeatNumbers);

    // Save booking to storage
    const currentBookings = GSRTCStorageEngine.getBookings();
    currentBookings.unshift(newBooking);
    GSRTCStorageEngine.setItem('gsrtc_bookings', currentBookings);

    return newBooking;
  }

  public static getBookingByPnr(pnr: string): Booking | undefined {
    return GSRTCStorageEngine.getBookings().find((b) => b.pnr.toUpperCase() === pnr.toUpperCase());
  }

  public static calculateRefundPolicy(booking: Booking): {
    percentage: number;
    chargeRate: number;
    chargeAmount: number;
    refundAmount: number;
    tierLabel: string;
  } {
    // Parse departure datetime (e.g. "2026-09-12 06:30 AM")
    const parseTime = (timeStr: string) => {
      const parts = timeStr.trim().split(/[:\s]/);
      let h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) || 0;
      const ampm = parts[parts.length - 1].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return { h, m };
    };

    const { h, m } = parseTime(booking.departureTime);
    const depDate = new Date(booking.journeyDate);
    depDate.setHours(h, m, 0, 0);

    const now = new Date();
    const diffHours = (depDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let percentage = 0.85;
    let chargeRate = 0.15;
    let tierLabel = 'Standard Cancellation (> 12 Hours Prior)';

    if (diffHours > 24) {
      percentage = 0.90;
      chargeRate = 0.10;
      tierLabel = '> 24 Hours Prior to Departure (10% Charge)';
    } else if (diffHours > 12) {
      percentage = 0.75;
      chargeRate = 0.25;
      tierLabel = '12 - 24 Hours Prior to Departure (25% Charge)';
    } else if (diffHours > 2) {
      percentage = 0.50;
      chargeRate = 0.50;
      tierLabel = '2 - 12 Hours Prior to Departure (50% Charge)';
    } else if (diffHours <= 2 && diffHours > 0) {
      percentage = 0.0;
      chargeRate = 1.0;
      tierLabel = '< 2 Hours Prior to Departure (Non-Refundable)';
    }

    const chargeAmount = Math.round(booking.totalPaid * chargeRate * 100) / 100;
    const refundAmount = Math.round(booking.totalPaid * percentage * 100) / 100;

    return {
      percentage,
      chargeRate,
      chargeAmount,
      refundAmount,
      tierLabel,
    };
  }

  public static cancelBooking(pnr: string): { success: boolean; refundAmount: number; message: string } {
    const bookings = GSRTCStorageEngine.getBookings();
    const index = bookings.findIndex((b) => b.pnr.toUpperCase() === pnr.toUpperCase());

    if (index === -1) {
      return { success: false, refundAmount: 0, message: 'Ticket with this PNR not found.' };
    }

    const booking = bookings[index];
    if (booking.status === 'CANCELLED') {
      return { success: false, refundAmount: 0, message: 'This ticket has already been cancelled.' };
    }

    // Dynamic Policy Calculation
    const { refundAmount, tierLabel } = this.calculateRefundPolicy(booking);

    booking.status = 'CANCELLED';
    booking.refundAmount = refundAmount;
    booking.cancellationTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    bookings[index] = booking;
    GSRTCStorageEngine.setItem('gsrtc_bookings', bookings);

    // Credit refund to GSRTC Wallet
    if (refundAmount > 0) {
      GSRTCStorageEngine.updateWalletBalance(refundAmount);
    }

    return {
      success: true,
      refundAmount,
      message: `Ticket ${pnr} cancelled (${tierLabel}). ₹${refundAmount} has been refunded to your GSRTC Smart Wallet.`,
    };
  }
}
