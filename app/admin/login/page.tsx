"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.erro || "Falha no login");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar");
      setCarregando(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0A1D34", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <form
        onSubmit={entrar}
        style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 360, fontFamily: "var(--font-dm-sans)" }}
      >
        <h1 style={{ margin: "0 0 4px", fontSize: "1.3rem", fontWeight: 700, color: "#0A1D34" }}>
          Painel Vitalyx
        </h1>
        <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "#64748b" }}>
          Acesso restrito à administração.
        </p>

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha de acesso"
          autoFocus
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: "0.95rem", marginBottom: 12 }}
        />

        <button
          type="submit"
          disabled={carregando || !senha}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "#0E8C8C", color: "#fff", fontWeight: 600, fontSize: "0.95rem", cursor: carregando ? "wait" : "pointer", opacity: carregando || !senha ? 0.6 : 1 }}
        >
          {carregando ? "Entrando…" : "Entrar"}
        </button>

        {erro && (
          <p style={{ margin: "12px 0 0", fontSize: "0.82rem", color: "#dc2626", textAlign: "center" }}>{erro}</p>
        )}
      </form>
    </main>
  );
}
