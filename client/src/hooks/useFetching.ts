import { useState } from 'react';

type FetchingCallback<T extends any[]> = (...args: T) => Promise<void>;

export const useFetching = <T extends any[]>(
  callback: FetchingCallback<T>,
): [(...args: T) => Promise<void>, boolean, string] => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetching = async (...args: T): Promise<void> => {
    setError('');
    try {
      setIsLoading(true);
      await callback(...args);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return [fetching, isLoading, error];
};
