import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, ClipboardList, Crown, ExternalLink, LayoutDashboard, LogOut, Receipt } from "lucide-react";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Clientes & cobranças", group: "PAINEL" as const },
  { to: "/atividade", icon: ClipboardList, label: "Atividade", group: "PAINEL" as const },
  { to: "/pagamentos", icon: Receipt, label: "Pagamentos", group: "MARKETPLACE" as const },
  { to: "/ver-site", icon: ExternalLink, label: "Ver site", group: "MARKETPLACE" as const },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="p-5 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
          <Crown className="size-5" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold leading-none">
            admgourmet<span className="text-primary">.</span>
          </div>
          <div className="mt-1 inline-flex text-[10px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
            Admin
          </div>
        </div>
      </div>

      <div className="px-3 mt-2">
        {(["PAINEL", "MARKETPLACE"] as const).map((group) => (
          <div key={group}>
            <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground px-3 py-2 mt-2">
              {group}
            </div>
            <nav className="space-y-1">
              {items.filter((i) => i.group === group).map((it) => {
                const active = pathname === it.to;
                const Icon = it.icon;
                return (
                  <Link
                    key={it.to}
                    to={it.to}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1 text-left">{it.label}</span>
                    {active && <ChevronRight className="size-4" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted">
          <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">F</div>
          <div className="text-sm">
            <div className="font-medium">Felipe</div>
            <div className="text-muted-foreground text-xs">@felipe</div>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-2">
          <LogOut className="size-4" /> Sair
        </button>
      </div>
    </aside>
  );
}

export function PageHeader({
  crumb,
  title,
  actions,
}: {
  crumb: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-border bg-surface/60 backdrop-blur">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Painel</span>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{crumb}</span>
        </div>
        <h1 className="font-display text-xl font-semibold mt-0.5">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
