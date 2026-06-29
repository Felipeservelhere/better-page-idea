import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Bell, Plus, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  KeyRound, RefreshCw, Send, CalendarClock, CheckCircle2, AlertTriangle,
  XCircle, Wallet, Users, TrendingUp, Sparkles, ChevronRight, Crown,
  LayoutDashboard, ClipboardList, Receipt, ExternalLink, LogOut,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clientes & Assinaturas — admgourmet" },
      { name: "description", content: "Command center para gerenciar clientes, validades e cobranças PIX." },
    ],
  }),
  component: Page,
});

type Status = "ativo" | "vencendo" | "vencido" | "pendencia" | "sem_data";

type Client = {
  id: string;
  name: string;
  slug: string;
  city: string;
  plan: "mensal" | "trimestral" | "anual";
  mrr: number;
  daysLeft: number | null;
  validUntil: string;
  status: Status;
  integrations: string[];
  lastPayment: string | null;
  health: number; // 0-100
  pix: number;
  email: string;
  cnpj: string;
};

const CLIENTS: Client[] = [
  { id: "1", name: "ESPETINHO CALORY", slug: "espetinhocalory", city: "PEROLA/PR", plan: "trimestral", mrr: 160, daysLeft: 109, validUntil: "16/10/2026", status: "ativo", integrations: ["Balança"], lastPayment: "16/07/2026", health: 92, pix: 0, email: "felipeservelhere.calory@gmail.com", cnpj: "10.254.864/0001-93" },
  { id: "2", name: "Burger House Centro", slug: "burgerhousecentro", city: "MARINGÁ/PR", plan: "mensal", mrr: 220, daysLeft: 3, validUntil: "02/07/2026", status: "vencendo", integrations: ["Cardápio", "Balança"], lastPayment: "02/06/2026", health: 64, pix: 1, email: "contato@burgerhouse.com", cnpj: "22.114.987/0001-12" },
  { id: "3", name: "Pizzaria Don Lucca", slug: "donlucca", city: "CASCAVEL/PR", plan: "anual", mrr: 320, daysLeft: 287, validUntil: "12/04/2027", status: "ativo", integrations: ["Cardápio", "Fiscal", "Auto-atendimento"], lastPayment: "12/04/2026", health: 98, pix: 0, email: "fin@donlucca.com.br", cnpj: "55.881.220/0001-44" },
  { id: "4", name: "Tapioca da Vila", slug: "tapiocadavila", city: "CURITIBA/PR", plan: "mensal", mrr: 90, daysLeft: -4, validUntil: "25/06/2026", status: "vencido", integrations: ["Cardápio"], lastPayment: "25/05/2026", health: 28, pix: 2, email: "vila@tapioca.com", cnpj: "11.330.776/0001-09" },
  { id: "5", name: "Açaí Tropical", slug: "acaitropical", city: "LONDRINA/PR", plan: "trimestral", mrr: 180, daysLeft: 41, validUntil: "10/08/2026", status: "ativo", integrations: ["Balança", "Auto-atendimento"], lastPayment: "10/05/2026", health: 88, pix: 0, email: "ola@acaitropical.com", cnpj: "44.991.002/0001-77" },
  { id: "6", name: "Marmita Express", slug: "marmitaexpress", city: "FOZ/PR", plan: "mensal", mrr: 130, daysLeft: 2, validUntil: "01/07/2026", status: "vencendo", integrations: ["Cardápio"], lastPayment: "01/06/2026", health: 58, pix: 1, email: "exp@marmita.com", cnpj: "78.221.334/0001-55" },
  { id: "7", name: "Sushi Sakura", slug: "sushisakura", city: "MARINGÁ/PR", plan: "anual", mrr: 380, daysLeft: 156, validUntil: "02/12/2026", status: "ativo", integrations: ["Cardápio", "Fiscal"], lastPayment: "02/01/2026", health: 95, pix: 0, email: "sakura@sushi.com", cnpj: "33.001.557/0001-08" },
  { id: "8", name: "Padaria Trigo Dourado", slug: "trigodourado", city: "TOLEDO/PR", plan: "mensal", mrr: 110, daysLeft: null, validUntil: "—", status: "sem_data", integrations: [], lastPayment: null, health: 0, pix: 0, email: "trigo@dourado.com", cnpj: "—" },
];

const STATUS_META: Record<Status, { label: string; dot: string; chip: string }> = {
  ativo:     { label: "Ativo",        dot: "bg-success",     chip: "bg-success/10 text-success" },
  vencendo:  { label: "Vencendo",     dot: "bg-warning",     chip: "bg-warning/15 text-warning-foreground" },
  vencido:   { label: "Vencido",      dot: "bg-destructive", chip: "bg-destructive/10 text-destructive" },
  pendencia: { label: "Pendência",    dot: "bg-primary",     chip: "bg-primary/10 text-primary" },
  sem_data:  { label: "Sem data",     dot: "bg-muted-foreground", chip: "bg-muted text-muted-foreground" },
};

function Page() {
  const [filter, setFilter] = useState<"todos" | Status>("todos");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>("2");

  const filtered = useMemo(() => {
    return CLIENTS.filter((c) => {
      if (filter !== "todos" && c.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.slug.includes(q) || c.city.toLowerCase().includes(q);
    });
  }, [filter, query]);

  const selected = CLIENTS.find((c) => c.id === selectedId) ?? CLIENTS[0];

  const metrics = useMemo(() => {
    const mrr = CLIENTS.filter(c => c.status !== "vencido" && c.status !== "sem_data").reduce((s, c) => s + c.mrr, 0);
    const ativos = CLIENTS.filter(c => c.status === "ativo").length;
    const vencendo = CLIENTS.filter(c => c.status === "vencendo").length;
    const vencidos = CLIENTS.filter(c => c.status === "vencido").length;
    const pix = CLIENTS.reduce((s, c) => s + c.pix, 0);
    return { mrr, ativos, vencendo, vencidos, pix, total: CLIENTS.length };
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 flex min-w-0">
        <section className="flex-1 min-w-0 flex flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <CommandStrip metrics={metrics} />
            <TimelineStrip />
            <WorkQueue
              filter={filter}
              setFilter={setFilter}
              query={query}
              setQuery={setQuery}
              clients={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </section>

        <DetailPanel client={selected} />
      </main>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar() {
  const items = [
    { icon: LayoutDashboard, label: "Clientes & cobranças", active: true },
    { icon: ClipboardList, label: "Atividade" },
    { icon: Receipt, label: "Pagamentos" },
    { icon: ExternalLink, label: "Ver site" },
  ];
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="p-5 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
          <Crown className="size-5" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold leading-none">admgourmet<span className="text-primary">.</span></div>
          <div className="mt-1 inline-flex text-[10px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">Admin</div>
        </div>
      </div>

      <div className="px-3 mt-2">
        <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground px-3 py-2">PAINEL</div>
        <nav className="space-y-1">
          {items.slice(0, 2).map((it) => (
            <NavItem key={it.label} {...it} />
          ))}
        </nav>
        <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground px-3 py-2 mt-4">MARKETPLACE</div>
        <nav className="space-y-1">
          {items.slice(2).map((it) => <NavItem key={it.label} {...it} />)}
        </nav>
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

function NavItem({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        active ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="size-4" />
      <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight className="size-4" />}
    </button>
  );
}

/* ---------------- Header ---------------- */
function Header() {
  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-border bg-surface/60 backdrop-blur">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Painel</span>
          <ChevronRight className="size-3" />
          <span className="text-foreground">Clientes & Assinaturas</span>
        </div>
        <h1 className="font-display text-xl font-semibold mt-0.5">Boa tarde, Felipe</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg border border-border hover:bg-muted">
          <KeyRound className="size-4" /> Contra-senha
        </button>
        <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg border border-border hover:bg-muted">
          <RefreshCw className="size-4" /> Atualizar
        </button>
        <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-95">
          <Plus className="size-4" /> Novo cliente
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-muted relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
        </button>
      </div>
    </header>
  );
}

/* ---------------- Command strip ---------------- */
function CommandStrip({ metrics }: { metrics: any }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4 card-soft p-5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 size-44 rounded-full bg-primary/10 blur-2xl" />
        <div className="flex items-center justify-between relative">
          <div className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1.5">
            <Wallet className="size-3.5" /> RECEITA RECORRENTE
          </div>
          <span className="text-xs text-success inline-flex items-center gap-1"><ArrowUpRight className="size-3" />+12,4%</span>
        </div>
        <div className="mt-3 font-display text-4xl font-semibold tracking-tight">
          R$ {metrics.mrr.toLocaleString("pt-BR")}<span className="text-base text-muted-foreground font-normal">/mês</span>
        </div>
        <div className="mt-4 flex items-end gap-1 h-10">
          {[40, 55, 48, 62, 70, 58, 75, 82, 78, 90, 95, 100].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-primary/80" style={{ height: `${h}%`, opacity: 0.3 + i * 0.06 }} />
          ))}
        </div>
      </div>

      <MiniCard
        icon={<Users className="size-3.5" />}
        label="ATIVOS"
        value={`${metrics.ativos}/${metrics.total}`}
        accent="text-success"
        trend="+1 esta semana"
      />
      <MiniCard
        icon={<CalendarClock className="size-3.5" />}
        label="VENCENDO ≤5D"
        value={metrics.vencendo}
        accent="text-warning-foreground"
        trend="Ação recomendada"
        highlight
      />
      <MiniCard
        icon={<XCircle className="size-3.5" />}
        label="VENCIDOS"
        value={metrics.vencidos}
        accent="text-destructive"
        trend="Cobrar agora"
      />
      <MiniCard
        icon={<Sparkles className="size-3.5" />}
        label="PENDÊNCIAS PIX"
        value={metrics.pix}
        accent="text-primary"
        trend="Aguardando"
      />
    </div>
  );
}

function MiniCard({ icon, label, value, accent, trend, highlight }: any) {
  return (
    <div className={`col-span-1.75 card-soft p-5 ${highlight ? "ring-2 ring-warning/40" : ""}`} style={{ gridColumn: "span 1.75 / span 1.75" }}>
      <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className={`mt-3 font-display text-3xl font-semibold ${accent}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{trend}</div>
    </div>
  );
}

/* ---------------- Timeline ---------------- */
function TimelineStrip() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const events: Record<number, { count: number; tone: "warn" | "ok" | "bad" }> = {
    2: { count: 1, tone: "warn" },
    3: { count: 1, tone: "warn" },
    5: { count: 1, tone: "warn" },
    9: { count: 2, tone: "ok" },
    14: { count: 1, tone: "ok" },
    18: { count: 1, tone: "ok" },
    22: { count: 3, tone: "ok" },
    27: { count: 1, tone: "ok" },
  };
  return (
    <div className="card-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold tracking-wider text-muted-foreground">PRÓXIMOS 30 DIAS</div>
          <div className="font-display text-base font-semibold mt-0.5">Calendário de vencimentos</div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" />Vencendo</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Renovação</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" />Vencido</span>
        </div>
      </div>
      <div className="grid grid-cols-30 gap-1" style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}>
        {days.map((d) => {
          const e = events[d];
          const tone = e?.tone === "warn" ? "bg-warning" : e?.tone === "bad" ? "bg-destructive" : "bg-success";
          return (
            <div key={d} className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className={`w-full rounded-md ${e ? tone : "bg-muted"} group-hover:opacity-80 transition`} style={{ height: e ? `${20 + e.count * 12}px` : "6px" }} />
              <div className={`text-[10px] ${d === 3 ? "text-warning-foreground font-semibold" : "text-muted-foreground"}`}>{d}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Work queue ---------------- */
function WorkQueue({ filter, setFilter, query, setQuery, clients, selectedId, onSelect }: any) {
  const tabs: { key: "todos" | Status; label: string; count?: number }[] = [
    { key: "todos", label: "Todos" },
    { key: "vencido", label: "Vencidos" },
    { key: "vencendo", label: "Vencendo" },
    { key: "ativo", label: "Ativos" },
    { key: "sem_data", label: "Sem data" },
  ];

  return (
    <div className="card-soft overflow-hidden">
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <div className="relative flex-1">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, slug, CNPJ ou cidade…"
            className="w-full h-10 pl-9 pr-3 bg-surface-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 h-8 rounded-md text-xs font-medium transition ${
                filter === t.key ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="h-10 w-10 grid place-items-center rounded-lg border border-border hover:bg-muted">
          <Filter className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground border-b border-border bg-surface-2/50">
        <div className="col-span-4">CLIENTE</div>
        <div className="col-span-2">STATUS / HEALTH</div>
        <div className="col-span-2">INTEGRAÇÕES</div>
        <div className="col-span-1">VALIDADE</div>
        <div className="col-span-1">DIAS</div>
        <div className="col-span-2 text-right">AÇÕES RÁPIDAS</div>
      </div>

      <ul>
        {clients.map((c: Client) => (
          <Row key={c.id} client={c} selected={c.id === selectedId} onSelect={() => onSelect(c.id)} />
        ))}
        {clients.length === 0 && (
          <li className="p-10 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</li>
        )}
      </ul>
    </div>
  );
}

function Row({ client, selected, onSelect }: { client: Client; selected: boolean; onSelect: () => void }) {
  const meta = STATUS_META[client.status];
  const daysClass =
    client.daysLeft === null ? "text-muted-foreground" :
    client.daysLeft < 0 ? "text-destructive" :
    client.daysLeft <= 5 ? "text-warning-foreground" : "text-foreground";

  return (
    <li>
      <button
        onClick={onSelect}
        className={`w-full grid grid-cols-12 items-center px-5 py-4 border-b border-border last:border-0 text-left transition ${
          selected ? "bg-primary/5" : "hover:bg-muted/50"
        }`}
      >
        <div className="col-span-4 flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm shrink-0">
            {client.name[0]}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate flex items-center gap-2">
              {client.name}
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">{client.plan}</span>
            </div>
            <div className="text-xs text-muted-foreground truncate">{client.slug} · {client.city}</div>
          </div>
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${meta.chip}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} /> {meta.label}
          </span>
          {client.health > 0 && (
            <div className="hidden xl:flex items-center gap-1">
              <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${client.health > 70 ? "bg-success" : client.health > 40 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${client.health}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{client.health}</span>
            </div>
          )}
        </div>

        <div className="col-span-2 flex flex-wrap gap-1">
          {client.integrations.length === 0 ? (
            <span className="text-xs text-muted-foreground">—</span>
          ) : client.integrations.slice(0, 2).map((i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-medium">{i}</span>
          ))}
          {client.integrations.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{client.integrations.length - 2}</span>
          )}
        </div>

        <div className="col-span-1 text-xs text-foreground">{client.validUntil}</div>
        <div className={`col-span-1 text-sm font-semibold ${daysClass}`}>
          {client.daysLeft === null ? "—" : client.daysLeft < 0 ? `${client.daysLeft}` : client.daysLeft}
        </div>

        <div className="col-span-2 flex justify-end gap-1">
          {(client.status === "vencendo" || client.status === "vencido" || client.pix > 0) && (
            <span className="h-8 px-2.5 inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-95">
              <Send className="size-3" /> Cobrar
            </span>
          )}
          <span className="h-8 px-2.5 inline-flex items-center gap-1 rounded-md border border-border text-xs hover:bg-muted">
            <RefreshCw className="size-3" /> Renovar
          </span>
          <span className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-muted">
            <MoreHorizontal className="size-3.5" />
          </span>
        </div>
      </button>
    </li>
  );
}

/* ---------------- Detail panel (always-visible) ---------------- */
function DetailPanel({ client }: { client: Client }) {
  const meta = STATUS_META[client.status];
  return (
    <aside className="w-[380px] shrink-0 border-l border-border bg-surface flex flex-col overflow-y-auto">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-semibold text-lg">
            {client.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-semibold truncate">{client.name}</div>
            <div className="text-xs text-muted-foreground truncate">{client.slug}</div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${meta.chip}`}>
            <span className={`size-1.5 rounded-full ${meta.dot}`} /> {meta.label}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button className="h-10 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-95">
            <Send className="size-3.5" /> PIX
          </button>
          <button className="h-10 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted">
            <RefreshCw className="size-3.5" /> Renovar
          </button>
          <button className="h-10 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted">
            <KeyRound className="size-3.5" /> Senha
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground mb-2">SAÚDE DA CONTA</div>
          <div className="flex items-end justify-between">
            <div className="font-display text-3xl font-semibold">{client.health}<span className="text-base text-muted-foreground">/100</span></div>
            <span className={`text-xs inline-flex items-center gap-1 ${client.health > 70 ? "text-success" : "text-warning-foreground"}`}>
              {client.health > 70 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {client.health > 70 ? "saudável" : "atenção"}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full ${client.health > 70 ? "bg-success" : client.health > 40 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${client.health}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoTile label="Plano" value={client.plan} />
          <InfoTile label="Validade" value={client.validUntil} />
          <InfoTile label="Dias restantes" value={client.daysLeft === null ? "—" : `${client.daysLeft} dia(s)`} />
          <InfoTile label="Mensalidade" value={`R$ ${client.mrr},00`} />
          <InfoTile label="CNPJ" value={client.cnpj} />
          <InfoTile label="Cidade" value={client.city} />
        </div>

        <InfoTile label="E-mail" value={client.email} full />

        <div>
          <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground mb-3 flex items-center justify-between">
            <span>INTEGRAÇÕES</span>
            <span className="text-muted-foreground/70">{client.integrations.length} ativa(s)</span>
          </div>
          <div className="space-y-2">
            {["Auto-atendimento", "Cardápio online", "Gestão fiscal", "Balança"].map((name) => {
              const active = client.integrations.some(i => name.toLowerCase().includes(i.toLowerCase()));
              return (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">+ R$ {40 + name.length * 2},00/mês</div>
                  </div>
                  <button className={`text-[10px] font-semibold px-2 py-1 rounded ${active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                    {active ? "ATIVO" : "INATIVO"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground mb-3">ÚLTIMOS EVENTOS</div>
          <ol className="relative border-l border-border pl-4 space-y-3">
            <Event icon={<CheckCircle2 className="size-3" />} tone="success" text="Pagamento confirmado" time={client.lastPayment ?? "—"} />
            <Event icon={<RefreshCw className="size-3" />} tone="muted" text="Renovação automática" time="há 3 meses" />
            <Event icon={<AlertTriangle className="size-3" />} tone="warning" text="Alerta de vencimento enviado" time="há 5 meses" />
          </ol>
        </div>
      </div>
    </aside>
  );
}

function InfoTile({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`p-3 rounded-lg bg-surface-2 border border-border ${full ? "col-span-2" : ""}`}>
      <div className="text-[10px] font-semibold tracking-wider text-muted-foreground">{label.toUpperCase()}</div>
      <div className="text-sm font-medium mt-1 break-words">{value}</div>
    </div>
  );
}

function Event({ icon, tone, text, time }: any) {
  const toneClass = tone === "success" ? "bg-success text-success-foreground" :
    tone === "warning" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground";
  return (
    <li className="relative">
      <span className={`absolute -left-[22px] top-0.5 size-4 rounded-full grid place-items-center ${toneClass}`}>{icon}</span>
      <div className="text-sm">{text}</div>
      <div className="text-xs text-muted-foreground">{time}</div>
    </li>
  );
}
