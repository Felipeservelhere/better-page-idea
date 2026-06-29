import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, Copy, Download, Filter,
  MoreHorizontal, RefreshCw, Search, Send, TrendingUp, Wallet, XCircle,
} from "lucide-react";
import { Sidebar, PageHeader } from "@/components/sidebar";

export const Route = createFileRoute("/pagamentos")({
  head: () => ({
    meta: [
      { title: "Pagamentos — admgourmet" },
      { name: "description", content: "Conciliação de pagamentos PIX, recibos e fluxo de caixa do marketplace." },
    ],
  }),
  component: Page,
});

type PStatus = "pago" | "pendente" | "falha";
type Payment = {
  id: string;
  client: string;
  slug: string;
  amount: number;
  method: "PIX" | "Cartão" | "Boleto";
  status: PStatus;
  date: string;
  plan: string;
};

const PAYMENTS: Payment[] = [
  { id: "PAY-9821", client: "Pizzaria Don Lucca", slug: "donlucca", amount: 320, method: "PIX", status: "pago", date: "Hoje · 14:32", plan: "Anual" },
  { id: "PAY-9820", client: "Espetinho Calory", slug: "espetinhocalory", amount: 480, method: "PIX", status: "pago", date: "Hoje · 13:58", plan: "Trimestral" },
  { id: "PAY-9819", client: "Açaí Tropical", slug: "acaitropical", amount: 180, method: "Cartão", status: "pago", date: "Hoje · 11:04", plan: "Trimestral" },
  { id: "PAY-9818", client: "Burger House Centro", slug: "burgerhousecentro", amount: 220, method: "PIX", status: "pendente", date: "Hoje · 09:12", plan: "Mensal" },
  { id: "PAY-9817", client: "Marmita Express", slug: "marmitaexpress", amount: 130, method: "PIX", status: "pago", date: "Ontem · 18:44", plan: "Mensal" },
  { id: "PAY-9816", client: "Sushi Sakura", slug: "sushisakura", amount: 380, method: "Boleto", status: "pago", date: "Ontem · 16:21", plan: "Anual" },
  { id: "PAY-9815", client: "Tapioca da Vila", slug: "tapiocadavila", amount: 90, method: "PIX", status: "falha", date: "Ontem · 10:08", plan: "Mensal" },
  { id: "PAY-9814", client: "Padaria Trigo Dourado", slug: "trigodourado", amount: 110, method: "PIX", status: "pendente", date: "2 dias · 22:33", plan: "Mensal" },
];

const ST_META: Record<PStatus, { label: string; chip: string; dot: string }> = {
  pago:     { label: "Pago",     chip: "bg-success/10 text-success",                 dot: "bg-success" },
  pendente: { label: "Pendente", chip: "bg-warning/15 text-warning-foreground",      dot: "bg-warning" },
  falha:    { label: "Falha",    chip: "bg-destructive/10 text-destructive",         dot: "bg-destructive" },
};

function Page() {
  const [filter, setFilter] = useState<"todos" | PStatus>("todos");
  const [query, setQuery] = useState("");

  const filtered = PAYMENTS.filter((p) => {
    if (filter !== "todos" && p.status !== filter) return false;
    if (query && !`${p.client} ${p.id} ${p.slug}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const recebido = PAYMENTS.filter(p => p.status === "pago").reduce((s, p) => s + p.amount, 0);
  const pendente = PAYMENTS.filter(p => p.status === "pendente").reduce((s, p) => s + p.amount, 0);
  const falhou   = PAYMENTS.filter(p => p.status === "falha").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <PageHeader
          crumb="Pagamentos"
          title="Conciliação financeira"
          actions={
            <>
              <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg border border-border hover:bg-muted">
                <Download className="size-4" /> Exportar CSV
              </button>
              <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-95">
                <Send className="size-4" /> Cobrar em lote
              </button>
            </>
          }
        />

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Top KPIs with cashflow chart */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6 card-soft p-5 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 size-48 rounded-full bg-success/10 blur-2xl" />
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
                  <Wallet className="size-3.5" /> FLUXO DOS ÚLTIMOS 14 DIAS
                </div>
                <span className="text-xs text-success inline-flex items-center gap-1"><ArrowUpRight className="size-3" />+R$ 2.140</span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <div className="font-display text-4xl font-semibold">R$ {recebido.toLocaleString("pt-BR")}</div>
                <div className="text-sm text-muted-foreground">recebido</div>
              </div>
              <CashflowChart />
            </div>

            <KpiTile icon={<CheckCircle2 className="size-3.5" />} label="RECEBIDO HOJE" value={`R$ ${recebido}`} sub={`${PAYMENTS.filter(p => p.status === "pago").length} pagamentos`} tone="text-success" trend={<><ArrowUpRight className="size-3" />+12%</>} />
            <KpiTile icon={<Clock className="size-3.5" />} label="PENDENTE" value={`R$ ${pendente}`} sub="Aguardando confirmação" tone="text-warning-foreground" />
            <KpiTile icon={<XCircle className="size-3.5" />} label="FALHAS" value={`R$ ${falhou}`} sub="Requer nova cobrança" tone="text-destructive" trend={<><ArrowDownRight className="size-3" />-1</>} />
          </div>

          {/* Methods breakdown */}
          <div className="grid grid-cols-12 gap-4">
            <MethodCard label="PIX" share={68} amount={1430} count={5} />
            <MethodCard label="Cartão" share={22} amount={460} count={2} />
            <MethodCard label="Boleto" share={10} amount={210} count={1} />
            <div className="col-span-12 lg:col-span-3 card-soft p-5">
              <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
                <TrendingUp className="size-3.5" /> TICKET MÉDIO
              </div>
              <div className="mt-3 font-display text-3xl font-semibold">R$ 238</div>
              <div className="mt-1 text-xs text-muted-foreground">+R$ 22 vs mês anterior</div>
            </div>
          </div>

          {/* Table */}
          <div className="card-soft overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-border">
              <div className="relative flex-1">
                <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por ID, cliente ou slug…"
                  className="w-full h-10 pl-9 pr-3 bg-surface-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg">
                {(["todos", "pago", "pendente", "falha"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`px-3 h-8 rounded-md text-xs font-medium transition capitalize ${
                      filter === k ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button className="h-10 w-10 grid place-items-center rounded-lg border border-border hover:bg-muted">
                <Filter className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground border-b border-border bg-surface-2/50">
              <div className="col-span-2">ID</div>
              <div className="col-span-4">CLIENTE</div>
              <div className="col-span-1">MÉTODO</div>
              <div className="col-span-2">DATA</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-1 text-right">VALOR</div>
              <div className="col-span-1 text-right">AÇÕES</div>
            </div>

            <ul>
              {filtered.map((p) => {
                const meta = ST_META[p.status];
                return (
                  <li key={p.id} className="grid grid-cols-12 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition">
                    <div className="col-span-2 font-mono text-xs text-muted-foreground">{p.id}</div>
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-sm">{p.client[0]}</div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{p.client}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.slug} · {p.plan}</div>
                      </div>
                    </div>
                    <div className="col-span-1 text-xs">
                      <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground font-medium">{p.method}</span>
                    </div>
                    <div className="col-span-2 text-xs text-muted-foreground">{p.date}</div>
                    <div className="col-span-1">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${meta.chip}`}>
                        <span className={`size-1.5 rounded-full ${meta.dot}`} />{meta.label}
                      </span>
                    </div>
                    <div className="col-span-1 text-right font-display font-semibold">R$ {p.amount}</div>
                    <div className="col-span-1 flex justify-end gap-1">
                      <button className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-muted" title="Copiar ID">
                        <Copy className="size-3.5" />
                      </button>
                      {p.status !== "pago" && (
                        <button className="h-8 w-8 grid place-items-center rounded-md bg-primary text-primary-foreground hover:opacity-95" title="Recobrar">
                          <RefreshCw className="size-3.5" />
                        </button>
                      )}
                      <button className="h-8 w-8 grid place-items-center rounded-md border border-border hover:bg-muted">
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function KpiTile({ icon, label, value, sub, tone, trend }: any) {
  return (
    <div className="col-span-12 sm:col-span-6 lg:col-span-2 card-soft p-5">
      <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className={`mt-3 font-display text-2xl font-semibold ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">{sub} {trend}</div>
    </div>
  );
}

function MethodCard({ label, share, amount, count }: any) {
  return (
    <div className="col-span-12 sm:col-span-6 lg:col-span-3 card-soft p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">{label.toUpperCase()}</div>
        <span className="text-xs text-muted-foreground">{count} txs</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="font-display text-2xl font-semibold">R$ {amount.toLocaleString("pt-BR")}</div>
        <div className="text-sm font-semibold text-primary">{share}%</div>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${share}%` }} />
      </div>
    </div>
  );
}

function CashflowChart() {
  const data = [120, 80, 160, 200, 140, 90, 220, 280, 180, 240, 300, 260, 320, 380];
  const max = Math.max(...data);
  return (
    <div className="mt-5 flex items-end gap-1.5 h-20">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-sm bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${(v / max) * 100}%` }} />
          <span className="text-[9px] text-muted-foreground">{i + 16}</span>
        </div>
      ))}
    </div>
  );
}
