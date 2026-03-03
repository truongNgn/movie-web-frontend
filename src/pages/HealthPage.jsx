import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "../api/health";

function StatusBadge({ ok }) {
  return ok ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/50 text-green-400 border border-green-700">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      Working
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-900/50 text-red-400 border border-red-700">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      Unavailable
    </span>
  );
}

export default function HealthPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 30_000, // auto-refresh every 30s
    staleTime: 10_000,
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Health</h1>
          <p className="text-gray-400 text-sm mt-1">
            Auto-refreshes every 30 seconds &nbsp;·&nbsp;{" "}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-indigo-400 hover:underline disabled:opacity-50"
            >
              {isFetching ? "Checking…" : "Refresh now"}
            </button>
          </p>
        </div>
        {data && (
          <div
            className={`text-sm font-semibold px-4 py-2 rounded-lg border ${
              data.ok
                ? "bg-green-900/30 border-green-700 text-green-400"
                : "bg-red-900/30 border-red-700 text-red-400"
            }`}
          >
            {data.ok ? "All systems operational" : "Degraded"}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse h-14" />
          ))}
        </div>
      )}

      {/* Fetch error (network unreachable) */}
      {isError && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-5 text-red-300 text-sm">
          Cannot reach the backend. Make sure the Docker stack is running.
        </div>
      )}

      {/* Services list */}
      {data && (
        <div className="space-y-3">
          {data.services.map((svc) => (
            <div
              key={svc.name}
              className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-white text-sm">{svc.name}</p>
                {typeof svc.detail === "string" && svc.detail !== "working" && (
                  <p className="text-xs text-gray-400 mt-0.5">{svc.detail}</p>
                )}
              </div>
              <StatusBadge ok={svc.ok} />
            </div>
          ))}
        </div>
      )}

      {/* Endpoint info */}
      <p className="text-xs text-gray-600 mt-8 text-center">
        Powered by{" "}
        <code className="text-gray-500">GET /api/health/</code> (django-health-check)
      </p>
    </div>
  );
}
