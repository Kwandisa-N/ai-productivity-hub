import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, CheckCircle2, ListChecks, Loader2, NotebookPen, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/DashboardShell";
import { Disclaimer, EmptyState, ResultActions, copyText } from "@/components/ToolBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Turn lengthy meeting notes into concise summaries, key decisions, action items, and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Concise summaries, decisions, action items, and deadlines from raw meeting notes.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

type Action = { task: string; owner: string; deadline: string };
type Result = { summary: string; decisions: string[]; actionItems: Action[]; deadlines: string[] };

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-accent-foreground">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ListEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">None mentioned in these notes.</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
          <Input
            value={item}
            onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
            className="border-transparent bg-transparent px-2 shadow-none transition-colors hover:border-border focus-visible:border-input"
          />
        </li>
      ))}
    </ul>
  );
}

function toPlainText(r: Result) {
  return [
    `SUMMARY\n${r.summary}`,
    `KEY DECISIONS\n${r.decisions.map((d) => `- ${d}`).join("\n") || "- None"}`,
    `ACTION ITEMS\n${r.actionItems.map((a) => `- ${a.task} | Owner: ${a.owner} | Deadline: ${a.deadline}`).join("\n") || "- None"}`,
    `DEADLINES\n${r.deadlines.map((d) => `- ${d}`).join("\n") || "- None"}`,
  ].join("\n\n");
}

function MeetingSummarizer() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
    if (notes.trim().length < 20) {
      setError("Paste at least a few lines of meeting notes so the summary is useful.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await run({ data: { notes } });
      setResult({
        summary: data.summary ?? "",
        decisions: data.decisions ?? [],
        actionItems: data.actionItems ?? [],
        deadlines: data.deadlines ?? [],
      });
      toast.success("Meeting summarized");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell
      title="Meeting Notes Summarizer"
      description="Turn lengthy notes into summaries, decisions, action items, and deadlines"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={12}
            placeholder={"Paste your raw meeting notes here — attendees, discussion points, decisions, who committed to what, and any dates mentioned."}
            className="mt-2 min-h-60 leading-relaxed"
          />
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={handleSummarize} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Summarizing…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Summarize Meeting
                </>
              )}
            </Button>
            <span className="text-xs text-muted-foreground">{notes.trim().length} characters</span>
          </div>
        </section>

        {loading && !result ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-card">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-foreground">Reading your notes…</p>
          </div>
        ) : result ? (
          <div className="space-y-5">
            <Section icon={<NotebookPen className="size-4" />} title="Summary">
              <Textarea
                value={result.summary}
                onChange={(e) => setResult({ ...result, summary: e.target.value })}
                className="min-h-28 leading-relaxed"
              />
            </Section>

            <Section icon={<CheckCircle2 className="size-4" />} title="Key Decisions">
              <ListEditor items={result.decisions} onChange={(decisions) => setResult({ ...result, decisions })} />
            </Section>

            <Section icon={<ListChecks className="size-4" />} title="Action Items">
              {result.actionItems.length ? (
                <div className="space-y-3">
                  {result.actionItems.map((a, i) => (
                    <div
                      key={i}
                      className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
                    >
                      {(["task", "owner", "deadline"] as const).map((field) => (
                        <div key={field} className="space-y-1">
                          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {field === "owner" ? "Responsible" : field}
                          </span>
                          <Input
                            value={a[field]}
                            onChange={(e) =>
                              setResult({
                                ...result,
                                actionItems: result.actionItems.map((item, j) =>
                                  j === i ? { ...item, [field]: e.target.value } : item,
                                ),
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No action items were mentioned.</p>
              )}
            </Section>

            <Section icon={<CalendarClock className="size-4" />} title="Deadlines">
              <ListEditor items={result.deadlines} onChange={(deadlines) => setResult({ ...result, deadlines })} />
            </Section>

            <ResultActions
              loading={loading}
              onCopy={() => copyText(toPlainText(result))}
              onRegenerate={handleSummarize}
              onClear={() => {
                setResult(null);
                setNotes("");
              }}
            />
          </div>
        ) : (
          <EmptyState
            icon={<NotebookPen className="size-5" />}
            title="Your structured summary will appear here"
            hint="Paste your meeting notes above and we'll pull out the summary, decisions, action items, and deadlines."
          />
        )}

        <Disclaimer />
      </div>
    </DashboardShell>
  );
}
