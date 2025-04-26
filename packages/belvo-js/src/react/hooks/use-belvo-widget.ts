import { useCallback } from 'react';
import { useBelvo } from '../context/belvo-provider';
import type { BelvoWidgetProps } from '../types';

export function useBelvoWidget(defaultConfig?: Partial<BelvoWidgetProps>) {
  const { open, scriptReady, scriptError } = useBelvo();

  const connect = useCallback(
    (cfg?: Partial<BelvoWidgetProps>) => open({ ...defaultConfig, ...cfg }),
    [open, defaultConfig],
  );

  return { connect, scriptReady, scriptError };
}
