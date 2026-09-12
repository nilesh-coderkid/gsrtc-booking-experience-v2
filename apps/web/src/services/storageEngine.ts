import { Station, BusSchedule, SeatLock, Booking, BusPass, RecentSearch } from '@gsrtc/types';
import { GUJARAT_STATIONS, INITIAL_SCHEDULES } from './seedData';

const STORAGE_VERSION_KEY = 'gsrtc_storage_version';
const CURRENT_VERSION = 'v2.1';

const KEYS = {
  STATIONS: 'gsrtc_stations',
  SCHEDULES: 'gsrtc_schedules',
  SEAT_LOCKS: 'gsrtc_seat_locks',
  BOOKINGS: 'gsrtc_bookings',
  PASSES: 'gsrtc_bus_passes',
  WALLET_BALANCE: 'gsrtc_wallet_balance',
  RECENT_SEARCHES: 'gsrtc_recent_searches',
  LANGUAGE: 'gsrtc_lang',
  VOICE_ASSIST: 'gsrtc_voice_assist',
};

export class GSRTCStorageEngine {
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized || typeof window === 'undefined') return;

    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      // Initialize or migrate storage
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      localStorage.setItem(KEYS.STATIONS, JSON.stringify(GUJARAT_STATIONS));
      localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));

      if (!localStorage.getItem(KEYS.WALLET_BALANCE)) {
        localStorage.setItem(KEYS.WALLET_BALANCE, '1250'); // Initial simulated balance ₹1250
      }

      if (!localStorage.getItem(KEYS.SEAT_LOCKS)) {
        // Pre-populate some locks for demonstration
        const sampleLocks: SeatLock[] = [
          {
            scheduleId: 'SCH-ADI-SOU-01',
            seatNumber: 12,
            lockedBySessionId: 'demo_user_surat',
            lockedAt: Date.now(),
            lockedUntil: Date.now() + 8 * 60 * 1000,
          },
        ];
        localStorage.setItem(KEYS.SEAT_LOCKS, JSON.stringify(sampleLocks));
      }

      if (!localStorage.getItem(KEYS.BOOKINGS)) {
        // Pre-populate a demo booking so My Bookings has realistic content
        const demoBooking: Booking = {
          pnr: 'GSRTC-982341',
          scheduleId: 'SCH-ADI-SOU-01',
          busNumber: 'GJ-18-Z-9812',
          busClass: 'VOLVO_AC',
          sourceStation: GUJARAT_STATIONS[0],
          destinationStation: GUJARAT_STATIONS[8],
          journeyDate: new Date().toISOString().split('T')[0],
          departureTime: '06:00 AM',
          arrivalTime: '09:45 AM',
          boardingStop: INITIAL_SCHEDULES[0].routeStops[0],
          droppingStop: INITIAL_SCHEDULES[0].routeStops[2],
          passengers: [
            {
              seatNumber: 15,
              fullName: 'Hardik Patel',
              age: 32,
              gender: 'MALE',
              isSingleLady: false,
            },
          ],
          selectedSeatNumbers: [15],
          baseFareTotal: 420,
          tollFee: 15,
          amenitiesFee: 10,
          gstAmount: 22.25,
          totalPaid: 467.25,
          paymentMethod: 'UPI',
          paymentId: 'UPI-DEMO-991244',
          bookingTime: new Date(Date.now() - 3600000).toLocaleString(),
          status: 'CONFIRMED',
          qrCodeValue: 'GSRTC-PNR:982341|BUS:GJ18Z9812|SEAT:15|DATE:' + new Date().toISOString().split('T')[0],
        };
        localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([demoBooking]));
      }

      if (!localStorage.getItem(KEYS.RECENT_SEARCHES)) {
        const defaultRecent: RecentSearch[] = [
          {
            fromId: 'ADI-GM',
            fromName: 'Ahmedabad (Geeta Mandir Central)',
            toId: 'SOU-NV',
            toName: 'Statue of Unity (Ekta Nagar)',
            timestamp: Date.now() - 600000,
          },
          {
            fromId: 'ADI-GM',
            fromName: 'Ahmedabad (Geeta Mandir Central)',
            toId: 'ST-CT',
            toName: 'Surat (Central Bus Terminal)',
            timestamp: Date.now() - 1200000,
          },
          {
            fromId: 'ADI-GM',
            fromName: 'Ahmedabad (Geeta Mandir Central)',
            toId: 'RJT-CT',
            toName: 'Rajkot (Central ST Stand)',
            timestamp: Date.now() - 1800000,
          },
        ];
        localStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(defaultRecent));
      }
    }

    this.initialized = true;
  }

  // Generic Get/Set helpers
  public static getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public static setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom window event so same-window components react instantly
      window.dispatchEvent(new CustomEvent('gsrtc_storage_change', { detail: { key, value } }));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  public static getStations(): Station[] {
    this.initialize();
    return this.getItem<Station[]>(KEYS.STATIONS, GUJARAT_STATIONS);
  }

  public static getSchedules(): BusSchedule[] {
    this.initialize();
    return this.getItem<BusSchedule[]>(KEYS.SCHEDULES, INITIAL_SCHEDULES);
  }

  public static getScheduleById(id: string): BusSchedule | undefined {
    return this.getSchedules().find((s) => s.id === id);
  }

  public static getBookings(): Booking[] {
    this.initialize();
    return this.getItem<Booking[]>(KEYS.BOOKINGS, []);
  }

  public static getWalletBalance(): number {
    this.initialize();
    const val = localStorage.getItem(KEYS.WALLET_BALANCE);
    return val ? parseFloat(val) : 1250;
  }

  public static updateWalletBalance(delta: number): number {
    const current = this.getWalletBalance();
    const updated = Math.max(0, current + delta);
    localStorage.setItem(KEYS.WALLET_BALANCE, updated.toString());
    window.dispatchEvent(new CustomEvent('gsrtc_storage_change', { detail: { key: KEYS.WALLET_BALANCE, value: updated } }));
    return updated;
  }

  public static getRecentSearches(): RecentSearch[] {
    this.initialize();
    return this.getItem<RecentSearch[]>(KEYS.RECENT_SEARCHES, []);
  }

  public static addRecentSearch(search: Omit<RecentSearch, 'timestamp'>): void {
    const recents = this.getRecentSearches().filter(
      (r) => !(r.fromId === search.fromId && r.toId === search.toId)
    );
    const updated = [{ ...search, timestamp: Date.now() }, ...recents].slice(0, 4);
    this.setItem(KEYS.RECENT_SEARCHES, updated);
  }

  public static getPasses(): BusPass[] {
    this.initialize();
    return this.getItem<BusPass[]>(KEYS.PASSES, []);
  }

  public static savePass(busPass: BusPass): void {
    const passes = this.getPasses();
    passes.unshift(busPass);
    this.setItem(KEYS.PASSES, passes);
  }

  public static resetToFactoryDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
    this.initialized = false;
    this.initialize();
    window.location.reload();
  }
}
