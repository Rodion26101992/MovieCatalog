import axios from 'axios';
import Config from 'react-native-config';

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
    Authorization: `Bearer ${Config.TMDB_API_KEY}`,
  },
});

api.interceptors.request.use(
  config => {
    config.params = {
      ...config.params,
      api_key: Config.TMDB_API_KEY,
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// ВАЖНО: Не изменяйте response, чтобы видеть статусы
api.interceptors.response.use(
  response => {
    console.log('🔍 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response; // Возвращаем полный response, не только data
  },
  error => {
    console.error('🔍 API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

// Получить трейлеры фильма
export const getMovieVideos = async (movieId: number, language: string = 'ru-RU') => {
  try {
    const response = await api.get(`/movie/${movieId}/videos?language=${language}`);
    console.log('✅ Movie videos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};

// Функция авторизации (исправлена)
export const Authorization = async () => {
  try {
    const response = await api.get('/authentication');
    console.log('✅ Authorization success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Authorization error:', error);
    throw error;
  }
};

// Получить детали фильма (включая описание)
export const getMovieDetails = async (movieId: number, language: string = 'ru-RU') => {
  try {
    const response = await api.get(`/movie/${movieId}?language=${language}`);
    console.log('✅ Movie details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Получить популярные фильмы
export const getPopularMovies = async (page: number = 1, language: string = 'en-US') => {
  try {
    const response = await api.get(`/movie/popular?page=${page}&language=${language}`);
    console.log('✅ Popular movies:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

// Получить ожидаемые фильмы
export const getUpcomingMovies = async (page: number = 1, language: string = 'en-US') => {
  try {
    const response = await api.get(`/movie/upcoming?page=${page}&language=${language}`);
    console.log('✅ Upcoming movies:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

// Получить топ рейтинговые фильмы
export const getTopRatedMovies = async (page: number = 1, language: string = 'en-US') => {
  try {
    const response = await api.get(`/movie/top_rated?page=${page}&language=${language}`);
    console.log('✅ Top rated movies:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getNowPlayingMovies = async (page: number = 1) => {
  try {
    const response = await api.get('/movie/now_playing', {
      params: { page },
    });
    return response;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};
export const searchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Получить актерский состав
export const getMovieCredits = async (movieId: number, language: string = 'ru-RU') => {
  try {
    const response = await api.get(`/movie/${movieId}/credits?language=${language}`);
    console.log('✅ Movie credits:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

// Получить похожие фильмы
export const getSimilarMovies = async (movieId: number, language: string = 'ru-RU') => {
  try {
    const response = await api.get(`/movie/${movieId}/similar?language=${language}`);
    console.log('✅ Similar movies:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
};
