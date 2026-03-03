import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 left-5 z-50 p-3 rounded-full bg-indigo-600/80 hover:bg-indigo-500 backdrop-blur-sm border border-indigo-500/40 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
}
