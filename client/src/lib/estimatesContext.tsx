import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  listEstimates,
  saveEstimate,
  deleteEstimate,
  type EstimateRecord,
  type SaveInput,
} from "./history";

interface EstimatesContextValue {
  records: EstimateRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  add: (input: SaveInput) => Promise<EstimateRecord | null>;
  remove: (id: string) => Promise<void>;
}

const EstimatesContext = createContext<EstimatesContextValue | null>(null);

// Loads the shared history once and keeps Create / Dashboard / History in sync
// without page reloads. Saving is best-effort — it never blocks the estimate UI.
export function EstimatesProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<EstimateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRecords(await listEstimates());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback<EstimatesContextValue["add"]>(async (input) => {
    try {
      const saved = await saveEstimate(input);
      setRecords((prev) => [saved, ...prev]);
      return saved;
    } catch {
      // Saving to history is best-effort; never surface as a blocking error.
      return null;
    }
  }, []);

  const remove = useCallback<EstimatesContextValue["remove"]>(
    async (id) => {
      setRecords((prev) => prev.filter((r) => r.id !== id)); // optimistic
      try {
        await deleteEstimate(id);
      } catch {
        await refresh(); // re-sync on failure
      }
    },
    [refresh]
  );

  return (
    <EstimatesContext.Provider
      value={{ records, loading, error, refresh, add, remove }}
    >
      {children}
    </EstimatesContext.Provider>
  );
}

export function useEstimates(): EstimatesContextValue {
  const ctx = useContext(EstimatesContext);
  if (!ctx) {
    throw new Error("useEstimates must be used within an EstimatesProvider");
  }
  return ctx;
}
