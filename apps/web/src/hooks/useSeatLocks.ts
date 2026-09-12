import { useState, useEffect } from 'react';
import { SeatLock } from '@gsrtc/types';
import { SeatLockService } from '../services/seatLockService';

export function useSeatLocks(scheduleId: string | undefined) {
  const [locks, setLocks] = useState<SeatLock[]>([]);
  const mySessionId = SeatLockService.getSessionId();

  useEffect(() => {
    if (!scheduleId) {
      setLocks([]);
      return;
    }

    const refresh = () => {
      setLocks(SeatLockService.getActiveLocksForSchedule(scheduleId));
    };

    refresh();
    const unsubscribe = SeatLockService.subscribe(refresh);

    return () => {
      unsubscribe();
    };
  }, [scheduleId]);

  const isLockedByMe = (seatNumber: number): boolean => {
    return locks.some(
      (l) => l.seatNumber === seatNumber && l.lockedBySessionId === mySessionId && l.lockedUntil > Date.now()
    );
  };

  const isLockedByOther = (seatNumber: number): { locked: boolean; lockedUntil?: number } => {
    const lock = locks.find(
      (l) => l.seatNumber === seatNumber && l.lockedBySessionId !== mySessionId && l.lockedUntil > Date.now()
    );
    return lock ? { locked: true, lockedUntil: lock.lockedUntil } : { locked: false };
  };

  const getMyHeldSeatNumbers = (): number[] => {
    const now = Date.now();
    return locks
      .filter((l) => l.lockedBySessionId === mySessionId && l.lockedUntil > now)
      .map((l) => l.seatNumber);
  };

  // Find minimum remaining time among all my locked seats for this schedule
  const getMyEarliestExpiration = (): number | null => {
    const now = Date.now();
    const myLocks = locks.filter((l) => l.lockedBySessionId === mySessionId && l.lockedUntil > now);
    if (myLocks.length === 0) return null;
    return Math.min(...myLocks.map((l) => l.lockedUntil));
  };

  return {
    locks,
    mySessionId,
    isLockedByMe,
    isLockedByOther,
    getMyHeldSeatNumbers,
    getMyEarliestExpiration,
  };
}
