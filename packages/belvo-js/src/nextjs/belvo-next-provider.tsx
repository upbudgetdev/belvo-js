'use client';

import Script from 'next/script';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  AnalyticsAdapter,
  BelvoWidgetProps,
  BelvoWidgetProviderProps,
} from '../react/types';
import { BelvoEvents } from '../react/types';
import { useBelvoAccessToken } from '../react/hooks/use-belvo-access-token';

const BELVO_SCRIPT_SRC = 'https://cdn.belvo.io/belvo-widget-1-stable.js';

interface ContextProps {
  open(config?: Partial<BelvoWidgetProps>): Promise<void>;
  scriptReady: boolean;
  scriptError: Error | null;
  analytics?: AnalyticsAdapter;
}

const BelvoNextContext = createContext<ContextProps | null>(null);

export function BelvoNextProvider({
  getAccessToken,
  analytics,
  children,
}: BelvoWidgetProviderProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState<Error | null>(null);
  const { fetchToken } = useBelvoAccessToken(getAccessToken, analytics);

  const handleScriptLoad = useCallback(() => {
    analytics?.track(BelvoEvents.SCRIPT_LOADED);
    setScriptReady(true);
  }, [analytics]);

  const handleScriptError = useCallback(() => {
    const err = new Error(`Failed to load ${BELVO_SCRIPT_SRC}`);
    analytics?.track(BelvoEvents.SCRIPT_ERROR, { error: err.message });
    setScriptError(err);
  }, [analytics]);

  const open = useCallback(
    async (extra: BelvoWidgetProps = {}) => {
      if (!scriptReady) throw new Error('Belvo script not loaded');
      if (!window.belvoSDK) throw new Error('Belvo SDK not available');

      const access = await fetchToken();
      if (!access) throw new Error('Failed to fetch access token');

      analytics?.track(BelvoEvents.WIDGET_OPENED, {
        external_id: extra.external_id,
      });

      const defaultConfig: BelvoWidgetProps = {
        locale: 'pt',
        mode: 'webapp',
        integration_type: 'openfinance',
      };

      return new Promise<void>((resolve) => {
        window.belvoSDK!
          .createWidget(access, {
            ...defaultConfig,
            ...extra,
            callback(link: string, institution: string) {
              analytics?.track(BelvoEvents.CONNECTION_SUCCESS, {
                link,
                institution,
              });
              extra.onSuccess?.(link, institution);
              resolve();
            },
            onExit(data: unknown) {
              analytics?.track(
                BelvoEvents.CONNECTION_EXIT,
                data as Record<string, unknown>
              );
              extra.onExit?.(data);
              resolve();
            },
            onEvent(data: unknown) {
              analytics?.track(
                BelvoEvents.WIDGET_EVENT,
                data as Record<string, unknown>
              );
              extra.onEvent?.(data);
            },
          })
          .build();
      });
    },
    [scriptReady, fetchToken, analytics]
  );

  const value = useMemo(
    () => ({ open, scriptReady, scriptError, analytics }),
    [open, scriptReady, scriptError, analytics]
  );

  return (
    <BelvoNextContext.Provider value={value}>
      <Script
        src={BELVO_SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      {children}
    </BelvoNextContext.Provider>
  );
}

export function useBelvoNext() {
  const ctx = useContext(BelvoNextContext);
  if (!ctx)
    throw new Error('useBelvoNext must be inside <BelvoNextProvider>');
  return ctx;
}
