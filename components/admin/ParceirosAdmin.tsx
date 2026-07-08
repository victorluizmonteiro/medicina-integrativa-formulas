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

export default function ParceirosAdmin({ parceiros }: { parceiros: ParceiroLinha[] }) {
  const router = useRouter();
  const [novo, setNovo] = useState({ slug: "", nome: "", email: "", whatsapp: "", comissao: "0" });
  const [criando, setCriando] = useState(false);
  const [msg, setMsg] = useState("");

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
          comissao_pct: Number(novo.comissao.replace(",", ".")),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao criar");
      setNovo({ slug: "", nome: "", email: "", whatsapp: "", comissao: "0" });
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
      <div style={{ background: "#0A1D34", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
        <p style={{ margin: "0 0 10px", color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>Novo parceiro</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          <input style={inputStyle} placeholder="slug (ex.: barbozao)" value={novo.slug} onChange={(e) => setNovo({ ...novo, slug: e.target.value })} />
          <input style={inputStyle} placeholder="Nome da farmácia" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
          <input style={inputStyle} placeholder="E-mail (prescrições)" value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} />
          <input style={inputStyle} placeholder="WhatsApp" value={novo.whatsapp} onChange={(e) => setNovo({ ...novo, whatsapp: e.target.value })} />
          <input style={inputStyle} placeholder="Comissão %" inputMode="decimal" value={novo.comissao} onChange={(e) => setNovo({ ...novo, comissao: e.target.value })} />
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={criar}
            disabled={criando || !novo.slug || !novo.nome}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#8FD64B", color: "#0A1D34", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
          >
            {criando ? "Criando…" : "Adicionar parceiro"}
          </button>
          {msg && <span style={{ fontSize: "0.78rem", color: msg.includes("✓") ? "#8FD64B" : "#fca5a5" }}>{msg}</span>}
        </div>
        <p style={{ margin: "10px 0 0", color: "#9ABFA8", fontSize: "0.72rem" }}>
          O link do parceiro será: <strong>slug</strong>.{process.env.NEXT_PUBLIC_BASE_DOMAIN || "seudominio.com.br"}
        </p>
      </div>

      {/* Lista */}
      {parceiros.map((p) => (
        <LinhaParceiro key={p.id} p={p} />
      ))}
    </div>
  );
}
