import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/DashboardShell";
import { Disclaimer, EmptyState, ResultActions, copyText } from "@/components/ToolBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Generate polished, professional workplace emails in seconds with a formal, friendly, or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Create polished professional emails in seconds with AI." },
    ],
  }),
  component: EmailGenerator,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailGenerator() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ recipient?: string; purpose?: string }>({});

  async function handleGenerate() {
    const next: typeof errors = {};
    if (!recipient.trim()) next.recipient = "Tell us who this email is for.";
    if (!purpose.trim()) next.purpose = "Describe what the email should achieve.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const text = await run({ data: { recipient, purpose, keyPoints, tone } });
      setResult(text);
      toast.success("Email drafted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResult("");
    setRecipient("");
    setPurpose("");
    setKeyPoints("");
    setErrors({});
  }

  return (
    <DashboardShell
      title="Smart Email Generator"
      description="Create polished professional emails in seconds with AI"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / Audience</Label>
              <Input
                id="recipient"
                placeholder="e.g. Head of Operations, new client, whole team"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              {errors.recipient && <p className="text-xs text-destructive">{errors.recipient}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Textarea
                id="purpose"
                rows={3}
                placeholder="e.g. Request a project deadline extension of two weeks"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
              {errors.purpose && <p className="text-xs text-destructive">{errors.purpose}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Key points (optional)</Label>
              <Textarea
                id="points"
                rows={5}
                placeholder={"e.g.\n- Supplier delay of 10 days\n- Revised delivery date 14 March\n- No budget impact"}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={loading} size="lg" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Generate Email
                </>
              )}
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          {loading && !result ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-card">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium text-foreground">Writing your email…</p>
              <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
            </div>
          ) : result ? (
            <>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Your draft (editable)</h2>
                <Textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="min-h-100 resize-y font-normal leading-relaxed"
                />
                <div className="mt-4">
                  <ResultActions
                    loading={loading}
                    onCopy={() => copyText(result)}
                    onRegenerate={handleGenerate}
                    onClear={() => setResult("")}
                  />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground">
                Reset the whole form
              </Button>
            </>
          ) : (
            <EmptyState
              icon={<Mail className="size-5" />}
              title="Your email will appear here"
              hint="Fill in the details on the left and generate a draft you can edit before sending."
            />
          )}
          <Disclaimer />
        </section>
      </div>
    </DashboardShell>
  );
}
