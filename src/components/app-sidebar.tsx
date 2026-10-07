import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, NotebookPen, CalendarClock, Settings, ShieldCheck, Sparkles } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const tools = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meetings", icon: NotebookPen },
  { title: "Task Planner", url: "/planner", icon: CalendarClock },
] as const;
const more = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Responsible AI / Help", url: "/help", icon: ShieldCheck },
] as const;

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const render = (items: typeof tools | typeof more) =>
    items.map((it) => (
      <SidebarMenuItem key={it.url}>
        <SidebarMenuButton asChild isActive={path === it.url} tooltip={it.title}>
          <Link to={it.url} onClick={() => setOpenMobile(false)}>
            <it.icon />
            <span>{it.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Sparkles className="size-4" /></div>
          {!collapsed && <span className="font-display text-lg font-semibold leading-tight">Research<br /><span className="text-sm font-normal opacity-70">Assistant</span></span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu>{render(tools)}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>More</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu>{render(more)}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">{sub}</p>
    </div>
  );
}
