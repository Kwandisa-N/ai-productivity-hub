import { Link } from "@tanstack/react-router";
import { Menu, LayoutDashboard, Mail, NotebookPen, Search, Sparkles, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/meeting-summarizer", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/research-assistant", label: "Research Assistant", icon: Search },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-surface-muted transition-all duration-200 hover:bg-white/10 hover:text-surface-foreground"
          activeProps={{ className: "bg-primary/20 text-surface-foreground" }}
        >
          <Icon className="size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-hero shadow-lift">
          <Sparkles className="size-5 text-primary-foreground" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-surface-foreground">AI Workplace</span>
          <span className="block text-xs text-surface-muted">Productivity Assistant</span>
        </span>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
        <ShieldCheck className="mb-2 size-4 text-primary-glow" />
        <p className="text-xs leading-relaxed text-surface-muted">
          AI-generated content may contain errors. Always review before sending or sharing.
        </p>
      </div>
    </div>
  );
}

export function DashboardShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-surface lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-10">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-0 bg-surface p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarContent onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
            </div>
          </div>
        </header>

        <main className={cn("flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10")}>
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
