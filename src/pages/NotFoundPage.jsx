import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <div className="relative mb-8 select-none">
          <span
            className="text-[10rem] font-bold leading-none"
            style={{
              fontFamily: "'Righteous', cursive",
              background: "linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #818CF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.8,
            }}
          >
            404
          </span>
          {/* Decorative blobs */}
          <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-indigo-400">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <path d="M11 8v3M11 14h.01" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
          <button onClick={() => navigate(-1)} className="btn-outline">
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
