import { ArrowRight } from "../lib/icons";
import { PremiumButton } from "./ui/PremiumButton";

interface Props {
  requirement: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function RequirementForm({
  requirement,
  onChange,
  onSubmit,
  loading,
}: Props) {
  const canSubmit = !loading && requirement.trim().length > 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl/Cmd + Enter submits.
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canSubmit) {
      onSubmit();
    }
  }

  return (
    <div>
      <label htmlFor="requirement" className="kicker mb-2 block">
        Requirement
      </label>
      <textarea
        id="requirement"
        rows={4}
        className="input min-h-[120px] resize-y leading-relaxed"
        placeholder="e.g. Add a new table CUSTOMER_ORDERS sourced from AS400 into Prod1"
        value={requirement}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <div className="mt-4 flex items-center gap-3">
        <PremiumButton
          variant="accent"
          onClick={onSubmit}
          loading={loading}
          disabled={!canSubmit}
          iconRight={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
        >
          {loading ? "Estimating…" : "Generate estimate"}
        </PremiumButton>
        <span className="text-[12px] text-mute">Ctrl / ⌘ + Enter</span>
      </div>
    </div>
  );
}
