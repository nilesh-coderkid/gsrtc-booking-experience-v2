// Core Quota Types supported by GSRTC
export type QuotaType =
  | 'GENERAL'
  | 'SINGLE_LADY'
  | 'DIVYANG'
  | 'MP_MLA'
  | 'AWT'
  | 'ELECTRIC_BUS'
  | 'STATUE_OF_UNITY';

// Bus Class Categories
export type BusClass =
  | 'GURJARNAGARI'
  | 'EXPRESS'
  | 'SLEEPER_NON_AC'
  | 'VOLVO_AC'
  | 'ELECTRIC_EXPRESS';

export interface Station {
  id: string;
  nameEn: string;
  nameGu: string;
  code: string;
  division: string;
  isPopular?: boolean;
  latitude: number;
  longitude: number;
}

export interface RouteStop {
  stationId: string;
  stationNameEn: string;
  stationNameGu: string;
  scheduledTime: string;
  departureTime: string;
  isBoardingPoint: boolean;
  isDroppingPoint: boolean;
  platform?: string;
  distanceFromOriginKm: number;
}

export interface MealStop {
  id: string;
  locationName: string;
  highwayName: string;
  durationMinutes: number;
  expectedArrivalTime: string;
  type: 'LUNCH' | 'DINNER' | 'TEA_BREAK';
}

export type SeatDeck = 'LOWER' | 'UPPER';
export type SeatType = 'SEATER' | 'SLEEPER_LOWER' | 'SLEEPER_UPPER';
export type SeatStatus = 'AVAILABLE' | 'SELECTED_BY_ME' | 'LOCKED_BY_OTHER' | 'BOOKED';

export interface Seat {
  seatNumber: number;
  seatLabel: string;
  deck: SeatDeck;
  row: number;
  col: number;
  seatType: SeatType;
  quota: 'GENERAL' | 'LADIES' | 'DIVYANG';
  isWindow: boolean;
  basePrice: number;
}

export interface SeatLock {
  scheduleId: string;
  seatNumber: number;
  lockedBySessionId: string;
  lockedAt: number;
  lockedUntil: number; // timestamp in ms (e.g. 10 minutes)
}

export interface BusSchedule {
  id: string;
  busNumber: string; // e.g. "GJ-18-Z-9812"
  busClass: BusClass;
  busNameEn: string;
  busNameGu: string;
  sourceStationId: string;
  destinationStationId: string;
  departureTime: string; // "06:30 AM"
  arrivalTime: string;   // "11:00 AM"
  durationFormatted: string; // "4h 30m"
  distanceKm: number;
  baseFare: number;
  amenities: {
    hasAc: boolean;
    hasCharging: boolean;
    hasGps: boolean;
    hasWater: boolean;
    hasWifi: boolean;
    hasBlanket?: boolean;
  };
  mealStop?: MealStop;
  routeStops: RouteStop[];
  totalSeats: number;
  seats: Seat[];
  isElectric: boolean;
  isDirectExpress: boolean;
  rating: number;
}

export interface Passenger {
  seatNumber: number;
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  isSingleLady: boolean;
  concessionType?: 'NONE' | 'DIVYANG' | 'SENIOR_CITIZEN' | 'AWT_TEACHER';
  concessionId?: string;
}

export interface Booking {
  pnr: string;
  scheduleId: string;
  busNumber: string;
  busClass: BusClass;
  sourceStation: Station;
  destinationStation: Station;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
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
  paymentId: string;
  bookingTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
  qrCodeValue: string;
  refundAmount?: number;
  cancellationTime?: string;
}

export interface BusPass {
  passNumber: string;
  passType: 'COMMUTER_MONTHLY' | 'STUDENT_SEMESTER' | 'SENIOR_CITIZEN';
  applicantName: string;
  applicantPhotoUrl?: string;
  sourceStation: string;
  destinationStation: string;
  routeVia: string;
  validFrom: string;
  validTo: string;
  concessionPercentage: number;
  totalCost: number;
  status: 'ACTIVE' | 'EXPIRED';
}

export interface BusTrackingLocation {
  scheduleId: string;
  busNumber: string;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  lastPassedStop: string;
  nextUpcomingStop: string;
  estimatedArrivalNextStop: string;
  statusText: string;
  batteryPercentage?: number; // for Electric bus
  updatedAt: string;
}

export interface RecentSearch {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  timestamp: number;
}
