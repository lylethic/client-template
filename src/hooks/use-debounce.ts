"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Debounce hook — returns a debounced version of the given value.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 400);
 * useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a ref that always holds the most recent version of a callback.
 * Use `callbackRef.current()` to invoke it with the latest closure values.
 *
 * Useful for stable event listeners that need access to current state/props
 * without re-registering when dependencies change.
 *
 * @example
 * const onMessageRef = useCallbackRef(onMessage);
 * useEffect(() => {
 *   connection.on("message", onMessageRef.current);
 *   return () => connection.off("message", onMessageRef.current);
 * }, [connection, onMessageRef]);
 */
export function useCallbackRef<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
): React.RefObject<T> {
  const ref = useRef<T>(fn);

  useEffect(() => {
    ref.current = fn;
  });

  return ref;
}

export default useDebounce;
