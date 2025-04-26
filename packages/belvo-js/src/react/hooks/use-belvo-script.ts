import { useEffect, useState } from 'react';

export function useBelvoScript(src = 'https://cdn.belvo.io/belvo-widget-1-stable.js') {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) {
      setReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => setError(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  }, [src]);

  return { ready, error };
}
