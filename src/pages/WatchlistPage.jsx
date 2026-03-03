import { Link } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../api/movies";
import MovieCard from "../components/MovieCard";

function useWatchlistMovies(ids) {
  return useQuery({
    queryKey: ["watchlist", [...ids].sort().join(",")],
    queryFn: () => {
      const idList = [...ids].join(",");
      return fetchMovies({ ids: idList, limit: 100, offset: 0 });
    },
    enabled: ids.size > 0,
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.results ?? [],
  });
}

export default function WatchlistPage() {
  const { ids, toggle } = useWatchlist();

  const { data: movies = [], isLoading } = useWatchlistMovies(ids);

  const watchlistCount = ids.size;

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-900/50 border border-indigo-700/40 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-400">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
          <p className="text-slate-500 text-sm">
            {watchlistCount === 0
              ? "No movies saved yet"
              : `${watchlistCount} movie${watchlistCount !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {watchlistCount === 0 && (
        <div className="glass p-16 text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-900/30 border border-indigo-700/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-indigo-500">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-300 text-lg font-semibold mb-1">Your watchlist is empty</p>
            <p className="text-slate-500 text-sm">Browse movies and click the bookmark icon to save them here.</p>
          </div>
          <Link to="/" className="btn-primary">Browse Movies</Link>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && watchlistCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...ids].map((id) => (
            <div key={id} className="card-base aspect-[2/3] animate-pulse" />
          ))}
        </div>
      )}

      {/* Movie grid */}
      {!isLoading && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div key={movie.id} className="relative group/card">
              <MovieCard movie={movie} />
              {/* Remove button */}
              <button
                onClick={() => toggle(movie.id)}
                title="Remove from watchlist"
                className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm
                           flex items-center justify-center opacity-0 group-hover/card:opacity-100
                           hover:bg-red-900/80 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-red-400">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Fetch error / no matches */}
      {!isLoading && watchlistCount > 0 && movies.length === 0 && (
        <div className="glass p-10 text-center">
          <p className="text-slate-400 mb-2">Could not load watchlist movies.</p>
          <p className="text-slate-600 text-sm">Make sure the backend is running and try again.</p>
        </div>
      )}
    </div>
  );
}
