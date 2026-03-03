import api from "./axios";

/**
 * Fetch paginated movie list.
 * @param {Object} params — limit, offset, search, genre, genre_id, year, ordering
 */
export const fetchMovies = (params = {}) =>
  api.get("movies/", { params }).then((res) => res.data);

/**
 * Fetch single movie detail.
 * @param {number} id
 */
export const fetchMovie = (id) =>
  api.get(`movies/${id}/`).then((res) => res.data);

/**
 * Fetch all genres (no pagination).
 */
export const fetchGenres = () =>
  api.get("genres/").then((res) => res.data);

/**
 * Fetch top 20 trending movies (by avg rating, min 5 ratings).
 */
export const fetchTrending = () =>
  api.get("movies/trending/").then((res) => res.data);

/**
 * Submit a rating for a movie. Requires authentication.
 * @param {{ movie: number, rating: number }} payload
 */
export const submitRating = (payload) =>
  api.post("ratings/", payload).then((res) => res.data);
