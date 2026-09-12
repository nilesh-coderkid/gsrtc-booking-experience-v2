import { BusTrackingLocation, BusSchedule } from '@gsrtc/types';
import { GSRTCStorageEngine } from './storageEngine';

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

    const stations = GSRTCStorageEngine.getStations();
    const startStation = stations.find((s) => s.id === lastStop.stationId) || stations[0];
    const endStation = stations.find((s) => s.id === nextStop.stationId) || stations[1];

    // Compute progress between the two stops (0 to 1)
    const progress = ((Date.now() % 15000) / 15000);
    const currentLat = Number((startStation.latitude + (endStation.latitude - startStation.latitude) * progress).toFixed(4));
    const currentLng = Number((startStation.longitude + (endStation.longitude - startStation.longitude) * progress).toFixed(4));

    const currentSpeed = 54 + (Math.floor(Date.now() / 3000) % 22); // 54 - 76 km/h

    return {
      scheduleId: schedule.id,
      busNumber: schedule.busNumber,
      currentLat,
      currentLng,
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
