# @upbudget/belvo-js

React and Next.js SDK for [Belvo's Open Finance](https://belvo.com/) widget integration.

## Installation

```bash
pnpm add @upbudget/belvo-js swr
```

```bash
npm install @upbudget/belvo-js swr
```

```bash
yarn add @upbudget/belvo-js swr
```

## Quick Start

### Next.js (Recommended)

```tsx
// app/providers.tsx
'use client';

import { BelvoNextProvider } from '@upbudget/belvo-js/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BelvoNextProvider
      getAccessToken={async () => {
        const res = await fetch('/api/belvo/access-token');
        return res.json();
      }}
    >
      {children}
    </BelvoNextProvider>
  );
}
```

```tsx
// app/connect/page.tsx
'use client';

import { useBelvoNextWidget } from '@upbudget/belvo-js/nextjs';

export default function ConnectPage() {
  const { connect, scriptReady } = useBelvoNextWidget({
    external_id: 'user-123',
    onSuccess: (link, institution) => {
      console.log('Connected:', link, institution);
    },
  });

  return (
    <button onClick={() => connect()} disabled={!scriptReady}>
      Connect Bank Account
    </button>
  );
}
```

### React

```tsx
// App.tsx
import { BelvoWidgetProvider } from '@upbudget/belvo-js/react';

function App() {
  return (
    <BelvoWidgetProvider
      getAccessToken={async () => {
        const res = await fetch('/api/belvo/access-token');
        return res.json();
      }}
    >
      <ConnectButton />
    </BelvoWidgetProvider>
  );
}
```

```tsx
// ConnectButton.tsx
import { useBelvoWidget } from '@upbudget/belvo-js/react';

function ConnectButton() {
  const { connect, scriptReady } = useBelvoWidget({
    external_id: 'user-123',
    onSuccess: (link, institution) => {
      console.log('Connected:', link, institution);
    },
  });

  return (
    <button onClick={() => connect()} disabled={!scriptReady}>
      Connect Bank Account
    </button>
  );
}
```

## Analytics Integration

Track widget events with any analytics provider (PostHog, Segment, Amplitude, etc.):

```tsx
import posthog from 'posthog-js';
import { BelvoNextProvider, BelvoEvents } from '@upbudget/belvo-js/nextjs';

<BelvoNextProvider
  getAccessToken={getAccessToken}
  analytics={{
    track: (event, properties) => posthog.capture(event, properties),
  }}
>
  {children}
</BelvoNextProvider>
```

### Available Events

| Event | Description |
|-------|-------------|
| `belvo_widget_opened` | Widget was opened |
| `belvo_connection_success` | User successfully connected an account |
| `belvo_connection_exit` | User closed the widget |
| `belvo_widget_event` | Generic widget event |
| `belvo_script_loaded` | Belvo SDK script loaded |
| `belvo_script_error` | Failed to load Belvo SDK script |
| `belvo_token_fetch_start` | Started fetching access token |
| `belvo_token_fetch_success` | Access token fetched successfully |
| `belvo_token_fetch_error` | Failed to fetch access token |

## Pre-built Button Component

Use the included button component with custom styling via `asChild`:

```tsx
import { BelvoConnectButton } from '@upbudget/belvo-js/nextjs';

// Default button
<BelvoConnectButton
  config={{
    external_id: 'user-123',
    onSuccess: (link, institution) => console.log(link, institution),
  }}
/>

// Custom button with asChild
<BelvoConnectButton
  asChild
  config={{ external_id: 'user-123' }}
>
  <MyCustomButton>Link your bank</MyCustomButton>
</BelvoConnectButton>
```

## API Reference

### Provider Props

```typescript
interface BelvoWidgetProviderProps {
  children: ReactNode;
  getAccessToken: () => Promise<{ access: string; refresh: string }>;
  analytics?: {
    track(event: string, properties?: Record<string, unknown>): void;
  };
}
```

### Widget Configuration

```typescript
interface BelvoWidgetProps {
  locale?: 'pt' | 'en';
  integration_type?: 'openfinance';
  external_id?: string;
  refresh_rate?: '6h' | '12h' | '24h';
  mode?: 'webapp' | 'single';
  brand?: {
    logoUrl?: string;
    primaryColor?: string;
  };
  onSuccess?: (link: string, institution: string) => void;
  onExit?: (data: unknown) => void;
  onEvent?: (data: unknown) => void;
}
```

### Hooks

#### Next.js

```typescript
import { useBelvoNext, useBelvoNextWidget } from '@upbudget/belvo-js/nextjs';

// Low-level access
const { open, scriptReady, scriptError } = useBelvoNext();

// With default config
const { connect, scriptReady, scriptError } = useBelvoNextWidget(config);
```

#### React

```typescript
import { useBelvo, useBelvoWidget } from '@upbudget/belvo-js/react';

// Low-level access
const { open, scriptReady, scriptError } = useBelvo();

// With default config
const { connect, scriptReady, scriptError } = useBelvoWidget(config);
```

## Backend Setup

Your backend needs to provide an endpoint that returns Belvo access tokens:

```typescript
// app/api/belvo/access-token/route.ts (Next.js App Router)
import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://api.belvo.com/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: process.env.BELVO_SECRET_ID,
      password: process.env.BELVO_SECRET_PASSWORD,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

## Requirements

- React 18.3.1+
- Next.js 13.5.7+ (for Next.js integration)
- SWR 2.2.0+

## License

MIT
