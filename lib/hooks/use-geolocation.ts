"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback((): Promise<{ latitude: number | null; longitude: number | null }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setState((prev) => ({ ...prev, error: "Geolocation is not supported by this browser", loading: false }));
        resolve({ latitude: null, longitude: null });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setState({ latitude, longitude, error: null, loading: false });
          resolve({ latitude, longitude });
        },
        (err) => {
          setState((prev) => ({ ...prev, error: err.message, loading: false }));
          resolve({ latitude: null, longitude: null });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { ...state, requestLocation };
}
