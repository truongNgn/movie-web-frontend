import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchMovies } from "../api/movies";

const TMDB_W154 = "https://image.tmdb.org/t/p/w154";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    fetchMovies({ search: debouncedSearch, limit: 5 })
      .then(data => {
        if (isMounted) {
          setResults(data.results || []);
          setIsSearching(false);
          setShowDropdown(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsSearching(false);
      });

    return () => { isMounted = false; };
  }, [debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0F0F23]/90 backdrop-blur-xl border-b border-indigo-900/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="font-['Righteous'] text-xl text-white tracking-wide">MovieDisc</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 max-w-xs">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive("/") ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Browse
          </Link>
          <Link
            to="/watchlist"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive("/watchlist") ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Watchlist
          </Link>
          <Link
            to="/health"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive("/health") ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Status
          </Link>
        </nav>

        {/* Global Search Bar */}
        <div className="hidden md:block flex-1 max-w-sm mx-4" ref={dropdownRef}>
          <div className="relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => { if (search) setShowDropdown(true); }}
              placeholder="Search movies globally..."
              className="input-field !pl-9 w-full bg-indigo-950/40 border-indigo-500/30 text-sm focus:bg-indigo-900/40 focus:border-indigo-400"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              </div>
            )}

            {/* Dropdown */}
            {showDropdown && search && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A2E]/95 backdrop-blur-xl border border-indigo-500/30 rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-up">
                {results.length > 0 ? (
                  <div className="flex flex-col">
                    {results.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movies/${movie.id}`}
                        onClick={() => { setShowDropdown(false); setSearch(""); setDebouncedSearch(""); }}
                        className="flex items-center gap-3 p-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                      >
                        <div className="w-10 h-14 bg-indigo-900/50 rounded overflow-hidden shrink-0">
                          {movie.poster_path && (
                            <img src={`${TMDB_W154}${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : !isSearching ? (
                  <div className="p-4 py-8 text-center text-slate-400 text-sm">
                    No movies found.
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Right: auth */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-900/30 border border-indigo-700/30 hover:bg-indigo-800/50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 font-medium">{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="btn-outline !px-3 !py-1.5 !text-xs">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline !px-4 !py-1.5 !text-xs">Sign In</Link>
              <Link to="/register" className="btn-primary !px-4 !py-1.5 !text-xs">Register</Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-indigo-900/30 bg-[#0F0F23] animate-slide-up">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {[
              { to: "/", label: "Browse" },
              { to: "/watchlist", label: "Watchlist" },
              { to: "/health", label: "System Status" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(to) ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-indigo-900/30 mt-2 pt-3 flex gap-2">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-outline w-full text-center">
                  Logout ({user.username})
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 text-center">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center">Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
