
import { useEffect, useRef } from 'react';

// Using a specific callback type is safer and clearer than a generic T extends Function.
// The hook is only used with a function that takes no arguments and returns void.
type Callback = () => void;

export function useInterval(callback: Callback, delay: number | null) {
  const savedCallback = useRef<Callback>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // The ref's current property might be undefined on the first render,
      // so we need to check if it exists before calling it.
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
