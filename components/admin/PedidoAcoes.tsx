"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_PEDIDO } from "@/lib/status-pedido";

export default function PedidoAcoes({
  avaliacaoId,
  statusAtual,
  pago,
}: {
  avaliacaoId: string;
  statusAtual: string;
  pago: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(statusAtual);
  const [salvando, setSalvando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [msg, setMsg] = useState("");

  const mudarStatus = async (novo: string) => {
    setStatus(novo);
    setSalvando(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/pedidos/${avaliacaoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_pedido: novo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao salvar");
      setMsg("Status atualizado ✓");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erro ao salvar");
      setStatus(statusAtual);
    } finally {
      setSalvando(false);
    }
  };

  const reenviar = async () => {
    setReenviando(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/pedidos/${avaliacaoId}/reenviar`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Falha no envio");
      setMsg("Prescrição enviada à farmácia ✓");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Falha no envio");
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <label style={{ fontSize: "0.8rem", color: "#64748b" }}>
        Status do pedido{" "}
        <select
          value={status}
          disabled={salvando}
          onChange={(e) => mudarStatus(e.target.value)}
          style={{ marginLeft: 6, padding: "7px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.85rem", background: "#fff" }}
        >
          {Object.entries(STATUS_PEDIDO).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={reenviar}
        disabled={reenviando || !pago}
        title={pago ? "Reenviar a prescrição para o e-mail da farmácia" : "Disponível após o pagamento"}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          border: "none",
          background: pago ? "#0E8C8C" : "#cbd5e1",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.82rem",
          cursor: pago && !reenviando ? "pointer" : "not-allowed",
        }}
      >
        {reenviando ? "Enviando…" : "Reenviar prescrição à farmácia"}
      </button>

      {msg && <span style={{ fontSize: "0.8rem", color: msg.includes("✓") ? "#15803d" : "#dc2626" }}>{msg}</span>}
    </div>
  );
}
