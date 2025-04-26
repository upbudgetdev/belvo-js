import React, { cloneElement, forwardRef } from 'react';
import { useBelvoWidget } from '../hooks/use-belvo-widget';
import type { BelvoWidgetProps } from '../types';

export interface BelvoConnectButtonProps {
  asChild?: boolean;
  children?: React.ReactElement;
  config?: Partial<BelvoWidgetProps>;
}

export const BelvoConnectButton = forwardRef<HTMLButtonElement, BelvoConnectButtonProps>(({ asChild, children, config }, ref) => {
  const { connect, scriptReady } = useBelvoWidget(config);

  const common = {
    ref,
    disabled: !scriptReady,
    onClick: () => connect(),
  }

  if (asChild && children && typeof children.props === 'object') {
    return cloneElement(children, { ...common, ...children.props });
  }

  return (
    <button
      type="button"
      {...common}
      className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
    >
      Conectar Conta Bancária
    </button>
  );
});

BelvoConnectButton.displayName = 'BelvoConnectButton';
