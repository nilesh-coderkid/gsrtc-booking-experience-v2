import { SeatLock } from '@gsrtc/types';
import { GSRTCStorageEngine } from './storageEngine';

const SEAT_LOCKS_KEY = 'gsrtc_seat_locks';
const BROADCAST_CHANNEL_NAME = 'gsrtc_seat_channel';
const DEFAULT_LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export type LockResult =
  | { success: true; lock: SeatLock }
  | { success: false; reason: 'ALREADY_BOOKED' | 'LOCKED_BY_OTHER'; lockedUntil?: number };

export class SeatLockService {
  private static broadcastChannel: BroadcastChannel | null = null;
  private static sessionId: string = '';

  public static getSessionId(): string {
    if (typeof window === 'undefined') return 'server_session';
    if (!this.sessionId) {
      let id = sessionStorage.getItem('gsrtc_tab_session_id');
      if (!id) {
        id = 'tab_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
        sessionStorage.setItem('gsrtc_tab_session_id', id);
      }
      this.sessionId = id;
    }
    return this.sessionId;
  }

  private static getChannel(): BroadcastChannel | null {
    if (typeof window === 'undefined') return null;
    if (!this.broadcastChannel && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
    return this.broadcastChannel;
  }

  private static getAllLocks(): SeatLock[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(SEAT_LOCKS_KEY);
      if (!raw) return [];
      const locks: SeatLock[] = JSON.parse(raw);
      const now = Date.now();
      // Filter out stale/expired locks
      const valid = locks.filter((l) => l.lockedUntil > now);
      if (valid.length !== locks.length) {
        localStorage.setItem(SEAT_LOCKS_KEY, JSON.stringify(valid));
      }
      return valid;
    } catch {
      return [];
    }
  }

  private static saveLocks(locks: SeatLock[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SEAT_LOCKS_KEY, JSON.stringify(locks));
    // Dispatch local custom event for same-tab reactivity
    window.dispatchEvent(new CustomEvent('gsrtc_seat_lock_change'));
    // Broadcast to other tabs/windows
    const ch = this.getChannel();
    if (ch) {
      ch.postMessage({ type: 'SEAT_LOCK_UPDATED', timestamp: Date.now() });
    }
  }

  /**
   * Checks if a seat is permanently booked in confirmed bookings
   */
  public static isSeatBooked(scheduleId: string, seatNumber: number): boolean {
    const bookings = GSRTCStorageEngine.getBookings();
    return bookings.some(
      (b) => b.scheduleId === scheduleId && b.status === 'CONFIRMED' && b.selectedSeatNumbers.includes(seatNumber)
    );
  }

  /**
   * Get all active locks for a specific bus schedule
   */
  public static getActiveLocksForSchedule(scheduleId: string): SeatLock[] {
    return this.getAllLocks().filter((l) => l.scheduleId === scheduleId);
  }

  /**
   * Attempts to atomically lock a seat for the current tab/session.
   * If held by another session, fails with LOCKED_BY_OTHER.
   */
  public static tryLockSeat(scheduleId: string, seatNumber: number, durationMs = DEFAULT_LOCK_DURATION_MS): LockResult {
    const sessionId = this.getSessionId();

    // 1. Check if seat is permanently booked
    if (this.isSeatBooked(scheduleId, seatNumber)) {
      return { success: false, reason: 'ALREADY_BOOKED' };
    }

    const locks = this.getAllLocks();
    const existingIndex = locks.findIndex(
      (l) => l.scheduleId === scheduleId && l.seatNumber === seatNumber
    );

    const now = Date.now();

    if (existingIndex !== -1) {
      const existing = locks[existingIndex];
      // If locked by someone else and not expired
      if (existing.lockedBySessionId !== sessionId && existing.lockedUntil > now) {
        return {
          success: false,
          reason: 'LOCKED_BY_OTHER',
          lockedUntil: existing.lockedUntil,
        };
      }

      // If locked by me, refresh the expiration TTL
      existing.lockedUntil = now + durationMs;
      existing.lockedAt = now;
      locks[existingIndex] = existing;
      this.saveLocks(locks);
      return { success: true, lock: existing };
    }

    // 2. Free to lock
    const newLock: SeatLock = {
      scheduleId,
      seatNumber,
      lockedBySessionId: sessionId,
      lockedAt: now,
      lockedUntil: now + durationMs,
    };

    locks.push(newLock);
    this.saveLocks(locks);
    return { success: true, lock: newLock };
  }

  /**
   * Releases a held seat lock
   */
  public static releaseSeat(scheduleId: string, seatNumber: number): void {
    const sessionId = this.getSessionId();
    const locks = this.getAllLocks().filter(
      (l) => !(l.scheduleId === scheduleId && l.seatNumber === seatNumber && l.lockedBySessionId === sessionId)
    );
    this.saveLocks(locks);
  }

  /**
   * Releases all seats held by the current session for this schedule
   */
  public static releaseAllMyLocks(scheduleId?: string): void {
    const sessionId = this.getSessionId();
    const locks = this.getAllLocks().filter((l) => {
      if (l.lockedBySessionId !== sessionId) return true;
      if (scheduleId && l.scheduleId !== scheduleId) return true;
      return false;
    });
    this.saveLocks(locks);
  }

  /**
   * Converts temporary locks to confirmed booking
   */
  public static finalizeSeatBooking(scheduleId: string, seatNumbers: number[]): void {
    const locks = this.getAllLocks().filter(
      (l) => !(l.scheduleId === scheduleId && seatNumbers.includes(l.seatNumber))
    );
    this.saveLocks(locks);
  }

  /**
   * Subscribe to real-time seat lock changes across tabs and windows
   */
  public static subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SEAT_LOCKS_KEY) {
        callback();
      }
    };

    const handleCustomEvent = () => callback();

    const ch = this.getChannel();
    const handleBroadcast = () => callback();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('gsrtc_seat_lock_change', handleCustomEvent);
    if (ch) {
      ch.addEventListener('message', handleBroadcast);
    }

    // Interval to check for expired locks every 1 second
    const intervalId = setInterval(() => {
      callback();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('gsrtc_seat_lock_change', handleCustomEvent);
      if (ch) {
        ch.removeEventListener('message', handleBroadcast);
      }
      clearInterval(intervalId);
    };
  }
}
