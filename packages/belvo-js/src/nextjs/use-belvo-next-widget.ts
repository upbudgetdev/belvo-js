import { useCallback } from 'react';
import { useBelvoNext } from './belvo-next-provider';
import type { BelvoWidgetProps } from '../react/types';

export function useBelvoNextWidget(defaultConfig?: Partial<BelvoWidgetProps>) {
  const { open, scriptReady, scriptError } = useBelvoNext();

  const connect = useCallback(
    (cfg?: Partial<BelvoWidgetProps>) => open({ ...defaultConfig, ...cfg }),
    [open, defaultConfig]
  );

  return { connect, scriptReady, scriptError };
}
