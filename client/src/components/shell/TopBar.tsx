import { useEffect, useState } from "react";
import { Cpu } from "../../lib/icons";

interface Health {
  mode: string;
  provider?: string | null;
  model?: string | null;
}

const PROVIDER_LABEL: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Claude",
};

// The top bar hosts page context, the active model, and the live/demo mode pill
// (self-contained health probe — the same one that used to live in App).
export function TopBar({ title = "Create estimate" }: { title?: string }) {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const live = health?.mode === "live";
  const providerLabel =
    (health?.provider && PROVIDER_LABEL[health.provider]) || health?.provider;

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="min-w-0">
          <div className="kicker">TDM workspace</div>
          <div className="truncate text-[14px] font-semibold text-ink">
            {title}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Active model (real value from the backend health probe). */}
          {health && (
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-[12px] font-medium text-slate sm:inline-flex">
              <Cpu className="h-3.5 w-3.5 text-mute" strokeWidth={2} />
              {live && health.model ? (
                <>
                  {providerLabel && (
                    <span className="text-mute">{providerLabel}</span>
                  )}
                  <span className="font-semibold text-ink">{health.model}</span>
                </>
              ) : (
                <span className="font-semibold text-ink">Demo data</span>
              )}
            </span>
          )}
          {health && <ModePill live={live} />}
        </div>
      </div>
    </header>
  );
}

function ModePill({ live }: { live: boolean }) {
  return (
    <span className={live ? "badge badge-success" : "badge"}>
      <span
        className="dot"
        style={{
          background: live ? "var(--color-success)" : "var(--color-mute)",
        }}
      />
      {live ? "Live AI" : "Demo data"}
    </span>
  );
}
