import React, { createContext, useContext, type ReactNode, useMemo, useCallback } from 'react';
import type { BelvoWidgetProps, BelvoWidgetProviderProps } from '../types';
import { useBelvoScript } from '../hooks/use-belvo-script';
import { useBelvoAccessToken } from '../hooks/use-belvo-access-token';

interface ContextProps {
  open(config?: Partial<BelvoWidgetProps>): Promise<void>;
  scriptReady: boolean;
  scriptError: Error | null;
}

const BelvoWidgetContext = createContext<ContextProps | null>(null);

export function BelvoWidgetProvider({
  getAccessToken,
  children,
}: BelvoWidgetProviderProps) {
  const { ready: scriptReady, error: scriptError } = useBelvoScript();
  const { fetchToken } = useBelvoAccessToken(getAccessToken);

  const open = useCallback(async (extra: BelvoWidgetProps = {}) => {
    if (!scriptReady) throw new Error('Belvo script not loaded');
    // @ts-ignore because belvoSDK lives on window once script ready
    const { belvoSDK } = window as any;
    const access = await fetchToken();

    const defaultConfig: BelvoWidgetProps = {
      locale: 'pt',
      mode: 'webapp',
      integration_type: 'openfinance',
    };

    return new Promise<void>((resolve) => {
      belvoSDK
        .createWidget(access, {
          ...defaultConfig,
          ...extra,
          callback(link: string, institution: string) {
            extra.onSuccess?.(link, institution);
            resolve();
          },
          onExit(data: unknown) {
            extra.onExit?.(data);
            resolve();
          },
          onEvent(data: unknown) {
            extra.onEvent?.(data);
          },
        })
        .build();
    });
  }, [scriptReady, fetchToken]);

  const value = useMemo(() => ({ open, scriptReady, scriptError }), [open, scriptReady, scriptError]);
  return <BelvoWidgetContext.Provider value={value}>{children}</BelvoWidgetContext.Provider>;
}

export function useBelvo() {
  const ctx = useContext(BelvoWidgetContext);
  if (!ctx) throw new Error('useBelvoWidget must be inside <BelvoProvider>');
  return ctx;
}
