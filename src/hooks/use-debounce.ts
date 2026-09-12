"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a stable ref that holds the latest version of a callback
 * without causing re-renders or stale closure issues.
 *
 * Useful for event handlers in useEffect that need access to current props/state.
 *
 * @example
 * const onMessage = useLatestCallback((msg: string) => {
 *   setMessages(prev => [...prev, msg]);
 * });
 */
export function useLatestCallback<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const ref = useRef<T>(fn);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useRef<T>(
    ((...args) => ref.current(...args)) as T,
  ).current;
}

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
  const [debouncedValue, setDebouncedValue] = useRef(value).current
    ? [value, () => {}]
    : [value, () => {}];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, setDebouncedValue]);

  return debouncedValue;
}

export { useDebounce as default };
