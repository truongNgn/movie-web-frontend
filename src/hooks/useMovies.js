import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMovies, fetchMovie, fetchGenres, fetchTrending, submitRating } from "../api/movies";

export const movieKeys = {
  all: ["movies"],
  list: (params) => ["movies", "list", params],
  detail: (id) => ["movies", "detail", id],
  trending: ["movies", "trending"],
  genres: ["genres"],
};

export function useMovies(params = {}) {
  return useQuery({
    queryKey: movieKeys.list(params),
    queryFn: () => fetchMovies(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export function useInfiniteMovies(params = {}, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: [...movieKeys.all, "infinite", params],
    queryFn: ({ pageParam = 0 }) =>
      fetchMovies({ ...params, limit: pageSize, offset: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useMovie(id) {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => fetchMovie(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: movieKeys.trending,
    queryFn: fetchTrending,
    staleTime: 1000 * 60 * 10,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: movieKeys.genres,
    queryFn: fetchGenres,
    staleTime: Infinity,
  });
}

export function useSubmitRating() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitRating,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.detail(variables.movie) });
      queryClient.invalidateQueries({ queryKey: movieKeys.trending });
    },
  });
}
