---
name: seat-concurrency-engine
description: Workflow and reference guide for implementing, debugging, and verifying real-time multi-tab seat concurrency locks with BroadcastChannel and LocalStorage.
---

# Skill: Seat Concurrency Engine

## Objective

Guide the implementation, state synchronization, and verification of the **Real-Time Atomic Seat Concurrency Locking Engine** (`SeatLockService`) to guarantee zero double-bookings, seamless multi-tab reactivity, and automatic expiration handling without backend server dependencies.

## 1. Concurrency Protocol & Architecture

### Message Contracts (`BroadcastChannel('gsrtc_seat_channel')`)
```typescript
export type SeatLockAction = 
  | 'SEAT_LOCKED'      // User initiated hold
  | 'SEAT_RELEASED'    // User deselected or 10-min timer expired
  | 'SEAT_CONFIRMED'   // Payment succeeded, converted to booked
  | 'SYNC_REQUEST'     // New tab opened, requests current lock state
  | 'SYNC_RESPONSE';   // Existing tab responds with active locks

export interface SeatLockMessage {
  action: SeatLockAction;
  scheduleId: string;
  seatNo: number;
  sessionId: string;
  lockedUntil: number; // Date.now() + 600,000 (10 minutes)
}
```

### LocalStorage Schema (`gsrtc_seat_locks`)
Locks are persisted in `localStorage` as a JSON map keyed by `${scheduleId}_${seatNo}`:
```typescript
interface SeatLockRecord {
  scheduleId: string;
  seatNo: number;
  sessionId: string;
  lockedUntil: number;
  createdAt: number;
}
```

## 2. Core Service Methods (`SeatLockService`)

### 1. `tryLockSeat(scheduleId, seatNo, sessionId): boolean`
1. Check if the seat is already booked in confirmed bookings (`gsrtc_bookings`). If so, return `false`.
2. Check existing locks in `localStorage`:
   - If locked by another `sessionId` and `lockedUntil > Date.now()`, return `false` (locked by another user).
3. If free or previous lock has expired:
   - Write new lock record: `{ scheduleId, seatNo, sessionId, lockedUntil: Date.now() + 600000, createdAt: Date.now() }`.
   - Post `SEAT_LOCKED` message to `BroadcastChannel`.
   - Return `true`.

### 2. `releaseSeat(scheduleId, seatNo, sessionId): void`
1. Read lock from `localStorage`.
2. If `lock.sessionId === sessionId`:
   - Delete record from `localStorage`.
   - Post `SEAT_RELEASED` message to `BroadcastChannel`.

### 3. `confirmBooking(scheduleId, seatNumbers, bookingData): void`
1. Record confirmed booking in `gsrtc_bookings`.
2. Remove seat locks from `gsrtc_seat_locks`.
3. Post `SEAT_CONFIRMED` message for each seat to `BroadcastChannel`.

### 4. `cleanupExpiredLocks(): void`
- Periodically scan `gsrtc_seat_locks` and prune records where `lockedUntil <= Date.now()`.
- Post `SEAT_RELEASED` for pruned seats.

## 3. UI Integration & Multi-Tab Behavior

### Seat Visual State Resolution
For each seat rendered in `SeatPicker.tsx`:
1. **Is Booked:** Confirmed in `gsrtc_bookings` ➔ **🔴 Booked** (`bg-red-600 cursor-not-allowed`).
2. **Is Held by Current Session:** `lock.sessionId === currentSessionId` && `lock.lockedUntil > Date.now()` ➔ **🔵 Selected** (`bg-blue-600 ring-2 ring-blue-400`). Displays active countdown timer (`⏳ 09:48 remaining`).
3. **Is Held by Another Session:** `lock.sessionId !== currentSessionId` && `lock.lockedUntil > Date.now()` ➔ **🔒 Held by another user** (Amber diagonal stripes `bg-amber-100 border-amber-400 cursor-not-allowed`). Clicking triggers toast: *"This seat is currently held by another passenger."*
4. **Is Available:** None of the above ➔ **🟢 Available** (`bg-emerald-600` or `border-emerald-600 text-emerald-700`).

### React Hook Pattern (`useSeatLocks.ts`)
```typescript
export function useSeatLocks(scheduleId: string, currentSessionId: string) {
  const [locks, setLocks] = useState<Record<number, SeatLockRecord>>({});
  const [remainingTime, setRemainingTime] = useState<number>(600);

  useEffect(() => {
    const channel = new BroadcastChannel('gsrtc_seat_channel');
    
    // Initial load & purge
    SeatLockService.cleanupExpiredLocks();
    setLocks(SeatLockService.getLocksForSchedule(scheduleId));

    channel.onmessage = (event: MessageEvent<SeatLockMessage>) => {
      const msg = event.data;
      if (msg.scheduleId === scheduleId) {
        setLocks(SeatLockService.getLocksForSchedule(scheduleId));
      }
    };

    const interval = setInterval(() => {
      SeatLockService.cleanupExpiredLocks();
      setLocks(SeatLockService.getLocksForSchedule(scheduleId));
      // Update countdown for current user's held seats
    }, 1000);

    return () => {
      channel.close();
      clearInterval(interval);
    };
  }, [scheduleId, currentSessionId]);

  return { locks, remainingTime };
}
```

## 4. Verification & Testing Checklist

1. **Multi-Tab Concurrency Test:**
   - Open Tab A and Tab B side-by-side to the seat selection view.
   - Click Seat #14 in Tab A.
   - Verify Tab A displays countdown timer (`⏳ 09:59`).
   - Verify Tab B **immediately** updates Seat #14 to Amber striped + 🔒 icon and disables pointer clicks.
2. **Timer Expiry Test:**
   - Simulate timer expiration (or advance mock clock).
   - Verify Seat #14 automatically turns back to Green Available in both Tab A and Tab B.
3. **Payment Transition Test:**
   - Complete checkout in Tab A.
   - Verify Seat #14 permanently turns Red Booked in both Tab A and Tab B.
4. **Safety & Quota Interaction:**
   - Select Single Lady quota.
   - Confirm adjacent seat rule correctly blocks incompatible passenger selections.
