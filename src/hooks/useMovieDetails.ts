import { useState, useEffect } from 'react';
import { movieService } from '../services/movieService';
import { MovieDetails, Credits } from '../types/movie';

export const useMovieDetails = (movieId: number) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [movieData, creditsData] = await Promise.all([
          movieService.getMovieDetails(movieId),
          movieService.getMovieCredits(movieId),
        ]);
        
        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  return {
    movie,
    credits,
    loading,
    error,
    retry: () => {
      setLoading(true);
      setError(null);
    },
  };
};
