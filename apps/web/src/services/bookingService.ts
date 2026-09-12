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

    // Policy Calculation: 85% refund if cancelled before departure
    const refundPercentage = 0.85;
    const refundAmount = Math.round(booking.totalPaid * refundPercentage * 100) / 100;

    booking.status = 'CANCELLED';
    booking.refundAmount = refundAmount;
    booking.cancellationTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    bookings[index] = booking;
    GSRTCStorageEngine.setItem('gsrtc_bookings', bookings);

    // Credit refund to GSRTC Wallet
    GSRTCStorageEngine.updateWalletBalance(refundAmount);

    return {
      success: true,
      refundAmount,
      message: `Ticket ${pnr} cancelled successfully. ₹${refundAmount} has been refunded to your GSRTC Smart Wallet.`,
    };
  }
}
