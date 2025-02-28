import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import { searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (resetPage = true) => {
    if (!query.trim()) {
      Alert.alert('Atenção', 'Digite o nome de um filme para buscar');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const newPage = resetPage ? 1 : page;
      const response = await searchMovies(query, newPage);
      
      if (resetPage) {
        setMovies(response.results);
      } else {
        setMovies([...movies, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setPage(resetPage ? 1 : newPage);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar os filmes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    if (page < totalPages && !loading) {
      setPage(prevPage => prevPage + 1);
      handleSearch(false);
    }
  };

  const handleMoviePress = (movieId) => {
    navigation.navigate('MovieDetails', { movieId });
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {query.trim() 
          ? 'Nenhum filme encontrado. Tente outra busca.'
          : 'Busque por seus filmes favoritos!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TMDB - Buscador de Filmes</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do filme..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(true)}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => handleSearch(true)}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <Loading message="Buscando filmes..." />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={handleMoviePress} />
          )}
          contentContainerStyle={styles.moviesList}
          ListEmptyComponent={renderEmptyList}
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loading && page > 1 ? <Loading message="Carregando mais filmes..." /> : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 12,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  moviesList: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});

export default SearchScreen;