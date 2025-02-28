import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { getMovieDetails } from '../services/api';
import Loading from '../components/Loading';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return <Loading message="Carregando detalhes do filme..." />;
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Filme não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sem+Imagem';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('pt-BR')
    : 'Data desconhecida';

  // Converte os minutos para formato de horas e minutos
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Duração desconhecida';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {backdropUrl && (
        <Image source={{ uri: backdropUrl }} style={styles.backdrop} />
      )}
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <View style={styles.posterContainer}>
            <Image source={{ uri: posterUrl }} style={styles.poster} />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.tagline && (
              <Text style={styles.tagline}>"{movie.tagline}"</Text>
            )}
            
            <View style={styles.detailsRow}>
              <Text style={styles.detailItem}>{releaseDate}</Text>
              <Text style={styles.detailItem}>•</Text>
              <Text style={styles.detailItem}>{formatRuntime(movie.runtime)}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐ {movie.vote_average.toFixed(1)}/10
              </Text>
              <Text style={styles.voteCount}>
                ({movie.vote_count} votos)
              </Text>
            </View>
            
            {movie.genres && movie.genres.length > 0 && (
              <View style={styles.genresContainer}>
                {movie.genres.map((genre) => (
                  <View key={genre.id} style={styles.genreBadge}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sinopse</Text>
              <Text style={styles.overview}>
                {movie.overview || 'Sinopse não disponível.'}
              </Text>
            </View>
            
            {movie.production_companies && movie.production_companies.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Produção</Text>
                <Text style={styles.companies}>
                  {movie.production_companies
                    .map((company) => company.name)
                    .join(', ')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    opacity: 0.4,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  posterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  poster: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginTop: 8,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailItem: {
    fontSize: 14,
    color: '#444',
    marginHorizontal: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5a623',
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genreBadge: {
    backgroundColor: '#0066cc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  companies: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});

export default MovieDetailsScreen;