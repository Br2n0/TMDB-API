import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const MovieCard = ({ movie, onPress }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/150x225?text=Sem+Imagem';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'Data desconhecida';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(movie.id)}>
      <Image source={{ uri: posterUrl }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{releaseYear}</Text>
        <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}/10</Text>
        <Text style={styles.overview} numberOfLines={3}>
          {movie.overview || 'Sem descrição disponível.'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  year: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    marginBottom: 8,
    color: '#f5a623',
  },
  overview: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});

export default MovieCard;