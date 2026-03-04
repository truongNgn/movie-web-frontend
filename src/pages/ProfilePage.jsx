import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../hooks/useWatchlist";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const { ids } = useWatchlist();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="max-w-3xl mx-auto">

                {/* Profile Header */}
                <div className="glass p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] border-4 border-indigo-900/50 z-10">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user?.username}</h1>
                        <p className="text-indigo-300 mb-6">{user?.email}</p>

                        <button onClick={() => { logout(); navigate("/"); }} className="btn-outline !text-red-400 !border-red-500/30 hover:!bg-red-500/10 hover:!border-red-400">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="glass p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-7 h-7">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Ratings Given</p>
                            <p className="text-2xl font-bold text-white">Soon™</p>
                        </div>
                    </div>

                    <Link to="/watchlist" className="glass p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Watchlist Movies</p>
                            <p className="text-2xl font-bold text-white">{ids.size}</p>
                        </div>
                        <div className="ml-auto text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M9 18l6-6-6-6" /></svg>
                        </div>
                    </Link>
                </div>

                {/* Favorite Genres Placeholder */}
                <div className="glass p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-purple-400">
                            <path d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <h2 className="text-xl font-bold text-white">Favorite Genres</h2>
                    </div>

                    <div className="text-center py-8">
                        <p className="text-slate-500 mb-4">You haven't selected any favorite genres yet.</p>
                        <Link to="/" className="btn-outline">Discover Movies</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
