import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import { Movie, MovieResponse, MovieDetails, Credits } from '../types/movie';

// Создаем axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  params: {
    api_key: API_CONFIG.API_KEY,
    language: API_CONFIG.LANGUAGE,
  },
});

// Interceptor для логирования запросов
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor для обработки ответов
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API методы
export const movieService = {
  // Получить популярные фильмы
  getPopularMovies: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get<MovieResponse>(ENDPOINTS.POPULAR, {
      params: { page },
    });
    return response.data;
  },

  // Получить топ фильмы
  getTopRatedMovies: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get<MovieResponse>(ENDPOINTS.TOP_RATED, {
      params: { page },
    });
    return response.data;
  },

  // Получить предстоящие фильмы
  getUpcomingMovies: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get<MovieResponse>(ENDPOINTS.UPCOMING, {
      params: { page },
    });
    return response.data;
  },

  // Получить фильмы в прокате
  getNowPlayingMovies: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get<MovieResponse>(ENDPOINTS.NOW_PLAYING, {
      params: { page },
    });
    return response.data;
  },

  // Получить детали фильма
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await apiClient.get<MovieDetails>(`${ENDPOINTS.MOVIE_DETAILS}/${movieId}`);
    return response.data;
  },

  // Получить актерский состав
  getMovieCredits: async (movieId: number): Promise<Credits> => {
    const response = await apiClient.get<Credits>(`${ENDPOINTS.MOVIE_CREDITS}/${movieId}/credits`);
    return response.data;
  },

  // Поиск фильмов
  searchMovies: async (query: string, page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get<MovieResponse>(ENDPOINTS.SEARCH, {
      params: { query, page },
    });
    return response.data;
  },
};

// Утилиты для работы с изображениями
export const imageUtils = {
  getPosterUrl: (path: string | null, size: keyof typeof API_CONFIG.IMAGE_SIZES = 'POSTER_MEDIUM'): string => {
    if (!path) return '';
    return `${API_CONFIG.IMAGE_BASE_URL}/${API_CONFIG.IMAGE_SIZES[size]}${path}`;
  },

  getBackdropUrl: (path: string | null, size: keyof typeof API_CONFIG.IMAGE_SIZES = 'BACKDROP_LARGE'): string => {
    if (!path) return '';
    return `${API_CONFIG.IMAGE_BASE_URL}/${API_CONFIG.IMAGE_SIZES[size]}${path}`;
  },

  getProfileUrl: (path: string | null): string => {
    if (!path) return '';
    return `${API_CONFIG.IMAGE_BASE_URL}/${API_CONFIG.IMAGE_SIZES.PROFILE}${path}`;
  },
};
