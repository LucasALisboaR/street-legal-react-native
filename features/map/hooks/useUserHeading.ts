import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';

const normalizeHeading = (heading: number) => ((heading % 360) + 360) % 360;

const getShortestDelta = (from: number, to: number) => {
  const delta = ((to - from + 540) % 360) - 180;
  return delta;
};

type Options = {
  smoothingFactor?: number;
  enabled?: boolean;
};

export function useUserHeading({ smoothingFactor = 0.2, enabled = true }: Options = {}) {
  const [heading, setHeading] = useState(0);
  const lastHeading = useRef(0);

  const safeSmoothing = useMemo(() => Math.min(Math.max(smoothingFactor, 0), 1), [smoothingFactor]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let headingSubscription: Location.LocationSubscription | null = null;

    const start = async () => {
      try {
        headingSubscription = await Location.watchHeadingAsync((data) => {
          const raw = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          const normalized = normalizeHeading(raw);
          const previous = lastHeading.current;
          const delta = getShortestDelta(previous, normalized);
          const smoothed = normalizeHeading(previous + delta * safeSmoothing);

          lastHeading.current = smoothed;
          setHeading(smoothed);
        });
      } catch (error) {
        console.warn('Falha ao iniciar heading:', error);
      }
    };

    start();

    return () => {
      headingSubscription?.remove();
    };
  }, [enabled, safeSmoothing]);

  return heading;
}
