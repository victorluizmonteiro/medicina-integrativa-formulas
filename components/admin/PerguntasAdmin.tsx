"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface PerguntaAdmin {
  id: number;
  perfil_id: number;
  ordem: number;
  texto: string;
  is_sentinela: boolean;
  peso_sentinela: number;
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

function LinhaPergunta({ p }: { p: PerguntaAdmin }) {
  const router = useRouter();
  const [texto, setTexto] = useState(p.texto);
  const [sentinela, setSentinela] = useState(p.is_sentinela);
  const [peso, setPeso] = useState(String(p.peso_sentinela || 1));
  const [ordem, setOrdem] = useState(String(p.ordem));
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const salvar = async (extra?: { ativo: boolean }) => {
    setSalvando(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/perguntas/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto,
          is_sentinela: sentinela,
          peso_sentinela: Number(peso) || 1,
          ordem: Number(ordem) || p.ordem,
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
        padding: "14px 16px",
        marginBottom: 10,
        opacity: p.ativo ? 1 : 0.5,
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, paddingTop: 10, minWidth: 24 }}>
          #{p.ordem}
        </span>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={2}
          style={{ ...inputStyle, resize: "vertical", flex: 1 }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 10, paddingLeft: 34 }}>
        <label style={{ fontSize: "0.78rem", color: "#475569", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={sentinela} onChange={(e) => setSentinela(e.target.checked)} />
          Sentinela
        </label>
        {sentinela && (
          <label style={{ fontSize: "0.78rem", color: "#475569" }}>
            Peso +{" "}
            <input
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              inputMode="numeric"
              style={{ ...inputStyle, width: 56, display: "inline-block" }}
            />
          </label>
        )}
        <label style={{ fontSize: "0.78rem", color: "#475569" }}>
          Ordem{" "}
          <input
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
            inputMode="numeric"
            style={{ ...inputStyle, width: 56, display: "inline-block" }}
          />
        </label>
        <button
          onClick={() => salvar()}
          disabled={salvando}
          style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#0E8C8C", color: "#fff", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}
        >
          {salvando ? "…" : "Salvar"}
        </button>
        <button
          onClick={() => salvar({ ativo: !p.ativo })}
          disabled={salvando}
          style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #cbd5e1", background: "none", fontSize: "0.75rem", cursor: "pointer", color: "#475569" }}
        >
          {p.ativo ? "Desativar" : "Reativar"}
        </button>
        {msg && <span style={{ fontSize: "0.75rem", color: msg.includes("✓") ? "#15803d" : "#dc2626" }}>{msg}</span>}
      </div>
    </div>
  );
}

export default function PerguntasAdmin({
  perguntas,
  perfilId,
}: {
  perguntas: PerguntaAdmin[];
  perfilId: number;
}) {
  const router = useRouter();
  const [novoTexto, setNovoTexto] = useState("");
  const [novaSentinela, setNovaSentinela] = useState(false);
  const [novoPeso, setNovoPeso] = useState("1");
  const [criando, setCriando] = useState(false);
  const [msg, setMsg] = useState("");

  const criar = async () => {
    setCriando(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/perguntas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          perfil_id: perfilId,
          texto: novoTexto,
          is_sentinela: novaSentinela,
          peso_sentinela: Number(novoPeso) || 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao criar");
      setNovoTexto("");
      setNovaSentinela(false);
      setNovoPeso("1");
      setMsg("Pergunta adicionada ✓");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao criar");
    } finally {
      setCriando(false);
    }
  };

  return (
    <div>
      {/* Nova pergunta */}
      <div style={{ background: "#0A1D34", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
        <p style={{ margin: "0 0 10px", color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>
          Nova pergunta neste perfil
        </p>
        <textarea
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          rows={2}
          placeholder="Texto da pergunta…"
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 10 }}>
          <label style={{ fontSize: "0.78rem", color: "#9ABFA8", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={novaSentinela} onChange={(e) => setNovaSentinela(e.target.checked)} />
            Sentinela
          </label>
          {novaSentinela && (
            <label style={{ fontSize: "0.78rem", color: "#9ABFA8" }}>
              Peso +{" "}
              <input value={novoPeso} onChange={(e) => setNovoPeso(e.target.value)} inputMode="numeric" style={{ ...inputStyle, width: 56, display: "inline-block" }} />
            </label>
          )}
          <button
            onClick={criar}
            disabled={criando || novoTexto.trim().length < 5}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#8FD64B", color: "#0A1D34", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
          >
            {criando ? "Adicionando…" : "Adicionar"}
          </button>
          {msg && <span style={{ fontSize: "0.75rem", color: msg.includes("✓") ? "#8FD64B" : "#fca5a5" }}>{msg}</span>}
        </div>
      </div>

      {perguntas.map((p) => (
        <LinhaPergunta key={p.id} p={p} />
      ))}
    </div>
  );
}
