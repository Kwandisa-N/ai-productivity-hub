import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, Search, ArrowRight, ShieldCheck } from "lucide-react";

import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Work smarter with AI" },
      {
        name: "description",
        content:
          "A lightweight AI dashboard to draft professional emails, summarize meeting notes, and research topics in seconds.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate everyday workplace tasks with AI: emails, meeting summaries, and research.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    to: "/email-generator",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Create polished professional emails in seconds with AI.",
    cta: "Generate Email",
  },
  {
    to: "/meeting-summarizer",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description:
      "Turn lengthy meeting notes into concise summaries, decisions, action items, and deadlines.",
    cta: "Summarize Notes",
  },
  {
    to: "/research-assistant",
    icon: Search,
    title: "AI Research Assistant",
    description: "Summarize topics and articles while generating useful insights and recommendations.",
    cta: "Start Research",
  },
] as const;

function Index() {
  return (
    <DashboardShell title="Dashboard" description="Your AI toolkit for everyday workplace tasks">
      <section className="overflow-hidden rounded-3xl bg-gradient-hero px-6 py-12 text-primary-foreground shadow-lift sm:px-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
          AI Workplace Productivity Assistant
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl lg:text-5xl">Work smarter with AI</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
          Automate everyday workplace tasks, create professional content, and turn information into useful
          insights.
        </p>
      </section>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, description, cta }) => (
          <article
            key={to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <Button asChild className="mt-6 w-full">
              <Link to={to}>
                {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </article>
        ))}
      </div>

      <section className="mt-8 flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Responsible AI</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            AI-generated content may contain errors or inaccuracies. Always review and verify AI-generated
            information before using, sending, or sharing it. Avoid entering confidential or personal
            information — nothing you type is stored, everything stays in your browser session.
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}
