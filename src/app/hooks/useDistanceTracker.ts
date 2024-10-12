// hooks/useDistanceTracker.ts
import { useState, useRef, useEffect, useCallback } from "react";

export function useDistanceTracker(isTracking: boolean) {
  const [distance, setDistance] = useState(0);
  const [positions, setPositions] = useState<[number, number][]>([]);
  const [error, setError] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0); // 経過時間（秒）

  const watchId = useRef<number | null>(null);
  const prevPosition = useRef<GeolocationPosition | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerId = useRef<number | null>(null);

  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
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
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setError(error.message);
  }, []);
  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (timerId.current !== null) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    prevPosition.current = null;
    startTimeRef.current = null;
    // 距離や経過時間をリセットする場合は以下を有効にしてください
    // setDistance(0);
    // setPositions([]);
    // setElapsedTime(0);
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("このブラウザでは位置情報がサポートされていません。");
      return;
    }

    startTimeRef.current = Date.now();
    setElapsedTime(0); // 経過時間をリセット

    timerId.current = window.setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000); // 秒単位
      }
    }, 1000);

    watchId.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handleError,
      { enableHighAccuracy: true }
    );
  }, [handlePositionUpdate, handleError]);

  useEffect(() => {
    if (isTracking) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isTracking, startTracking, stopTracking]);



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
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // 距離（メートル）
    return d;
  };

  return {
    distance,
    positions,
    error,
    elapsedTime,
  };
}
