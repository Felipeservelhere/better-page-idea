import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight, Check, Copy, ExternalLink, Eye, Globe, Image as ImageIcon,
  MousePointerClick, Palette, Pencil, Search, Smartphone, Sparkles, Type, Users,
} from "lucide-react";
import { Sidebar, PageHeader } from "@/components/sidebar";

export const Route = createFileRoute("/ver-site")({
  head: () => ({
    meta: [
      { title: "Ver site — admgourmet" },
      { name: "description", content: "Preview da vitrine pública do marketplace: configurações, métricas e personalização." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <PageHeader
          crumb="Ver site"
          title="Vitrine pública"
          actions={
            <>
              <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg border border-border hover:bg-muted">
                <Copy className="size-4" /> Copiar link
              </button>
              <button className="h-9 px-3 inline-flex items-center gap-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-95">
                <ExternalLink className="size-4" /> Abrir site
              </button>
            </>
          }
        />

        <div className="flex-1 overflow-y-auto px-8 py-6 grid grid-cols-12 gap-6">
          {/* Preview */}
          <section className="col-span-12 lg:col-span-8 space-y-6">
            <div className="card-soft overflow-hidden">
              {/* Browser chrome */}
              <div className="px-4 py-3 border-b border-border bg-surface-2 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-destructive/70" />
                  <span className="size-2.5 rounded-full bg-warning/70" />
                  <span className="size-2.5 rounded-full bg-success/70" />
                </div>
                <div className="flex-1 flex items-center gap-2 bg-surface border border-border rounded-md px-3 h-8 text-xs text-muted-foreground">
                  <Globe className="size-3.5" />
                  <span>admgourmet.com.br/<span className="text-foreground font-medium">marketplace</span></span>
                </div>
                <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted">
                  <Smartphone className="size-4" />
                </button>
              </div>

              {/* Mock site */}
              <div className="bg-surface-2 p-8">
                <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                  {/* Hero */}
                  <div className="relative p-10 bg-gradient-to-br from-primary/90 to-primary">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 2px, transparent 2px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "40px 40px, 30px 30px" }} />
                    <div className="relative text-primary-foreground">
                      <div className="text-[10px] font-semibold tracking-[0.16em] opacity-80">MARKETPLACE GOURMET</div>
                      <h2 className="font-display text-3xl font-semibold mt-2 max-w-md leading-tight">Os melhores estabelecimentos da sua cidade, em um só lugar.</h2>
                      <div className="mt-5 flex gap-2">
                        <div className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-surface text-foreground text-sm font-medium">Explorar</div>
                        <div className="h-10 px-4 inline-flex items-center gap-2 rounded-lg border border-white/30 text-sm font-medium">Como funciona</div>
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="-mt-5 mx-8 bg-surface border border-border rounded-xl p-3 flex items-center gap-2 shadow-sm relative">
                    <Search className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground flex-1">Buscar restaurantes, pratos…</span>
                    <span className="h-8 px-3 inline-flex items-center rounded-md bg-primary text-primary-foreground text-xs font-medium">Buscar</span>
                  </div>

                  {/* Cards */}
                  <div className="p-8 grid grid-cols-3 gap-4">
                    {[
                      { name: "Pizzaria Don Lucca", tag: "Italiana", color: "from-orange-200 to-rose-200" },
                      { name: "Sushi Sakura", tag: "Japonesa", color: "from-emerald-200 to-teal-200" },
                      { name: "Açaí Tropical", tag: "Saudável", color: "from-violet-200 to-fuchsia-200" },
                    ].map((c) => (
                      <div key={c.name} className="rounded-xl border border-border overflow-hidden">
                        <div className={`h-20 bg-gradient-to-br ${c.color}`} />
                        <div className="p-3">
                          <div className="text-sm font-semibold">{c.name}</div>
                          <div className="text-[10px] text-muted-foreground">{c.tag} · ★ 4.8</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO checks */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">SAÚDE DA VITRINE</div>
                  <div className="font-display text-base font-semibold mt-0.5">Checklist de publicação</div>
                </div>
                <div className="text-xs text-success font-medium">8/10 ok</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { ok: true, label: "SSL ativo" },
                  { ok: true, label: "Domínio configurado" },
                  { ok: true, label: "Logo enviado" },
                  { ok: true, label: "Meta description" },
                  { ok: true, label: "Open Graph image" },
                  { ok: false, label: "Favicon personalizado" },
                  { ok: true, label: "Sitemap.xml" },
                  { ok: true, label: "Google Analytics" },
                  { ok: false, label: "Pixel Meta" },
                  { ok: true, label: "Robots.txt" },
                ].map((i) => (
                  <div key={i.label} className="flex items-center gap-2 p-2.5 rounded-lg border border-border">
                    <span className={`size-5 rounded-full grid place-items-center ${i.ok ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm">{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right column */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
                  <Eye className="size-3.5" /> VISITAS (7D)
                </div>
                <span className="text-xs text-success inline-flex items-center gap-1"><ArrowUpRight className="size-3" />+18%</span>
              </div>
              <div className="mt-3 font-display text-4xl font-semibold">3.482</div>
              <div className="mt-4 grid grid-cols-7 gap-1">
                {[40, 55, 38, 70, 52, 88, 95].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-full rounded-sm bg-primary/80" style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-muted-foreground">{["S","T","Q","Q","S","S","D"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricMini icon={<MousePointerClick className="size-3.5" />} label="CLIQUES" value="1.204" />
              <MetricMini icon={<Users className="size-3.5" />} label="ÚNICOS" value="892" />
            </div>

            <div className="card-soft p-5">
              <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground mb-3 inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> PERSONALIZAÇÃO
              </div>
              <div className="space-y-2">
                <CustomRow icon={<Palette className="size-3.5" />} label="Cores da marca" value="Laranja gourmet" />
                <CustomRow icon={<Type className="size-3.5" />} label="Tipografia" value="Outfit · Inter" />
                <CustomRow icon={<ImageIcon className="size-3.5" />} label="Banner principal" value="Atualizado há 3d" />
                <CustomRow icon={<Globe className="size-3.5" />} label="Domínio" value="admgourmet.com.br" />
              </div>
              <button className="mt-4 w-full h-9 inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15">
                <Pencil className="size-3.5" /> Editar aparência
              </button>
            </div>

            <div className="card-soft p-5">
              <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground mb-3">TOP RESTAURANTES</div>
              <ol className="space-y-3">
                {[
                  { name: "Pizzaria Don Lucca", views: 842 },
                  { name: "Sushi Sakura", views: 612 },
                  { name: "Espetinho Calory", views: 488 },
                  { name: "Açaí Tropical", views: 401 },
                ].map((r, i) => (
                  <li key={r.name} className="flex items-center gap-3">
                    <span className="size-6 rounded-md bg-muted grid place-items-center text-xs font-semibold text-muted-foreground">{i + 1}</span>
                    <span className="flex-1 text-sm font-medium truncate">{r.name}</span>
                    <span className="text-xs text-muted-foreground">{r.views} views</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function MetricMini({ icon, label, value }: any) {
  return (
    <div className="card-soft p-4">
      <div className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground inline-flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}

function CustomRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
      <span className="size-7 rounded-md bg-muted grid place-items-center text-muted-foreground">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
      <Pencil className="size-3.5 text-muted-foreground" />
    </div>
  );
}
