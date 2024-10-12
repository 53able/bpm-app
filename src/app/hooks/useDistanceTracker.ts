// hooks/useDistanceTracker.ts
import { useState, useRef } from "react";

export function useDistanceTracker() {
  const [distance, setDistance] = useState(0);
  const [positions, setPositions] = useState<[number, number][]>([]);
  const [error, setError] = useState("");
  const watchId = useRef<number | null>(null);
  const prevPosition = useRef<GeolocationPosition | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("このブラウザでは位置情報がサポートされていません。");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handleError,
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    prevPosition.current = null;
  };

  const handlePositionUpdate = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setPositions((prevPositions) => [...prevPositions, [latitude, longitude]]);

    if (prevPosition.current) {
      const dist = calculateDistance(
        prevPosition.current.coords.latitude,
        prevPosition.current.coords.longitude,
        latitude,
        longitude
      );
      setDistance((prevDistance) => prevDistance + dist);
    }
    prevPosition.current = position;
  };

  const handleError = (error: GeolocationPositionError) => {
    setError(error.message);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // 地球の半径（メートル）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // 距離（メートル）
    return d;
  };

  return {
    distance,
    positions,
    error,
    startTracking,
    stopTracking,
  };
}
