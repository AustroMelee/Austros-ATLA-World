import { renderHook, waitFor } from '@testing-library/react';
import { useAustrosSearch } from './useAustrosSearch';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import { EnrichedCharacter } from '../types/domainTypes';

jest.mock('../search/ClientSearchEngine', () => ({
  init: jest.fn().mockResolvedValue(undefined),
  search: jest.fn(),
}));

const mockedSearchEngine = jest.mocked(ClientSearchEngine);

const mockResults: EnrichedCharacter[] = [
  { id: 'aang', name: 'Aang', __type: 'character', slug: 'aang', description: 'The last Airbender.' },
];

describe('useAustrosSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return search results successfully after loading', async () => {
    mockedSearchEngine.search.mockResolvedValue(mockResults);
    const { result } = renderHook(() => useAustrosSearch('aang'));
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.results).toEqual(mockResults);
      expect(result.current.results.length).toBe(1);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle errors from the search engine', async () => {
    const mockError = new Error('Search failed!');
    mockedSearchEngine.search.mockRejectedValue(mockError);
    const { result } = renderHook(() => useAustrosSearch('error-query'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Search failed to load.');
      expect(result.current.results).toEqual([]);
    });
  });
});
