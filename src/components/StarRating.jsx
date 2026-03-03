import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubmitRating } from "../hooks/useMovies";
import { useToast } from "../context/ToastContext";

export default function StarRating({ movieId, currentRating = 0 }) {
  const { isAuthenticated } = useAuth();
  const { mutate, isPending } = useSubmitRating();
  const toast = useToast();

  const [hovered, setHovered]   = useState(0);
  const [submitted, setSubmitted] = useState(currentRating);

  function handleRate(value) {
    if (!isAuthenticated || isPending) return;
    const prev = submitted;
    setSubmitted(value);
    mutate(
      { movie: movieId, rating: value },
      {
        onSuccess: () => toast({ message: `Rated ${value} / 5 ⭐`, type: "success" }),
        onError:   () => { setSubmitted(prev); toast({ message: "Failed to save rating.", type: "error" }); },
      }
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <ReadOnlyStars value={submitted} />
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-xs border border-indigo-700/40 px-3 py-1 rounded-full transition-colors">
          Sign in to rate
        </Link>
      </div>
    );
  }

  const display = hovered || submitted;

  return (
    <div className="flex items-center gap-3">
      <div className="flex" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative w-8 h-8 cursor-pointer select-none">
            {/* Left half */}
            <div className="absolute left-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHovered(star - 0.5)}
              onClick={() => handleRate(star - 0.5)} />
            {/* Right half */}
            <div className="absolute right-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHovered(star)}
              onClick={() => handleRate(star)} />
            {/* Star SVG */}
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <defs>
                <clipPath id={`half-${movieId}-${star}`}>
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
              </defs>
              {/* Grey base */}
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#1E1B4B" />
              {/* Gold fill */}
              {display >= star && (
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FBBF24" />
              )}
              {display >= star - 0.5 && display < star && (
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#FBBF24" clipPath={`url(#half-${movieId}-${star})`} />
              )}
            </svg>
          </div>
        ))}
      </div>

      <span className="text-sm text-slate-400">
        {isPending ? "Saving…" : submitted > 0 ? `${submitted} / 5` : "Tap to rate"}
      </span>
    </div>
  );
}

function ReadOnlyStars({ value }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={value >= star ? "#FBBF24" : "#1E1B4B"} />
        </svg>
      ))}
    </div>
  );
}
