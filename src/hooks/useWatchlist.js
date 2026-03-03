import { useState, useCallback } from "react";

const KEY = "moviedisc_watchlist";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function useWatchlist() {
  const [ids, setIds] = useState(() => new Set(load()));

  const toggle = useCallback((movieId) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(movieId)) next.delete(movieId);
      else next.add(movieId);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { ids, toggle, inList: (id) => ids.has(id) };
}
