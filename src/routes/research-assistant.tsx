import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Lightbulb, Loader2, Search, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/DashboardShell";
import { Disclaimer, EmptyState, ResultActions, copyText } from "@/components/ToolBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Summarize topics and articles, then get key insights, recommendations, and considerations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Summarize topics and articles while generating useful insights and recommendations.",
      },
    ],
  }),
  component: ResearchAssistant;
});

type Result = { summary: string; insights: string[]; recommendations: string[]; considerations: string[] };

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
  if (!items.length) return <p className="text-sm text-muted-foreground">Nothing to show here.</p>;
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
    `KEY INSIGHTS\n${r.insights.map((i) => `- ${i}`).join("\n")}`,
    `RECOMMENDATIONS\n${r.recommendations.map((i) => `- ${i}`).join("\n")}`,
    `IMPORTANT CONSIDERATIONS\n${r.considerations.map((i) => `- ${i}`).join("\n")}`,
  ].join("\n\n");
}

function ResearchAssistant() {
  const run = useServerFn(runResearch);
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleResearch() {
    if (topic.trim().length < 3) {
      setError("Enter a research topic or question first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await run({ data: { topic, source } });
      setResult({
        summary: data.summary ?? "",
        insights: data.insights ?? [],
        recommendations: data.recommendations ?? [],
        considerations: data.considerations ?? [],
      });
      toast.success("Research ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell
      title="AI Research Assistant"
      description="Summarize topics and articles into insights and recommendations"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="topic">Research topic or question</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How are small businesses using AI to improve customer service?"
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Article or text content (optional)</Label>
              <Textarea
                id="source"
                rows={8}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Paste an article, report extract, or notes to ground the research in your own source material."
                className="min-h-40 leading-relaxed"
              />
            </div>
            <Button onClick={handleResearch} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Researching…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Research with AI
                </>
              )}
            </Button>
          </div>
        </section>

        {loading && !result ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-card">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="mt-4 text-sm font-medium text-foreground">Gathering insights…</p>
          </div>
        ) : result ? (
          <div className="space-y-5">
            <Section icon={<Search className="size-4" />} title="Summary">
              <Textarea
                value={result.summary}
                onChange={(e) => setResult({ ...result, summary: e.target.value })}
                className="min-h-32 leading-relaxed"
              />
            </Section>
            <Section icon={<Lightbulb className="size-4" />} title="Key Insights">
              <ListEditor items={result.insights} onChange={(insights) => setResult({ ...result, insights })} />
            </Section>
            <Section icon={<Target className="size-4" />} title="Recommendations">
              <ListEditor
                items={result.recommendations}
                onChange={(recommendations) => setResult({ ...result, recommendations })}
              />
            </Section>
            <Section icon={<AlertTriangle className="size-4" />} title="Important Considerations">
              <ListEditor
                items={result.considerations}
                onChange={(considerations) => setResult({ ...result, considerations })}
              />
            </Section>
            <ResultActions
              loading={loading}
              onCopy={() => copyText(toPlainText(result))}
              onRegenerate={handleResearch}
              onClear={() => {
                setResult(null);
                setTopic("");
                setSource("");
              }}
            />
          </div>
        ) : (
          <EmptyState
            icon={<Search className="size-5" />}
            title="Your research briefing will appear here"
            hint="Enter a topic or paste an article, and we'll return a summary, insights, recommendations, and caveats."
          />
        )}

        <Disclaimer />
      </div>
    </DashboardShell>
  );
}
