import { useParams, Link } from "react-router-dom";
import { useMovie } from "../hooks/useMovies";
import StarRating from "../components/StarRating";
import WatchlistButton from "../components/WatchlistButton";

const TMDB_W500 = "https://image.tmdb.org/t/p/w500";
const TMDB_W1280 = "https://image.tmdb.org/t/p/w1280";

function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-72 rounded-2xl bg-indigo-950/50 mb-8" />
      <div className="flex gap-8">
        <div className="w-48 aspect-[2/3] rounded-xl bg-indigo-950/50 shrink-0 hidden md:block" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-indigo-950/50 rounded w-2/3" />
          <div className="h-4 bg-indigo-950/50 rounded w-1/3" />
          <div className="h-4 bg-indigo-950/50 rounded w-full" />
          <div className="h-4 bg-indigo-950/50 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const { data: movie, isLoading, isError } = useMovie(Number(id));

  if (isLoading) return <div className="container mx-auto px-4 py-10"><SkeletonDetail /></div>;

  if (isError || !movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🎬</p>
        <h1 className="text-2xl font-bold mb-2">Movie Not Found</h1>
        <p className="text-slate-500 mb-6">We couldn't find this movie in our database.</p>
        <Link to="/" className="btn-primary">← Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      {movie.poster_path && (
        <div className="relative h-64 md:h-80 overflow-hidden -mx-0">
          <img src={`${TMDB_W1280}${movie.poster_path}`} alt=""
            className="w-full h-full object-cover object-top opacity-20 blur-sm scale-105" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F23]" />
        </div>
      )}

      <div className="container mx-auto px-4 pb-12" style={{ marginTop: movie.poster_path ? "-6rem" : "2rem" }}>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M19 12H5m7-7-7 7 7 7"/>
          </svg>
          Back to Browse
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-56 shrink-0">
            {movie.poster_path ? (
              <img src={`${TMDB_W500}${movie.poster_path}`} alt={movie.title}
                className="w-48 md:w-full rounded-2xl shadow-2xl shadow-black/50 mx-auto md:mx-0" />
            ) : (
              <div className="w-48 md:w-full aspect-[2/3] rounded-2xl bg-indigo-950/50 flex items-center justify-center text-indigo-700 mx-auto md:mx-0">
                No image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">{movie.title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              {movie.release_date && (
                <span className="text-slate-400">{movie.release_date.slice(0, 4)}</span>
              )}
              {movie.avg_rating && (
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {Number(movie.avg_rating).toFixed(1)}
                  <span className="text-slate-500 font-normal">({movie.ratings_count} ratings)</span>
                </span>
              )}
              {movie.tmdb_id && (
                <a href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-xs border border-indigo-700/40 px-2 py-0.5 rounded-full">
                  TMDB ↗
                </a>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres.map((g) => (
                  <span key={g.id} className="px-3 py-1 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs rounded-full">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview ? (
              <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-6 max-w-2xl">{movie.overview}</p>
            ) : (
              <p className="text-slate-600 italic text-sm mb-6">No overview available.</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <WatchlistButton movie={movie} />
            </div>

            {/* Rating */}
            <div className="border-t border-indigo-900/40 pt-5">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Rating</h2>
              <StarRating movieId={movie.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
