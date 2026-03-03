import { useState } from "react";
import { Link } from "react-router-dom";
import { useMovies, useGenres, useTrending } from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";

const PAGE_SIZE = 20;
const TMDB_W780 = "https://image.tmdb.org/t/p/w780";
const TMDB_W154 = "https://image.tmdb.org/t/p/w154";

function StarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

/* ── Hero banner with first trending movie ──────────────────────────── */
function HeroBanner({ movies }) {
  const featured = movies?.[0];
  if (!featured) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl mb-10 min-h-[260px] md:min-h-[320px] flex items-end">
      {featured.poster_path && (
        <div className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${TMDB_W780}${featured.poster_path})` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F23]/95 via-[#0F0F23]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F23] via-transparent to-transparent" />
      <div className="relative z-10 p-6 md:p-10 max-w-lg">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-3 uppercase tracking-wider">
          <StarIcon className="w-3 h-3" /> Featured
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">{featured.title}</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {featured.genres?.slice(0, 3).map((g) => (
            <span key={g.id} className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-900/60 border border-indigo-700/40 text-indigo-300">{g.name}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/movies/${featured.id}`} className="btn-primary">View Details</Link>
          {featured.avg_rating && (
            <span className="flex items-center gap-1.5 text-sm text-amber-400 font-semibold">
              <StarIcon className="w-4 h-4" />
              {Number(featured.avg_rating).toFixed(1)} / 5
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Trending horizontal row ─────────────────────────────────────────── */
function TrendingRow({ movies }) {
  if (!movies?.length) return null;
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-400">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        <h2 className="text-lg font-bold text-white">Trending Now</h2>
        <span className="text-xs text-slate-500 ml-1">Highest rated</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {movies.slice(0, 14).map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`}
            className="group shrink-0 w-28 card-base overflow-hidden hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            <div className="relative aspect-[2/3] overflow-hidden">
              {movie.poster_path
                ? <img src={`${TMDB_W154}${movie.poster_path}`} alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                : <div className="w-full h-full bg-indigo-950/50" />
              }
              {movie.avg_rating && (
                <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/75 px-1.5 py-0.5 rounded text-xs font-bold text-amber-400">
                  <StarIcon className="w-2.5 h-2.5" />
                  {Number(movie.avg_rating).toFixed(1)}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-300 p-2 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">{movie.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function Home() {
  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDebounced]   = useState("");
  const [searchTimer, setSearchTimer]     = useState(null);
  const [genreId, setGenreId]             = useState("");
  const [offset, setOffset]               = useState(0);

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => { setDebounced(val); setOffset(0); }, 400));
  }

  function handleGenreChange(e) { setGenreId(e.target.value); setOffset(0); }

  const params = {
    limit: PAGE_SIZE, offset,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(genreId         && { genre_id: genreId }),
  };

  const { data, isLoading, isError, isFetching } = useMovies(params);
  const { data: genres }   = useGenres();
  const { data: trending } = useTrending();

  const movies      = data?.results ?? [];
  const total       = data?.count ?? 0;
  const totalPages  = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const isFiltering = debouncedSearch || genreId;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">

      {/* Hero + trending — hide when filtering */}
      {!isFiltering && offset === 0 && (
        <>
          <HeroBanner movies={trending} />
          <TrendingRow movies={trending} />
        </>
      )}

      {/* Section header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold text-white">
          {isFiltering ? "Search Results" : "All Movies"}
          {total > 0 && (
            <span className="text-slate-500 font-normal text-sm ml-2">
              ({total.toLocaleString()})
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={search} onChange={handleSearchChange}
              placeholder="Search movies…" className="input-field !pl-9 sm:w-56" />
          </div>
          <select value={genreId} onChange={handleGenreChange}
            className="input-field !w-auto !px-3 sm:w-40">
            <option value="">All Genres</option>
            {genres?.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="glass p-10 text-center">
          <p className="text-red-400 font-medium mb-1">Failed to load movies</p>
          <p className="text-slate-500 text-sm">Make sure the backend is running.</p>
        </div>
      )}

      {/* Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="card-base aspect-[2/3] animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && movies.length === 0 && (
        <div className="glass p-16 text-center">
          <p className="text-slate-400 text-lg mb-1">No movies found</p>
          <p className="text-slate-600 text-sm">Try adjusting your search or genre filter.</p>
        </div>
      )}

      {/* Movie grid */}
      {movies.length > 0 && (
        <>
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"}`}>
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                disabled={offset === 0 || isFetching} className="btn-outline disabled:opacity-30">
                ← Prev
              </button>
              <span className="text-sm text-slate-400">
                <span className="text-white font-semibold">{currentPage}</span>
                {" / "}
                <span className="text-white font-semibold">{totalPages}</span>
              </span>
              <button onClick={() => setOffset((o) => o + PAGE_SIZE)}
                disabled={!data?.next || isFetching} className="btn-outline disabled:opacity-30">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
