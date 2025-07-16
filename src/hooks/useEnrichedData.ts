import { useState, useEffect } from 'react';
import type { EnrichedEntity } from '../search/types';

export interface UseEnrichedDataResult {
  data: EnrichedEntity[];
  loading: boolean;
  error: string | null;
}

export function useEnrichedData(): UseEnrichedDataResult {
  const [data, setData] = useState<EnrichedEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/enriched-data.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const json: EnrichedEntity[] = await response.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching enriched data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}

export default useEnrichedData; 