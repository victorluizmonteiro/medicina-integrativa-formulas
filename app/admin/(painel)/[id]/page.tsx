import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { getFormulasComComposicao } from "@/lib/data";
import PedidoAcoes from "@/components/admin/PedidoAcoes";

export const dynamic = "force-dynamic";

function um<T>(v: T | T[] | null): T | null {
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

const rotulo: React.CSSProperties = {
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "#94a3b8",
  fontWeight: 700,
  margin: "0 0 2px",
};
const valor: React.CSSProperties = { margin: "0 0 12px", color: "#1e293b", fontSize: "0.92rem" };
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: "20px 22px",
  marginBottom: 16,
};

export default async function AdminPedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: av } = await supabaseAdmin
    .from("avaliacoes")
    .select(
      "id, data_preenchimento, pago, prescricao_enviada, prescricao_enviada_em, status_pedido, pontuacao_total, perfil_id, " +
        "perfis ( nome ), parceiros ( nome, email, comissao_pct ), " +
        "clientes ( nome, cpf, email, telefone, idade, endereco, numero, complemento, cidade, estado, cep ), " +
        "pagamentos ( status, valor_centavos, metodo, pago_em )"
    )
    .eq("id", id)
    .maybeSingle();

  if (!av) notFound();

  const cliente = um(av.clientes);
  const perfil = um(av.perfis);
  const parceiro = um(av.parceiros);
  const pagamentos = Array.isArray(av.pagamentos) ? av.pagamentos : av.pagamentos ? [av.pagamentos] : [];
  const formulas = av.perfil_id ? await getFormulasComComposicao(av.perfil_id) : [];

  return (
    <div>
      <Link href="/admin" style={{ color: "#0E8C8C", fontSize: "0.82rem", textDecoration: "none" }}>
        ← Voltar aos pedidos
      </Link>

      <h1 style={{ margin: "10px 0 4px", fontSize: "1.3rem", color: "#0A1D34" }}>
        {perfil?.nome ?? "Pedido"}{" "}
        <span
          style={{
            verticalAlign: "middle",
            marginLeft: 8,
            padding: "3px 10px",
            borderRadius: 999,
            fontSize: "0.7rem",
            fontWeight: 700,
            background: av.pago ? "#dcfce7" : "#fef9c3",
            color: av.pago ? "#15803d" : "#a16207",
          }}
        >
          {av.pago ? "PAGO" : "PENDENTE"}
        </span>
      </h1>
      <p style={{ margin: "0 0 14px", color: "#94a3b8", fontSize: "0.8rem" }}>
        {new Date(av.data_preenchimento).toLocaleString("pt-BR")} · pontuação {av.pontuacao_total ?? "—"}/100
        {av.pago && (
          <>
            {" · prescrição "}
            {av.prescricao_enviada
              ? `enviada à farmácia ✅${av.prescricao_enviada_em ? ` (${new Date(av.prescricao_enviada_em).toLocaleString("pt-BR")})` : ""}`
              : "NÃO enviada ⚠️"}
          </>
        )}
      </p>

      {/* Ações do pedido */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
        <PedidoAcoes avaliacaoId={av.id} statusAtual={av.status_pedido ?? "novo"} pago={!!av.pago} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <section style={card}>
          <h2 style={{ margin: "0 0 14px", fontSize: "0.95rem", color: "#0A1D34" }}>Cliente</h2>
          <p style={rotulo}>Nome</p>
          <p style={valor}>{cliente?.nome ?? "—"}</p>
          <p style={rotulo}>CPF</p>
          <p style={valor}>{cliente?.cpf ?? "—"}</p>
          <p style={rotulo}>Contato</p>
          <p style={valor}>
            {cliente?.telefone ?? "—"} · {cliente?.email ?? "—"}
          </p>
          <p style={rotulo}>Endereço de entrega</p>
          <p style={valor}>
            {[
              [cliente?.endereco, cliente?.numero].filter(Boolean).join(", "),
              cliente?.complemento,
              [cliente?.cidade, cliente?.estado].filter(Boolean).join(" – "),
              cliente?.cep ? `CEP ${cliente.cep}` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>
        </section>

        <section style={card}>
          <h2 style={{ margin: "0 0 14px", fontSize: "0.95rem", color: "#0A1D34" }}>Parceiro & pagamento</h2>
          <p style={rotulo}>Farmácia parceira</p>
          <p style={valor}>
            {parceiro?.nome ?? "—"}
            {parceiro?.email ? ` · ${parceiro.email}` : " · ⚠️ sem e-mail cadastrado"}
          </p>
          <p style={rotulo}>Comissão da plataforma</p>
          <p style={valor}>{parceiro ? `${parceiro.comissao_pct}%` : "—"}</p>
          <p style={rotulo}>Pagamentos</p>
          {pagamentos.length === 0 && <p style={valor}>Nenhuma tentativa registrada.</p>}
          {pagamentos.map((p, i) => (
            <p key={i} style={valor}>
              {(p.valor_centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ·{" "}
              {p.status}
              {p.metodo ? ` · ${p.metodo}` : ""}
              {p.pago_em ? ` · ${new Date(p.pago_em).toLocaleString("pt-BR")}` : ""}
            </p>
          ))}
        </section>
      </div>

      <section style={{ ...card, marginTop: 16 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: "0.95rem", color: "#0A1D34" }}>
          Composição da prescrição
        </h2>
        {formulas.length === 0 && (
          <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Composição não cadastrada para este perfil.</p>
        )}
        {formulas.map((f) => (
          <div key={f.nome} style={{ marginBottom: 18 }}>
            <p style={{ margin: "0 0 2px", fontWeight: 700, color: "#0A1D34", fontSize: "0.9rem" }}>
              {f.nome}
              {f.forma_farmaceutica ? ` — ${f.forma_farmaceutica}` : ""}
            </p>
            {f.posologia && (
              <p style={{ margin: "0 0 8px", fontStyle: "italic", color: "#0E8C8C", fontSize: "0.8rem" }}>
                {f.posologia}
              </p>
            )}
            <table style={{ borderCollapse: "collapse", fontSize: "0.85rem", width: "100%", maxWidth: 480 }}>
              <tbody>
                {f.composicoes.map((c) => (
                  <tr key={c.composto} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "5px 8px 5px 0", color: "#334155" }}>
                      {c.composto}
                      {c.observacao ? ` (${c.observacao})` : ""}
                    </td>
                    <td style={{ padding: "5px 0", textAlign: "right", fontWeight: 600, color: "#0A1D34", whiteSpace: "nowrap" }}>
                      {Number.isInteger(c.quantidade) ? c.quantidade : String(c.quantidade).replace(".", ",")} {c.unidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </div>
  );
}
