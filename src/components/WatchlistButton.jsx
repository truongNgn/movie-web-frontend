import { useWatchlist } from "../hooks/useWatchlist";
import { useToast } from "../context/ToastContext";

export default function WatchlistButton({ movie, className = "" }) {
  const { inList, toggle } = useWatchlist();
  const toast = useToast();
  const saved = inList(movie.id);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggle(movie.id);
    toast({
      message: saved ? `Removed from watchlist` : `Added "${movie.title}" to watchlist`,
      type: saved ? "info" : "success",
    });
  }

  return (
    <button
      onClick={handleClick}
      title={saved ? "Remove from watchlist" : "Add to watchlist"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 cursor-pointer
        ${saved
          ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300 hover:bg-red-900/20 hover:border-red-500/40 hover:text-red-400"
          : "bg-white/5 border-white/10 text-slate-400 hover:bg-indigo-600/10 hover:border-indigo-500/30 hover:text-indigo-300"
        } ${className}`}
    >
      <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      {saved ? "Saved" : "Watchlist"}
    </button>
  );
}
