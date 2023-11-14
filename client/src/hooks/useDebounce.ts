import { useState, useEffect } from 'react';

export function useDebounce<T>(
  initialValue: T,
  time: number,
): [T, React.Dispatch<T>] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setValue(value);
    }, time);
    return () => {
      clearTimeout(debounce);
    };
  }, [value, time]);

  return [value, setValue];
}
