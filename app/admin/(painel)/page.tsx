import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { STATUS_PEDIDO } from "@/lib/status-pedido";

export const dynamic = "force-dynamic";

interface Linha {
  id: string;
  data_preenchimento: string;
  pago: boolean;
  prescricao_enviada: boolean;
  status_pedido: string;
  pontuacao_total: number | null;
  perfis: { nome: string } | { nome: string }[] | null;
  clientes: { nome: string; cidade: string | null; estado: string | null } | { nome: string; cidade: string | null; estado: string | null }[] | null;
  parceiros: { nome: string } | { nome: string }[] | null;
}

function um<T>(v: T | T[] | null): T | null {
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

function reais(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function AdminPedidos({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; q?: string }>;
}) {
  const { filtro = "todos", q = "" } = await searchParams;
  const busca = q.trim();

  // ── Dashboard (cards) ─────────────────────────────────────
  const [avalCount, pagosCount, receitaRows] = await Promise.all([
    supabaseAdmin.from("avaliacoes").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("avaliacoes").select("id", { count: "exact", head: true }).eq("pago", true),
    supabaseAdmin.from("pagamentos").select("valor_centavos").eq("status", "pago"),
  ]);
  const totalAval = avalCount.count ?? 0;
  const totalPagos = pagosCount.count ?? 0;
  const receita = (receitaRows.data ?? []).reduce((acc, r) => acc + (r.valor_centavos ?? 0), 0);
  const conversao = totalAval > 0 ? Math.round((totalPagos / totalAval) * 100) : 0;

  const cards = [
    { rotulo: "Avaliações", valor: String(totalAval) },
    { rotulo: "Pedidos pagos", valor: String(totalPagos) },
    { rotulo: "Receita", valor: reais(receita) },
    { rotulo: "Conversão", valor: `${conversao}%` },
  ];

  // ── Busca por nome/CPF/e-mail ─────────────────────────────
  let clienteIds: string[] | null = null;
  if (busca) {
    const { data: encontrados } = await supabaseAdmin
      .from("clientes")
      .select("id")
      .or(`nome.ilike.%${busca}%,cpf.ilike.%${busca}%,email.ilike.%${busca}%`)
      .limit(200);
    clienteIds = (encontrados ?? []).map((c) => c.id);
  }

  // ── Lista ─────────────────────────────────────────────────
  let query = supabaseAdmin
    .from("avaliacoes")
    .select(
      "id, data_preenchimento, pago, prescricao_enviada, status_pedido, pontuacao_total, " +
        "perfis ( nome ), clientes ( nome, cidade, estado ), parceiros ( nome )"
    )
    .order("data_preenchimento", { ascending: false })
    .limit(100);

  if (filtro === "pagos") query = query.eq("pago", true);
  if (filtro === "pendentes") query = query.eq("pago", false);
  if (clienteIds) query = query.in("cliente_id", clienteIds.length ? clienteIds : ["00000000-0000-0000-0000-000000000000"]);

  const { data, error } = await query;
  // Cast explícito: select por concatenação não é inferível pelo supabase-js
  const linhas = (data ?? []) as unknown as Linha[];

  const abas = [
    { key: "todos", label: "Todos" },
    { key: "pagos", label: "Pagos" },
    { key: "pendentes", label: "Pendentes" },
  ];

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: "1.3rem", color: "#0A1D34" }}>Pedidos</h1>

      {/* Dashboard */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        {cards.map((c) => (
          <div key={c.rotulo} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", fontWeight: 700 }}>
              {c.rotulo}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "1.4rem", fontWeight: 800, color: "#0A1D34" }}>{c.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros + busca */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {abas.map((a) => (
          <Link
            key={a.key}
            href={`/admin?filtro=${a.key}${busca ? `&q=${encodeURIComponent(busca)}` : ""}`}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: "0.8rem",
              textDecoration: "none",
              fontWeight: 600,
              background: filtro === a.key ? "#0E8C8C" : "#fff",
              color: filtro === a.key ? "#fff" : "#475569",
              border: "1px solid " + (filtro === a.key ? "#0E8C8C" : "#e2e8f0"),
            }}
          >
            {a.label}
          </Link>
        ))}

        <form method="get" action="/admin" style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <input type="hidden" name="filtro" value={filtro} />
          <input
            type="text"
            name="q"
            defaultValue={busca}
            placeholder="Buscar nome, CPF ou e-mail…"
            style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem", width: 230 }}
          />
          <button
            type="submit"
            style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#0A1D34", color: "#fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
          >
            Buscar
          </button>
          {busca && (
            <Link href={`/admin?filtro=${filtro}`} style={{ alignSelf: "center", fontSize: "0.78rem", color: "#0E8C8C" }}>
              limpar
            </Link>
          )}
        </form>
      </div>

      {error && <p style={{ color: "#dc2626", fontSize: "0.85rem" }}>Erro ao carregar: {error.message}</p>}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left", color: "#94a3b8", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <th style={{ padding: "10px 14px" }}>Data</th>
              <th style={{ padding: "10px 14px" }}>Cliente</th>
              <th style={{ padding: "10px 14px" }}>Fórmula</th>
              <th style={{ padding: "10px 14px" }}>Parceiro</th>
              <th style={{ padding: "10px 14px" }}>Pagamento</th>
              <th style={{ padding: "10px 14px" }}>Produção</th>
              <th style={{ padding: "10px 14px" }}></th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => {
              const cliente = um(l.clientes);
              const perfil = um(l.perfis);
              const parceiro = um(l.parceiros);
              return (
                <tr key={l.id} style={{ borderTop: "1px solid #f1f5f9", color: "#334155" }}>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    {new Date(l.data_preenchimento).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    {cliente?.nome ?? "—"}
                    <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                      {cliente?.cidade ? ` · ${cliente.cidade}/${cliente.estado ?? ""}` : ""}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{perfil?.nome ?? "—"}</td>
                  <td style={{ padding: "10px 14px" }}>{parceiro?.nome ?? "—"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, background: l.pago ? "#dcfce7" : "#fef9c3", color: l.pago ? "#15803d" : "#a16207" }}>
                      {l.pago ? "Pago" : "Pendente"}
                    </span>
                    {l.pago && !l.prescricao_enviada && (
                      <span title="Prescrição não enviada à farmácia" style={{ marginLeft: 6 }}>⚠️</span>
                    )}
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: "0.78rem", color: "#64748b" }}>
                    {l.pago ? STATUS_PEDIDO[l.status_pedido] ?? l.status_pedido : "—"}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <Link href={`/admin/${l.id}`} style={{ color: "#0E8C8C", fontWeight: 600, textDecoration: "none" }}>
                      Detalhes →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {linhas.length === 0 && !error && (
              <tr>
                <td colSpan={7} style={{ padding: "24px 14px", textAlign: "center", color: "#94a3b8" }}>
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
