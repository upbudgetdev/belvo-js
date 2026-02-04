import useSWRMutation from 'swr/mutation';
import type { AnalyticsAdapter, GetAccessTokenFn } from '../types';
import { BelvoEvents } from '../types';

export type TokenStatus = 'idle' | 'loading' | 'success' | 'error';

export function useBelvoAccessToken(
  getToken: GetAccessTokenFn,
  analytics?: AnalyticsAdapter
) {
  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    'belvo-access-token',
    async () => {
      analytics?.track(BelvoEvents.TOKEN_FETCH_START);
      const { access } = await getToken();
      analytics?.track(BelvoEvents.TOKEN_FETCH_SUCCESS);
      return access;
    },
    {
      throwOnError: false,
      onError: (err) => {
        analytics?.track(BelvoEvents.TOKEN_FETCH_ERROR, { error: String(err) });
      },
    }
  );

  const status: TokenStatus = isMutating
    ? 'loading'
    : error
      ? 'error'
      : data
        ? 'success'
        : 'idle';

  return {
    fetchToken: trigger,
    token: data,
    status,
    error,
    reset,
  };
}
