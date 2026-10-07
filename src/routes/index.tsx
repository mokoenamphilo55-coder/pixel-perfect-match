import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, NotebookPen, CalendarClock, ArrowRight, Clock } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { readActivity, type Activity } from "@/lib/use-ai";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Research Assistant" },
      { name: "description", content: "Write emails, summarize meetings and plan your week with one AI assistant." },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Write emails, summarize meetings and plan your week with one AI assistant." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Turn rough notes into a polished email — formal, friendly or persuasive." },
  { to: "/meetings", icon: NotebookPen, title: "Meeting Summarizer", desc: "Paste long notes, get decisions, action items and deadlines." },
  { to: "/planner", icon: CalendarClock, title: "Task Planner", desc: "Prioritize tasks and get a realistic daily or weekly timetable." },
] as const;

const labels = { email: "Email", summary: "Meeting summary", planner: "Plan" };
const links = { email: "/email", summary: "/meetings", planner: "/planner" } as const;

function Dashboard() {
  const [activity, setActivity] = useState<Activity[]>([]);
  useEffect(() => setActivity(readActivity()), []);
  const hour = new Date().getHours();

  return (
    <div className="space-y-8">
      <section className="bg-hero rounded-2xl p-6 text-primary-foreground shadow-card md:p-10">
        <p className="text-sm opacity-80">{hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}</p>
        <h1 className="mt-1 max-w-xl text-3xl font-semibold md:text-5xl">What would you like to get done today?</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-medium transition hover:bg-primary-foreground/25">
              <f.icon className="size-4" /> {f.title.replace("Smart ", "")}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="group rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40">
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"><f.icon className="size-5" /></div>
            <h2 className="mt-4 text-xl font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          {activity.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Nothing yet — your generated emails, summaries and plans will show up here.</p>
          ) : (
            <ul className="mt-3 divide-y">
              {activity.map((a) => (
                <li key={a.id}>
                  <Link to={links[a.tool]} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-primary">
                    <span className="min-w-0"><span className="mr-2 rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">{labels[a.tool]}</span><span className="truncate">{a.title}</span></span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" />{new Date(a.at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="text-xl font-semibold">Quick actions</h2>
            <div className="mt-3 grid gap-2 text-sm">
              <Link to="/email" className="rounded-lg bg-muted px-3 py-2 hover:bg-accent">✉️ Draft a follow-up email</Link>
              <Link to="/meetings" className="rounded-lg bg-muted px-3 py-2 hover:bg-accent">📝 Summarize today's meeting</Link>
              <Link to="/planner" className="rounded-lg bg-muted px-3 py-2 hover:bg-accent">🗓️ Plan my week</Link>
            </div>
          </div>
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}
