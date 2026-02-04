import { useEffect, useState } from 'react';
import type { AnalyticsAdapter } from '../types';
import { BelvoEvents } from '../types';

const BELVO_SCRIPT_SRC = 'https://cdn.belvo.io/belvo-widget-1-stable.js';

export function useBelvoScript(
  src = BELVO_SCRIPT_SRC,
  analytics?: AnalyticsAdapter
) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );

    if (existingScript) {
      // Script element exists - check if it's already loaded
      if (window.belvoSDK) {
        setReady(true);
        return undefined;
      }

      // Script exists but still loading - attach listeners
      const handleLoad = () => {
        analytics?.track(BelvoEvents.SCRIPT_LOADED);
        setReady(true);
      };
      const handleError = () => {
        const err = new Error(`Failed to load ${src}`);
        analytics?.track(BelvoEvents.SCRIPT_ERROR, { error: err.message });
        setError(err);
      };

      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);

      return () => {
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
    }

    // Create new script element
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      analytics?.track(BelvoEvents.SCRIPT_LOADED);
      setReady(true);
    };

    script.onerror = () => {
      const err = new Error(`Failed to load ${src}`);
      analytics?.track(BelvoEvents.SCRIPT_ERROR, { error: err.message });
      setError(err);
    };

    document.body.appendChild(script);
    return undefined;
  }, [src, analytics]);

  return { ready, error };
}
