import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
              <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <span className="font-['Righteous'] text-xl text-white tracking-wide">MovieDisc</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 max-w-xs">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/") ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Browse
          </Link>
          <Link
            to="/watchlist"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/watchlist") ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Watchlist
          </Link>
          <Link
            to="/health"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/health") ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Status
          </Link>
        </nav>

        {/* Right: auth */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-900/30 border border-indigo-700/30">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 font-medium">{user.username}</span>
              </div>
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
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M4 6h16M4 12h16M4 18h16"/>
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
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? "bg-indigo-600/20 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
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
