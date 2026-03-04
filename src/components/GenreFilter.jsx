export default function GenreFilter({ genres, selectedGenreId, onSelectGenre }) {
    if (!genres || genres.length === 0) return null;

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-indigo-400">
                    <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Browse by Genre</h3>
            </div>

            <div
                className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-1 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <button
                    onClick={() => onSelectGenre("")}
                    className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${!selectedGenreId
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)] transform -translate-y-0.5"
                            : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                >
                    All Movies
                </button>

                {genres.map((genre) => {
                    const isSelected = selectedGenreId === String(genre.id);
                    return (
                        <button
                            key={genre.id}
                            onClick={() => onSelectGenre(String(genre.id))}
                            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${isSelected
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)] transform -translate-y-0.5"
                                    : "bg-indigo-900/30 border border-indigo-700/30 text-indigo-200 hover:bg-indigo-800/40 hover:border-indigo-600/50 hover:text-white"
                                }`}
                        >
                            {genre.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
