import { useCallback, useState } from 'react';
import type { GetAccessTokenFn } from '../types';

export function useBelvoAccessToken(getToken: GetAccessTokenFn) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState<unknown>(null);

  const fetchToken = useCallback(async () => {
    setStatus('loading');
    try {
      const { access } = await getToken();
      console.log('access', access);
      return access;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setStatus('idle');
    }
  }, [getToken]);

  return { fetchToken, status, error };
}
