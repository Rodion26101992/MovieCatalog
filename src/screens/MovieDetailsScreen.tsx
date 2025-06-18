import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getMovieDetails, getMovieVideos, getMovieCredits } from '../api';
import { useTranslation } from '../hooks/useTranslation';
import { useRoute, useNavigation } from '@react-navigation/native';
import VideoPlayer from '../comonents/VideoPlayer';

const MovieDetailsScreen = () => {
  const { t, locale } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { movieId } = route.params as { movieId: number };
  
  const [movieInfo, setMovieInfo] = useState<any>(null);
  const [movieVideos, setMovieVideos] = useState<any[]>([]);
  const [movieCredits, setMovieCredits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getApiLanguage = (appLocale: string) => {
    const languageMap: { [key: string]: string } = {
      'ru': 'ru-RU',
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
    };
    return languageMap[appLocale] || 'en-US';
  };

  useEffect(() => {
    const apiLanguage = getApiLanguage(locale);
    
    // Получаем детали фильма
    getMovieDetails(movieId, apiLanguage)
      .then(response => {
        console.log('Movie details:', response);
        setMovieInfo(response);
      })
      .catch(error => {
        console.error('Movie details error:', error);
      });
    
    // Получаем трейлеры
    getMovieVideos(movieId, apiLanguage)
      .then(response => {
        console.log('Movie videos:', response);
        const videos = response.results || [];
        const trailers = videos.filter((video: any) => 
          video.type === 'Trailer' && video.site === 'YouTube'
        );
        setMovieVideos(trailers);
      })
      .catch(error => {
        console.error('Movie videos error:', error);
      });

    // Получаем актерский состав
    getMovieCredits(movieId, apiLanguage)
      .then(response => {
        console.log('Movie credits:', response);
        setMovieCredits(response);
        setLoading(false);
      })
      .catch(error => {
        console.error('Credits error:', error);
        setLoading(false);
      });
  }, [movieId, locale]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loading}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← {t('common.back')}</Text>
        </TouchableOpacity>

        {movieInfo && (
          <>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              {movieInfo.backdrop_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w780${movieInfo.backdrop_path}` }}
                  style={styles.backdrop}
                />
              )}
              <View style={styles.heroOverlay}>
                <View style={styles.movieHeader}>
                  {movieInfo.poster_path && (
                    <Image
                      source={{ uri: `https://image.tmdb.org/t/p/w300${movieInfo.poster_path}` }}
                      style={styles.poster}
                    />
                  )}
                  <View style={styles.movieHeaderText}>
                    <Text style={styles.movieTitle}>{movieInfo.title}</Text>
                    <Text style={styles.movieOriginalTitle}>
                      {movieInfo.original_title}
                    </Text>
                    <Text style={styles.movieRating}>
                      ⭐ {movieInfo.vote_average.toFixed(1)}/10
                    </Text>
                    <Text style={styles.movieDetails}>
                      {movieInfo.release_date?.split('-')[0]} • {movieInfo.runtime} мин
                    </Text>
                    <Text style={styles.movieGenres}>
                      {movieInfo.genres?.map((g: any) => g.name).join(', ')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('movie.overview')}</Text>
              <Text style={styles.movieOverview}>
                {movieInfo.overview || t('movie.noOverview')}
              </Text>
            </View>

            {/* Cast */}
            {movieCredits && movieCredits.cast && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('movie.cast')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {movieCredits.cast.slice(0, 10).map((actor: any) => (
                    <View key={actor.id} style={styles.actorCard}>
                      {actor.profile_path ? (
                        <Image
                          source={{ uri: `https://image.tmdb.org/t/p/w185${actor.profile_path}` }}
                          style={styles.actorPhoto}
                        />
                      ) : (
                        <View style={styles.actorPhotoPlaceholder}>
                          <Text style={styles.actorPhotoText}>
                            {actor.name.charAt(0)}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.actorName} numberOfLines={2}>
                        {actor.name}
                      </Text>
                      <Text style={styles.actorCharacter} numberOfLines={2}>
                        {actor.character}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Trailers */}
            {movieVideos.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t('movie.trailers')} ({movieVideos.length})
                </Text>
                {movieVideos.map((video) => (
                  <VideoPlayer
                    key={video.key}
                    videoKey={video.key}
                    videoName={video.name}
                    videoType={video.type}
                  />
                ))}
              </View>
            )}
          </>
        )}
        
        <StatusBar barStyle="light-content" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loading: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroSection: {
    position: 'relative',
    height: 400,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  movieHeader: {
    flexDirection: 'row',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 20,
  },
  movieHeaderText: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  movieOriginalTitle: {
    fontSize: 16,
    color: '#ccc',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  movieRating: {
    fontSize: 18,
    color: '#FF6B35',
    marginBottom: 5,
  },
  movieDetails: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  movieGenres: {
    fontSize: 14,
    color: '#ccc',
  },
  section: {
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  movieOverview: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actorCard: {
    width: 100,
    marginRight: 15,
    alignItems: 'center',
  },
  actorPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  actorPhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actorPhotoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  actorName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  actorCharacter: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});

export default MovieDetailsScreen;