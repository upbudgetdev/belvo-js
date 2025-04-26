import type { ReactNode } from 'react';

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
}

export interface BelvoWidgetProps extends BelvoWidgetCallbacks {
	locale?: 'pt' | 'en';
	integration_type?: 'openfinance'
	external_id?: string;
	refresh_rate?: '6h' | '12h' | '24h';
	mode?: 'webapp' | 'single';
	brand?: {
		logoUrl?: string;
		primaryColor?: string;
	};
}
