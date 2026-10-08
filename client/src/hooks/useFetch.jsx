import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFunction(...args);
        setData(result);
        setLoading(false);
        return { success: true, data: result };
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    [fetchFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, refetch: execute };
};

export default useFetch;
