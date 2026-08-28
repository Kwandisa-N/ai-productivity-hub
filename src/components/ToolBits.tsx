import { Copy, RefreshCw, Trash2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border bg-primary-soft/60 px-4 py-3 ${className}`}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        AI-generated content may contain errors or inaccuracies. Always review and verify AI-generated
        information before using, sending, or sharing it.
      </p>
    </div>
  );
}

export function ResultActions({
  onCopy,
  onRegenerate,
  onClear,
  loading,
}: {
  onCopy: () => void;
  onRegenerate: () => void;
  onClear: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" size="sm" onClick={onCopy} className="transition-all hover:shadow-card">
        <Copy className="size-4" /> Copy
      </Button>
      <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Regenerate
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
        <Trash2 className="size-4" /> Clear
      </Button>
    </div>
  );
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Couldn't copy — please select the text and copy manually.");
  }
}

export function EmptyState({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
