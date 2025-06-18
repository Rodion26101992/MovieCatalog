import { useState, useEffect, useCallback } from 'react';
import { movieService } from '../services/movieService';
import { Movie, MovieResponse } from '../types/movie';

export type MovieCategory = 'popular' | 'top_rated' | 'upcoming' | 'now_playing';

export const useMovies = (category: MovieCategory) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      let response: MovieResponse;
      
      switch (category) {
        case 'popular':
          response = await movieService.getPopularMovies(pageNum);
          break;
        case 'top_rated':
          response = await movieService.getTopRatedMovies(pageNum);
          break;
        case 'upcoming':
          response = await movieService.getUpcomingMovies(pageNum);
          break;
        case 'now_playing':
          response = await movieService.getNowPlayingMovies(pageNum);
          break;
        default:
          throw new Error('Invalid category');
      }

      if (pageNum === 1 || isRefresh) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }

      setHasMore(pageNum < response.total_pages);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMovies(page + 1);
    }
  }, [fetchMovies, loading, hasMore, page]);

  const refresh = useCallback(() => {
    fetchMovies(1, true);
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    refreshing,
    hasMore,
    loadMore,
    refresh,
    retry: () => fetchMovies(1),
  };
};
