// Shimmer placeholder shown while the AI estimate is being generated — mirrors
// the shape of the executive result (KPI row + section blocks) so the layout
// doesn't jump when real data arrives.
export function LoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Generating estimate">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="skeleton h-3 w-20" />
              <div className="skeleton h-8 w-8 rounded-[10px]" />
            </div>
            <div className="skeleton mt-4 h-8 w-24" />
            <div className="skeleton mt-3 h-3 w-16" />
          </div>
        ))}
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="card p-6 sm:p-7">
          <div className="skeleton h-4 w-52" />
          <div className="skeleton mt-3 h-3 w-full max-w-xl" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-4">
                <div className="skeleton h-5 w-9 flex-none rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-2/3" />
                  <div className="skeleton h-2.5 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
