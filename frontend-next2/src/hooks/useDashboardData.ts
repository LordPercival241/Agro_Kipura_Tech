"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = "http://localhost:8000/api/v1/dashboard";

export interface RawData {
  temperature_c: number;
  humidity_air_pct: number;
  soil_m_analog: number;
  light_analog: number;
  pressure_pa: number;
}

export interface Features {
  vpd_kpa: number;
  dew_point_c: number;
}

export interface MLResult {
  status: string;
  alert: string;
  color: string;
}

export interface LatestData {
  raw: RawData;
  features: Features;
  ml: MLResult;
}

export interface HistoryEntry {
  timestamp: string;
  raw: RawData;
  features: Features;
}

export interface DashboardState {
  latest: LatestData | null;
  history: HistoryEntry[];
  connectionStatus: "connecting" | "connected" | "disconnected";
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    latest: null,
    history: [],
    connectionStatus: "connecting",
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.ready) {
        setState({
          latest: data.latest,
          history: data.history || [],
          connectionStatus: "connected",
        });
      } else {
        setState((prev) => ({
          ...prev,
          connectionStatus: "connected",
          latest: prev.latest,
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        connectionStatus: "disconnected",
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return state;
}
