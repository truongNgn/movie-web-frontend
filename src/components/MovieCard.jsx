import { Link } from "react-router-dom";

const TMDB_W342 = "https://image.tmdb.org/t/p/w342";

// Array of curated movie-themed Unsplash images (Star Wars, Harry Potter, etc vibes)
const FALLBACK_POSTERS = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=342&h=513&fit=crop&q=80", // Film reels
  "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=342&h=513&fit=crop&q=80", // Movie slate
  "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=342&h=513&fit=crop&q=80", // Cinema sign
  "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=342&h=513&fit=crop&q=80", // Camera lens
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=342&h=513&fit=crop&q=80", // Film theater
  "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=342&h=513&fit=crop&q=80", // Clapperboard
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=342&h=513&fit=crop&q=80", // Vintage camera
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=342&h=513&fit=crop&q=80", // Retro TV
  "https://images.unsplash.com/photo-1604998103924-89e012e5265a?w=342&h=513&fit=crop&q=80", // Netflix vibe
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=342&h=513&fit=crop&q=80", // Photography
];

function getFallbackImage(id) {
  const index = id ? id % FALLBACK_POSTERS.length : 0;
  return FALLBACK_POSTERS[index];
}

export default function MovieCard({ movie }) {
  const rating = movie.avg_rating ? Number(movie.avg_rating).toFixed(1) : null;

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group block card-base overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.25)] transition-all duration-300"
    >
      <div className="relative aspect-[2/3] w-full bg-indigo-950/30 overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`${TMDB_W342}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
          />
        ) : (
          <img
            src={getFallbackImage(movie.id)}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110 opacity-80"
          />
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-amber-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200">
          {movie.title}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1.5">
          {movie.release_date && (
            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{movie.release_date.slice(0, 4)}</span>
          )}
          {movie.avg_rating && (
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold ml-auto bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm group-hover:bg-amber-400/10 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
