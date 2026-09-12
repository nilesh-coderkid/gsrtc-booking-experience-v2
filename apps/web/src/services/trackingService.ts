import { BusTrackingLocation, BusSchedule } from '@gsrtc/types';

export class TrackingService {
  public static getLiveLocation(schedule: BusSchedule): BusTrackingLocation {
    const stops = schedule.routeStops;
    const isElectric = schedule.isElectric;

    // Simulate current stop progression based on current seconds
    const cycle = (Math.floor(Date.now() / 15000)) % Math.max(1, stops.length);
    const lastStopIndex = Math.min(cycle, stops.length - 2);
    const nextStopIndex = lastStopIndex + 1;

    const lastStop = stops[lastStopIndex] || stops[0];
    const nextStop = stops[nextStopIndex] || stops[stops.length - 1];

    const currentSpeed = 54 + (Math.floor(Date.now() / 3000) % 22); // 54 - 76 km/h

    return {
      scheduleId: schedule.id,
      busNumber: schedule.busNumber,
      currentLat: 22.5 + (Math.sin(Date.now() / 50000) * 0.4),
      currentLng: 72.8 + (Math.cos(Date.now() / 50000) * 0.4),
      speedKmh: currentSpeed,
      lastPassedStop: lastStop.stationNameEn,
      nextUpcomingStop: nextStop.stationNameEn,
      estimatedArrivalNextStop: nextStop.scheduledTime,
      statusText: currentSpeed > 0 ? `On Time • Cruising at ${currentSpeed} km/h on Highway` : 'Station Stop',
      batteryPercentage: isElectric ? 78 - ((Math.floor(Date.now() / 60000)) % 15) : undefined,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  }
}
