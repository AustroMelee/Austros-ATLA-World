import { renderHook } from '@testing-library/react-hooks';
import { useAustrosSearch } from './useAustrosSearch';

// Mock ClientSearchEngine
jest.mock('../search/ClientSearchEngine', () => ({
  search: jest.fn(),
}));
import { search as mockSearch } from '../search/ClientSearchEngine';

describe('useAustrosSearch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns results and topHit with nation', async () => {
    mockSearch.mockResolvedValueOnce([
      { nation: 'Earth Kingdom', __type: 'character', id: '1', name: 'Toph', slug: 'toph', description: '', tags: [] },
    ]);
    const { result, waitForNextUpdate } = renderHook(() => useAustrosSearch('Toph'));
    await waitForNextUpdate();
    expect(result.current.results.length).toBe(1);
    expect(result.current.topHit).toEqual({ nation: 'Earth Kingdom' });
  });

  it('returns results but no valid topHit', async () => {
    mockSearch.mockResolvedValueOnce([
      { __type: 'fauna', id: '2', name: 'Appa', slug: 'appa', description: '', tags: [] },
    ]);
    const { result, waitForNextUpdate } = renderHook(() => useAustrosSearch('Appa'));
    await waitForNextUpdate();
    expect(result.current.results.length).toBe(1);
    expect(result.current.topHit).toBeNull();
  });

  it('returns no results and topHit is null', async () => {
    mockSearch.mockResolvedValueOnce([]);
    const { result, waitForNextUpdate } = renderHook(() => useAustrosSearch('Nonexistent'));
    await waitForNextUpdate();
    expect(result.current.results.length).toBe(0);
    expect(result.current.topHit).toBeNull();
  });
});
