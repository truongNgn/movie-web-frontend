import { Link } from "react-router-dom";

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";

export default function MovieCard({ movie }) {
  const rating = movie.avg_rating ? Number(movie.avg_rating).toFixed(1) : null;

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group card-base overflow-hidden flex flex-col
                 hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/30 cursor-pointer"
    >
      {/* Poster */}
      <div className="relative overflow-hidden aspect-[2/3]">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMG}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-indigo-950/50 flex flex-col items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-indigo-700">
              <rect x="2" y="2" width="20" height="20" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="text-xs text-indigo-700">No image</span>
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-amber-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {rating}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/8 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200">
          {movie.title}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          {movie.release_date && (
            <span className="text-xs text-slate-500">{movie.release_date.slice(0, 4)}</span>
          )}
          {movie.genres?.length > 0 && (
            <span className="text-xs bg-indigo-900/40 text-indigo-400 px-2 py-0.5 rounded-full truncate max-w-[7rem]">
              {movie.genres[0].name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
