import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight, ArrowDownRight, Filter, KeyRound, RefreshCw, Search, Send,
  CheckCircle2, AlertTriangle, XCircle, CreditCard, UserPlus, Settings2,
  Sparkles, Activity as ActivityIcon, Clock,
} from "lucide-react";
import { Sidebar, PageHeader } from "@/components/sidebar";

export const Route = createFileRoute("/atividade")({
  head: () => ({
    meta: [
      { title: "Atividade — admgourmet" },
      { name: "description", content: "Linha do tempo de eventos: pagamentos, renovações, integrações e alertas do sistema." },
    ],
  }),
  component: Page,
});

type EventType = "payment" | "renewal" | "signup" | "alert" | "integration" | "settings";
type Event = {
  id: string;
  type: EventType;
  title: string;
  client: string;
  amount?: number;
  meta?: string;
  time: string;
  date: string; // grouping
};

const EVENTS: Event[] = [
  { id: "1", type: "payment", title: "PIX confirmado", client: "Pizzaria Don Lucca", amount: 320, time: "há 4 min", date: "Hoje" },
  { id: "2", type: "renewal", title: "Renovação automática trimestral", client: "Espetinho Calory", amount: 480, time: "há 32 min", date: "Hoje" },
  { id: "3", type: "alert", title: "Aviso de vencimento enviado", client: "Burger House Centro", meta: "vence em 3 dias", time: "há 1h", date: "Hoje" },
  { id: "4", type: "integration", title: "Integração Balança ativada", client: "Açaí Tropical", meta: "+ R$ 40/mês", time: "há 3h", date: "Hoje" },
  { id: "5", type: "signup", title: "Novo cliente cadastrado", client: "Sushi Sakura", meta: "Plano anual", time: "há 5h", date: "Hoje" },
  { id: "6", type: "alert", title: "Pagamento vencido", client: "Tapioca da Vila", meta: "atraso 4 dias", time: "ontem", date: "Ontem" },
  { id: "7", type: "payment", title: "PIX confirmado", client: "Marmita Express", amount: 130, time: "ontem", date: "Ontem" },
  { id: "8", type: "settings", title: "Contra-senha gerada", client: "Espetinho Calory", time: "ontem", date: "Ontem" },
  { id: "9", type: "renewal", title: "Renovação manual", client: "Padaria Trigo Dourado", amount: 110, time: "2 dias atrás", date: "Esta semana" },
  { id: "10", type: "integration", title: "Auto-atendimento desativado", client: "Burger House Centro", meta: "− R$ 40/mês", time: "3 dias atrás", date: "Esta semana" },
];

const TYPE_META: Record<EventType, { icon: any; tone: string; label: string }> = {
  payment:     { icon: CreditCard,    tone: "bg-success/15 text-success",          label: "Pagamento" },
  renewal:     { icon: RefreshCw,     tone: "bg-primary/15 text-primary",          label: "Renovação" },
  signup:      { icon: UserPlus,      tone: "bg-accent text-accent-foreground",    label: "Cadastro" },
  alert:       { icon: AlertTriangle, tone: "bg-warning/20 text-warning-foreground", label: "Alerta" },
  integration: { icon: Sparkles,      tone: "bg-primary/10 text-primary",          label: "Integração" },
  settings:    { icon: Settings2,     tone: "bg-muted text-muted-foreground",      label: "Sistema" },
};

const FILTERS: { key: "todos" | EventType; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "payment", label: "Pagamentos" },
  { key: "renewal", label: "Renovações" },
  { key: "alert", label: "Alertas" },
  { key: "integration", label: "Integrações" },
  { key: "signup", label: "Cadastros" },
];

function Page() {
  const [filter, setFilter] = useState<"todos" | EventType>("todos");
  const [query, setQuery] = useState("");

  const filtered = EVENTS.filter((e) => {
    if (filter !== "todos" && e.type !== filter) return false;
    if (query && !`${e.title} ${e.client}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const groups = filtered.reduce<Record<string, Event[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});

  const stats = {
    total: EVENTS.length,
    payments: EVENTS.filter(e => e.type === "payment").length,
    alerts: EVENTS.filter(e => e.type === "alert").length,
    revenue: EVENTS.filter(e => e.type === "payment").reduce((s, e) => s + (e.amount ?? 0), 0),
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <PageHeader
          crumb="Atividade"
          title="Linha do tempo"
          actions={
            <>
              <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg border border-border hover:bg-muted">
                <RefreshCw className="size-4" /> Atualizar
              </button>
              <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-95">
                Exportar
              </button>
            </>
          }
        />

        <div className="flex-1 overflow-y-auto px-8 py-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Filter bar */}
            <div className="card-soft p-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar evento ou cliente…"
                  className="w-full h-10 pl-9 pr-3 bg-surface-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg overflow-x-auto">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-3 h-8 rounded-md text-xs font-medium transition whitespace-nowrap ${
                      filter === f.key ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button className="h-10 w-10 grid place-items-center rounded-lg border border-border hover:bg-muted">
                <Filter className="size-4" />
              </button>
            </div>

            {/* Timeline */}
            {Object.entries(groups).map(([date, events]) => (
              <div key={date}>
                <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="size-3" /> {date.toUpperCase()}
                  <span className="text-muted-foreground/60">· {events.length}</span>
                </div>
                <div className="card-soft divide-y divide-border">
                  {events.map((e) => {
                    const meta = TYPE_META[e.type];
                    const Icon = meta.icon;
                    return (
                      <div key={e.id} className="p-4 flex items-start gap-4 hover:bg-muted/40 transition">
                        <div className={`size-10 rounded-xl grid place-items-center shrink-0 ${meta.tone}`}>
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{e.title}</span>
                            <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {meta.label.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {e.client}{e.meta ? ` · ${e.meta}` : ""}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {e.amount && (
                            <div className="font-display font-semibold text-sm">R$ {e.amount.toLocaleString("pt-BR")}</div>
                          )}
                          <div className="text-xs text-muted-foreground">{e.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Side stats */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="card-soft p-5">
              <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
                <ActivityIcon className="size-3.5" /> ATIVIDADE 24H
              </div>
              <div className="mt-3 font-display text-4xl font-semibold">{stats.total}</div>
              <div className="mt-1 text-xs text-success inline-flex items-center gap-1">
                <ArrowUpRight className="size-3" /> +28% vs ontem
              </div>
              <div className="mt-4 flex items-end gap-1 h-12">
                {[2, 4, 3, 6, 5, 8, 7, 9, 6, 10, 8, 11].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${h * 8}%` }} />
                ))}
              </div>
            </div>

            <StatTile icon={<CheckCircle2 className="size-3.5" />} label="PAGAMENTOS HOJE" value={`R$ ${stats.revenue}`} sub={`${stats.payments} confirmados`} tone="text-success" />
            <StatTile icon={<AlertTriangle className="size-3.5" />} label="ALERTAS ABERTOS" value={stats.alerts} sub="Requer atenção" tone="text-warning-foreground" />
            <StatTile icon={<XCircle className="size-3.5" />} label="FALHAS DE COBRANÇA" value={1} sub="Última: ontem" tone="text-destructive" />

            <div className="card-soft p-5">
              <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">AÇÕES SUGERIDAS</div>
              <div className="mt-3 space-y-2">
                <SuggestedAction icon={<Send className="size-3.5" />} text="Enviar PIX para 2 vencidos" />
                <SuggestedAction icon={<KeyRound className="size-3.5" />} text="Regenerar contra-senha expirada" />
                <SuggestedAction icon={<RefreshCw className="size-3.5" />} text="Renovar 1 plano trimestral" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatTile({ icon, label, value, sub, tone }: any) {
  return (
    <div className="card-soft p-5">
      <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className={`mt-3 font-display text-3xl font-semibold ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function SuggestedAction({ icon, text }: any) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition text-left">
      <span className="size-7 rounded-md bg-primary/10 text-primary grid place-items-center">{icon}</span>
      <span className="text-sm flex-1">{text}</span>
      <ArrowUpRight className="size-3.5 text-muted-foreground" />
    </button>
  );
}
