"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ParceiroLinha {
  id: number;
  slug: string;
  nome: string;
  email: string | null;
  whatsapp: string | null;
  comissao_pct: number;
  is_default: boolean;
  ativo: boolean;
}

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: "0.85rem",
  width: "100%",
  boxSizing: "border-box",
};

function LinhaParceiro({ p }: { p: ParceiroLinha }) {
  const router = useRouter();
  const [nome, setNome] = useState(p.nome);
  const [email, setEmail] = useState(p.email ?? "");
  const [whatsapp, setWhatsapp] = useState(p.whatsapp ?? "");
  const [comissao, setComissao] = useState(String(p.comissao_pct));
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const salvar = async (extra?: { ativo: boolean }) => {
    setSalvando(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/parceiros/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
          comissao_pct: Number(comissao.replace(",", ".")),
          ...(extra ?? {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao salvar");
      setMsg("Salvo ✓");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "16px 18px",
        marginBottom: 12,
        opacity: p.ativo ? 1 : 0.55,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, color: "#0A1D34", fontSize: "0.9rem" }}>
          {p.slug}
          {p.is_default && (
            <span style={{ marginLeft: 8, fontSize: "0.65rem", background: "#E1F1F0", color: "#0E8C8C", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>
              LINK PURO (DEFAULT)
            </span>
          )}
          {!p.ativo && (
            <span style={{ marginLeft: 8, fontSize: "0.65rem", background: "#fee2e2", color: "#b91c1c", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>
              INATIVO
            </span>
          )}
        </span>
        {!p.is_default && (
          <button
            onClick={() => salvar({ ativo: !p.ativo })}
            disabled={salvando}
            style={{ background: "none", border: "1px solid #cbd5e1", borderRadius: 8, padding: "5px 10px", fontSize: "0.75rem", cursor: "pointer", color: "#475569" }}
          >
            {p.ativo ? "Desativar" : "Reativar"}
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        <label style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
          Nome
          <input style={inputStyle} value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <label style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
          E-mail (recebe as prescrições)
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
          WhatsApp
          <input style={inputStyle} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </label>
        <label style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
          Comissão da plataforma (%)
          <input style={inputStyle} inputMode="decimal" value={comissao} onChange={(e) => setComissao(e.target.value)} />
        </label>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <button
          onClick={() => salvar()}
          disabled={salvando}
          style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#0E8C8C", color: "#fff", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
        >
          {salvando ? "Salvando…" : "Salvar"}
        </button>
        {msg && <span style={{ fontSize: "0.78rem", color: msg.includes("✓") ? "#15803d" : "#dc2626" }}>{msg}</span>}
      </div>
    </div>
  );
}

const labelCampo: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#334155",
  marginBottom: 4,
};

const ajudaCampo: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: "0.7rem",
  color: "#94a3b8",
  lineHeight: 1.4,
};

export default function ParceirosAdmin({ parceiros }: { parceiros: ParceiroLinha[] }) {
  const router = useRouter();
  const [novo, setNovo] = useState({ slug: "", nome: "", email: "", whatsapp: "", comissao: "" });
  const [criando, setCriando] = useState(false);
  const [msg, setMsg] = useState("");

  const dominio = process.env.NEXT_PUBLIC_BASE_DOMAIN || "seudominio.com.br";
  const slugLimpo = novo.slug.trim().toLowerCase();

  const criar = async () => {
    setCriando(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/parceiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: novo.slug,
          nome: novo.nome,
          email: novo.email,
          whatsapp: novo.whatsapp,
          comissao_pct: Number((novo.comissao || "0").replace(",", ".")),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao criar");
      setNovo({ slug: "", nome: "", email: "", whatsapp: "", comissao: "" });
      setMsg("Parceiro criado ✓");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao criar");
    } finally {
      setCriando(false);
    }
  };

  return (
    <div>
      {/* Novo parceiro */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderLeft: "4px solid #0E8C8C",
          borderRadius: 12,
          padding: "20px 22px",
          marginBottom: 24,
        }}
      >
        <p style={{ margin: "0 0 4px", color: "#0A1D34", fontWeight: 700, fontSize: "1rem" }}>
          Adicionar novo parceiro
        </p>
        <p style={{ margin: "0 0 18px", color: "#64748b", fontSize: "0.8rem" }}>
          Cadastre a farmácia de manipulação que produzirá as fórmulas dos clientes que
          chegarem pelo link dela.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div>
            <label style={labelCampo}>
              Nome da farmácia <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              style={inputStyle}
              placeholder="Ex.: Farmácia Barbozão"
              value={novo.nome}
              onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
            />
          </div>

          <div>
            <label style={labelCampo}>
              Identificador do link (slug) <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              style={inputStyle}
              placeholder="Ex.: barbozao"
              value={novo.slug}
              onChange={(e) => setNovo({ ...novo, slug: e.target.value })}
            />
            <p style={ajudaCampo}>
              Letras minúsculas, números e hífen.{" "}
              {slugLimpo && (
                <>
                  Link do parceiro: <strong>{slugLimpo}.{dominio}</strong>
                </>
              )}
            </p>
          </div>

          <div>
            <label style={labelCampo}>E-mail operacional</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="pedidos@farmacia.com.br"
              value={novo.email}
              onChange={(e) => setNovo({ ...novo, email: e.target.value })}
            />
            <p style={ajudaCampo}>Recebe as prescrições dos pedidos pagos.</p>
          </div>

          <div>
            <label style={labelCampo}>WhatsApp</label>
            <input
              style={inputStyle}
              placeholder="(11) 99999-9999"
              value={novo.whatsapp}
              onChange={(e) => setNovo({ ...novo, whatsapp: e.target.value })}
            />
          </div>

          <div>
            <label style={labelCampo}>Comissão da plataforma (%)</label>
            <input
              style={inputStyle}
              inputMode="decimal"
              placeholder="Ex.: 15"
              value={novo.comissao}
              onChange={(e) => setNovo({ ...novo, comissao: e.target.value })}
            />
            <p style={ajudaCampo}>Percentual retido pela Vitalyx em cada venda deste parceiro.</p>
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={criar}
            disabled={criando || !novo.slug.trim() || !novo.nome.trim()}
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              border: "none",
              background: criando || !novo.slug.trim() || !novo.nome.trim() ? "#94a3b8" : "#0E8C8C",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: criando ? "wait" : "pointer",
            }}
          >
            {criando ? "Criando…" : "Adicionar parceiro"}
          </button>
          {msg && (
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: msg.includes("✓") ? "#15803d" : "#dc2626" }}>
              {msg}
            </span>
          )}
        </div>
      </div>

      {/* Lista */}
      <p style={{ margin: "0 0 10px", fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
        Parceiros cadastrados ({parceiros.length})
      </p>
      {parceiros.map((p) => (
        <LinhaParceiro key={p.id} p={p} />
      ))}
    </div>
  );
}
