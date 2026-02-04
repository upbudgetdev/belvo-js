import type { ReactNode } from 'react';

// Analytics adapter for tracking widget events (PostHog, Segment, etc.)
export interface AnalyticsAdapter {
	track(event: string, properties?: Record<string, unknown>): void;
	identify?(userId: string, traits?: Record<string, unknown>): void;
}

// Standardized event names for consistent tracking
export const BelvoEvents = {
	WIDGET_OPENED: 'belvo_widget_opened',
	CONNECTION_SUCCESS: 'belvo_connection_success',
	CONNECTION_EXIT: 'belvo_connection_exit',
	WIDGET_EVENT: 'belvo_widget_event',
	SCRIPT_LOADED: 'belvo_script_loaded',
	SCRIPT_ERROR: 'belvo_script_error',
	TOKEN_FETCH_START: 'belvo_token_fetch_start',
	TOKEN_FETCH_SUCCESS: 'belvo_token_fetch_success',
	TOKEN_FETCH_ERROR: 'belvo_token_fetch_error',
} as const;

export type BelvoEventName = (typeof BelvoEvents)[keyof typeof BelvoEvents];

export interface AccessTokenResponse {
	access: string;
	refresh: string;
}

export type GetAccessTokenFn = () => Promise<AccessTokenResponse>;

export interface BelvoWidgetCallbacks {
	onSuccess?(link: string, institution: string): void;
	onExit?(data: unknown): void;
	onEvent?(data: unknown): void;
}

export interface BelvoWidgetProviderProps {
	children: ReactNode;
	getAccessToken: GetAccessTokenFn;
	analytics?: AnalyticsAdapter;
}

export interface BelvoWidgetProps extends BelvoWidgetCallbacks {
	locale?: 'pt' | 'en';
	integration_type?: 'openfinance';
	external_id?: string;
	refresh_rate?: '6h' | '12h' | '24h';
	mode?: 'webapp' | 'single';
	brand?: {
		logoUrl?: string;
		primaryColor?: string;
	};
}

// Type-safe global declaration for Belvo SDK
export interface BelvoWidgetConfig {
	locale?: string;
	mode?: string;
	integration_type?: string;
	external_id?: string;
	refresh_rate?: string;
	brand?: {
		logoUrl?: string;
		primaryColor?: string;
	};
	callback?(link: string, institution: string): void;
	onExit?(data: unknown): void;
	onEvent?(data: unknown): void;
}

export interface BelvoSDK {
	createWidget(access: string, config: BelvoWidgetConfig): { build(): void };
}

declare global {
	interface Window {
		belvoSDK?: BelvoSDK;
	}
}
