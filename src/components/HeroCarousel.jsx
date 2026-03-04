import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TMDB_W1280 = "https://image.tmdb.org/t/p/w1280";

function StarIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

// Array of curated movie-themed Unsplash images (Star Wars, Harry Potter, etc vibes)
const FALLBACK_POSTERS = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&h=720&fit=crop&q=80", // Film reels
    "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=1280&h=720&fit=crop&q=80", // Movie slate
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1280&h=720&fit=crop&q=80", // Cinema sign
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1280&h=720&fit=crop&q=80", // Camera lens
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1280&h=720&fit=crop&q=80", // Film theater
    "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=1280&h=720&fit=crop&q=80", // Clapperboard
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280&h=720&fit=crop&q=80", // Vintage camera
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1280&h=720&fit=crop&q=80", // Retro TV
    "https://images.unsplash.com/photo-1604998103924-89e012e5265a?w=1280&h=720&fit=crop&q=80", // Netflix vibe
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1280&h=720&fit=crop&q=80", // Photography
];

function getFallbackImage(id) {
    const index = id ? id % FALLBACK_POSTERS.length : 0;
    return FALLBACK_POSTERS[index];
}

export default function HeroCarousel({ movies }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const featuredMovies = movies?.slice(0, 5) || [];

    useEffect(() => {
        if (featuredMovies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [featuredMovies.length]);

    if (featuredMovies.length === 0) return null;

    return (
        <div className="relative overflow-hidden rounded-3xl mb-12 min-h-[300px] md:min-h-[450px] flex items-end shadow-2xl group">
            {featuredMovies.map((movie, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                        key={movie.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <div
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${isActive ? "scale-105" : "scale-100"
                                }`}
                            style={{
                                backgroundImage: `url(${movie.poster_path ? `${TMDB_W1280}${movie.poster_path}` : getFallbackImage(movie.id)})`,
                                backgroundPosition: "center 20%",
                            }}
                        />
                        {/* Gradients to keep text readable */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F23] via-[#0F0F23]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F23] via-[#0F0F23]/20 to-transparent" />

                        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-4 uppercase tracking-widest animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <StarIcon className="w-4 h-4" /> Top Trending #{index + 1}
                            </span>

                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '300ms', textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                                {movie.title}
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                                {movie.genres?.slice(0, 3).map((g) => (
                                    <span
                                        key={g.id}
                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                                <Link
                                    to={`/movies/${movie.id}`}
                                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1"
                                >
                                    View Details
                                </Link>
                                {movie.avg_rating && (
                                    <span className="flex items-center gap-1.5 text-base text-amber-400 font-bold bg-black/40 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                                        <StarIcon className="w-5 h-5" />
                                        {Number(movie.avg_rating).toFixed(1)} / 5
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Dots */}
            <div className="absolute bottom-6 right-6 md:right-12 z-20 flex gap-3">
                {featuredMovies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-300 rounded-full ${currentIndex === index
                            ? "w-8 h-2.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                            : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
