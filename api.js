import axios from 'axios';
import { TMDB_API_KEY } from '@env';

// Adicionei o console.log abaixo para verificar se a chave da API está sendo carregada corretamente
console.log('TMDB_API_KEY:', TMDB_API_KEY);

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: TMDB_API_KEY,  // Usando a chave da API aqui
    language: 'pt-BR',
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para buscar filmes pela query
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao buscar filmes:', error); // Exibe o erro caso aconteça
    throw error;  // Lança o erro novamente para ser tratado em outro lugar
  }
};

// Função para buscar detalhes de um filme pelo ID
export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`); // Faz a requisição para buscar os detalhes do filme
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error); // Exibe o erro caso aconteça
    throw error; // Lança o erro novamente
  }
};

export default api;
