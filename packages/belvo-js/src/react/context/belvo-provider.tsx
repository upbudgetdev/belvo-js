import React, {
  createContext,
  useContext,
  type ReactNode,
  useMemo,
  useCallback,
} from 'react';
import type {
  AnalyticsAdapter,
  BelvoWidgetProps,
  BelvoWidgetProviderProps,
} from '../types';
import { BelvoEvents } from '../types';
import { useBelvoScript } from '../hooks/use-belvo-script';
import { useBelvoAccessToken } from '../hooks/use-belvo-access-token';

interface ContextProps {
  open(config?: Partial<BelvoWidgetProps>): Promise<void>;
  scriptReady: boolean;
  scriptError: Error | null;
  analytics?: AnalyticsAdapter;
}

const BelvoWidgetContext = createContext<ContextProps | null>(null);

export function BelvoWidgetProvider({
  getAccessToken,
  analytics,
  children,
}: BelvoWidgetProviderProps) {
  const { ready: scriptReady, error: scriptError } = useBelvoScript(
    undefined,
    analytics
  );
  const { fetchToken } = useBelvoAccessToken(getAccessToken, analytics);

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
    <BelvoWidgetContext.Provider value={value}>
      {children}
    </BelvoWidgetContext.Provider>
  );
}

export function useBelvo() {
  const ctx = useContext(BelvoWidgetContext);
  if (!ctx) throw new Error('useBelvoWidget must be inside <BelvoProvider>');
  return ctx;
}
