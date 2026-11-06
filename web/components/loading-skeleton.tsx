export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-3 h-4 w-1/3 rounded bg-slate-200" />
          <div className="mb-2 h-3 w-full rounded bg-slate-200" />
          <div className="mb-2 h-3 w-5/6 rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
