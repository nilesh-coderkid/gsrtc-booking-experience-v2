import { BusSchedule, QuotaType, BusClass } from '@gsrtc/types';
import { GSRTCStorageEngine } from './storageEngine';
import { SeatLockService } from './seatLockService';

export interface BusFilters {
  busClass?: BusClass | 'ALL';
  hasAc?: boolean;
  isSleeper?: boolean;
  hasCharging?: boolean;
  hasGps?: boolean;
  timeSlot?: 'ALL' | 'EARLY_MORNING' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  sortBy?: 'FARE_LOW' | 'DEPARTURE_EARLY' | 'DURATION_SHORT';
}

export interface SeatPreviewInfo {
  totalAvailable: number;
  windowAvailable: number;
  ladiesAvailable: number;
  divyangAvailable: number;
}

export class BusService {
  public static getScheduleById(id: string): BusSchedule | undefined {
    return GSRTCStorageEngine.getScheduleById(id);
  }

  public static getSeatPreview(schedule: BusSchedule): SeatPreviewInfo {
    const activeLocks = SeatLockService.getActiveLocksForSchedule(schedule.id);
    const lockedSeatNums = new Set(activeLocks.map((l) => l.seatNumber));

    let totalAvailable = 0;
    let windowAvailable = 0;
    let ladiesAvailable = 0;
    let divyangAvailable = 0;

    for (const seat of schedule.seats) {
      const isBooked = SeatLockService.isSeatBooked(schedule.id, seat.seatNumber);
      const isLocked = lockedSeatNums.has(seat.seatNumber);

      if (!isBooked && !isLocked) {
        totalAvailable++;
        if (seat.isWindow) windowAvailable++;
        if (seat.quota === 'LADIES') ladiesAvailable++;
        if (seat.quota === 'DIVYANG') divyangAvailable++;
      }
    }

    return {
      totalAvailable,
      windowAvailable,
      ladiesAvailable,
      divyangAvailable,
    };
  }

  public static searchBuses(
    sourceId: string,
    destinationId: string,
    _journeyDate: string,
    quota: QuotaType = 'GENERAL',
    filters?: BusFilters
  ): BusSchedule[] {
    const all = GSRTCStorageEngine.getSchedules();

    let results = all.filter((s) => {
      // Station matching:
      // Allow exact match OR route stops containing both source and destination
      const hasDirectRoute =
        (s.sourceStationId === sourceId && s.destinationStationId === destinationId) ||
        (s.routeStops.some((st) => st.stationId === sourceId) &&
          s.routeStops.some((st) => st.stationId === destinationId));

      if (!hasDirectRoute) return false;

      // Special Quota Filtering
      if (quota === 'ELECTRIC_BUS' && !s.isElectric) {
        return false;
      }
      if (quota === 'STATUE_OF_UNITY' && s.destinationStationId !== 'SOU-NV') {
        return false;
      }

      // Amenity filters
      if (filters?.hasAc && !s.amenities.hasAc) return false;
      if (filters?.hasCharging && !s.amenities.hasCharging) return false;
      if (filters?.hasGps && !s.amenities.hasGps) return false;
      if (filters?.isSleeper && !s.busClass.includes('SLEEPER')) return false;

      // Bus class filter
      if (filters?.busClass && filters.busClass !== 'ALL' && s.busClass !== filters.busClass) {
        return false;
      }

      // Time slot filtering
      if (filters?.timeSlot && filters.timeSlot !== 'ALL') {
        const hour = this.parseHour24(s.departureTime);
        if (filters.timeSlot === 'EARLY_MORNING' && (hour < 4 || hour >= 8)) return false;
        if (filters.timeSlot === 'MORNING' && (hour < 8 || hour >= 12)) return false;
        if (filters.timeSlot === 'AFTERNOON' && (hour < 12 || hour >= 16)) return false;
        if (filters.timeSlot === 'EVENING' && (hour < 16 || hour >= 20)) return false;
        if (filters.timeSlot === 'NIGHT' && (hour < 20 && hour >= 4)) return false;
      }

      return true;
    });

    // Sorting
    if (filters?.sortBy) {
      if (filters.sortBy === 'FARE_LOW') {
        results.sort((a, b) => a.baseFare - b.baseFare);
      } else if (filters.sortBy === 'DEPARTURE_EARLY') {
        results.sort((a, b) => this.parseMinutes(a.departureTime) - this.parseMinutes(b.departureTime));
      } else if (filters.sortBy === 'DURATION_SHORT') {
        results.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }

    return results;
  }

  private static parseHour24(timeStr: string): number {
    const parts = timeStr.trim().split(/[:\s]/);
    let hour = parseInt(parts[0], 10);
    const ampm = parts[parts.length - 1].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return hour;
  }

  private static parseMinutes(timeStr: string): number {
    const parts = timeStr.trim().split(/[:\s]/);
    let hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10) || 0;
    const ampm = parts[parts.length - 1].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minute;
  }
}
