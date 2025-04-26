'use client';

import Script from 'next/script';
import React from 'react';
import type { BelvoWidgetProviderProps } from '../react';
import { BelvoWidgetProvider as Core } from '../react';

export function BelvoNextProvider(props: BelvoWidgetProviderProps) {
  return (
    <>
      <Script
        src="https://cdn.belvo.io/belvo-widget-1-stable.js"
      />
      <Core {...props} />
    </>
  );
}
