import { useRef } from 'react';

function useSingleton(callback) {
  const called = useRef(false);
  if (called.current) {
    return null;
  }

  called.current = true;
  return callback();
}

export { useSingleton };
