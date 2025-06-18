import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Authorization, getPopularMovies, getUpcomingMovies } from '../api';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/movie';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeList'
>;

const HomeScreen = () => {
  const { t, changeLanguage, availableLanguages, locale } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [autor, setAutor] = useState<any | null>(null);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const getApiLanguage = (appLocale: string) => {
    const languageMap: { [key: string]: string } = {
      ru: 'ru-RU',
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-BR',
      ja: 'ja-JP',
      ko: 'ko-KR',
      zh: 'zh-CN',
    };
    return languageMap[appLocale] || 'en-US';
  };

  useEffect(() => {
    const apiLanguage = getApiLanguage(locale);

    // Авторизация
    Authorization()
      .then(response => {
        console.log('Authorization response:', response);
        setAutor(response);
      })
      .catch(error => {
        console.error(t('errors.authorizationFailed'), error);
      });

    // Получаем популярные фильмы
    getPopularMovies(1, apiLanguage)
      .then(response => {
        console.log('Popular movies:', response);
        setPopularMovies(response.results?.slice(0, 10) || []);
      })
      .catch(error => {
        console.error('Popular movies error:', error);
      });

    // Получаем ожидаемые фильмы
    getUpcomingMovies(1, apiLanguage)
      .then(response => {
        console.log('Upcoming movies:', response);
        setUpcomingMovies(response.results?.slice(0, 10) || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Upcoming movies error:', error);
        setLoading(false);
      });
  }, [locale]);

  const openMovieDetails = (movieId: number) => {
    navigation.navigate('MovieDetails', { movieId });
  };

  const languageNames: { [key: string]: string } = {
    en: 'English',
    ru: 'Русский',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    ja: '日本語',
    ko: '한국어',
    zh: '中文',
  };

  // Создаем объединенные данные для одного FlatList
  const combinedData = [
    { type: 'header' },
    { type: 'languageSelector' },
    { type: 'sectionTitle', title: t('home.popularMovies') },
    ...popularMovies.map(movie => ({ type: 'movie', data: movie })),
    { type: 'sectionTitle', title: t('home.upcomingMovies') },
    ...upcomingMovies.map(movie => ({ type: 'movie', data: movie })),
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={styles.header}>
            <Text style={styles.title}>{t('home.title')}</Text>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <Text style={styles.languageButtonText}>
                {languageNames[locale] || locale.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'languageSelector':
        return showLanguageSelector ? (
          <View style={styles.languageSelector}>
            {availableLanguages.map(lang => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageOption,
                  locale === lang && styles.selectedLanguage,
                ]}
                onPress={() => {
                  changeLanguage(lang);
                  setShowLanguageSelector(false);
                }}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    locale === lang && styles.selectedLanguageText,
                  ]}
                >
                  {languageNames[lang] || lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null;
      case 'sectionTitle':
        return <Text style={styles.sectionTitle}>{item.title}</Text>;
      case 'movie':
        return (
          <TouchableOpacity
            style={styles.movieItem}
            onPress={() => openMovieDetails(item.data.id)}
          >
            {item.data.poster_path && (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w300${item.data.poster_path}`,
                }}
                style={styles.moviePoster}
              />
            )}
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.data.title}
              </Text>
              <Text style={styles.movieRating}>
                ⭐ {item.data.vote_average.toFixed(1)}/10
              </Text>
              <Text style={styles.movieYear}>
                {item.data.release_date?.split('-')[0]}
              </Text>
              <Text style={styles.movieOverview} numberOfLines={3}>
                {item.data.overview}
              </Text>
            </View>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loading}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={combinedData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#f0f0f0" // Цвет фона статус-бара (только Android)
          hidden={false} // Скрыть/показать статус-бар
          translucent={true} // Прозрачность (только Android)
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Добавить отступ снизу для последних элементов
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  languageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  languageSelector: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10, // Добавить отступ сверху для разделения секций
    color: '#333',
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moviePoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  movieRating: {
    fontSize: 14,
    color: '#FF6B35',
    marginBottom: 3,
  },
  movieYear: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  movieOverview: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default HomeScreen;
