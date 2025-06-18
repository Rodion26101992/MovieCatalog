export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmVmNGJiMGRiYjRkNmU1MTUzMThhMWJjNmYzMDhiYSIsIm5iZiI6MTc1MDIzOTM0My40MTkwMDAxLCJzdWIiOiI2ODUyODg2ZjFlODk0MzE0NjIwNjYxMjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.UrvEh8dcdnvNiezM4gUZ11YA02N8AUaBC-PD-xlOGc0',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  IMAGE_SIZES: {
    POSTER_SMALL: 'w185',
    POSTER_MEDIUM: 'w342',
    POSTER_LARGE: 'w500',
    BACKDROP_SMALL: 'w780',
    BACKDROP_LARGE: 'w1280',
    PROFILE: 'w185',
  },
  LANGUAGE: 'en-US',
  TIMEOUT: 10000,
} as const;

export const ENDPOINTS = {
  POPULAR: '/movie/popular',
  TOP_RATED: '/movie/top_rated',
  UPCOMING: '/movie/upcoming',
  NOW_PLAYING: '/movie/now_playing',
  MOVIE_DETAILS: '/movie',
  MOVIE_CREDITS: '/movie',
  SEARCH: '/search/movie',
} as const;
