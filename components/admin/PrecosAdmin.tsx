"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface PerfilPreco {
  id: number;
  nome: string;
  preco_centavos: number;
}

function LinhaPreco({ p }: { p: PerfilPreco }) {
  const router = useRouter();
  const [reais, setReais] = useState((p.preco_centavos / 100).toFixed(2).replace(".", ","));
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  const salvar = async () => {
    setSalvando(true);
    setMsg("");
    try {
      const centavos = Math.round(Number(reais.replace(/\./g, "").replace(",", ".")) * 100);
      if (!Number.isInteger(centavos) || centavos < 0) throw new Error("Valor inválido");
      const res = await fetch(`/api/admin/perfis/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preco_centavos: centavos }),
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
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <span style={{ fontWeight: 700, color: "#0A1D34", minWidth: 150 }}>{p.nome}</span>
      <label style={{ fontSize: "0.85rem", color: "#64748b" }}>
        R${" "}
        <input
          value={reais}
          onChange={(e) => setReais(e.target.value)}
          inputMode="decimal"
          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.9rem", width: 120 }}
        />
      </label>
      <button
        onClick={salvar}
        disabled={salvando}
        style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#0E8C8C", color: "#fff", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
      >
        {salvando ? "Salvando…" : "Salvar"}
      </button>
      {msg && <span style={{ fontSize: "0.78rem", color: msg.includes("✓") ? "#15803d" : "#dc2626" }}>{msg}</span>}
    </div>
  );
}

export default function PrecosAdmin({ perfis }: { perfis: PerfilPreco[] }) {
  return (
    <div>
      {perfis.map((p) => (
        <LinhaPreco key={p.id} p={p} />
      ))}
      <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
        O preço é único na plataforma (vale para todos os parceiros) e passa a valer
        imediatamente para novas avaliações.
      </p>
    </div>
  );
}
