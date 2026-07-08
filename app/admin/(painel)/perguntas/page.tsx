import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import PerguntasAdmin, { PerguntaAdmin } from "@/components/admin/PerguntasAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPerguntas({
  searchParams,
}: {
  searchParams: Promise<{ perfil?: string }>;
}) {
  const { perfil } = await searchParams;
  const perfilId = [1, 2, 3].includes(Number(perfil)) ? Number(perfil) : 1;

  const [{ data: perfis }, { data: perguntas }] = await Promise.all([
    supabaseAdmin.from("perfis").select("id, nome").order("id"),
    supabaseAdmin
      .from("perguntas")
      .select("id, perfil_id, ordem, texto, is_sentinela, peso_sentinela, ativo")
      .eq("perfil_id", perfilId)
      .order("ordem"),
  ]);

  return (
    <div>
      <h1 style={{ margin: "0 0 6px", fontSize: "1.3rem", color: "#0A1D34" }}>Perguntas</h1>
      <p style={{ margin: "0 0 16px", fontSize: "0.8rem", color: "#94a3b8" }}>
        Alterações valem imediatamente para novas avaliações (o cache do questionário é
        limpo automaticamente). Perguntas desativadas saem do questionário e do cálculo,
        sem afetar avaliações antigas.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(perfis ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/admin/perguntas?perfil=${p.id}`}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: "0.8rem",
              textDecoration: "none",
              fontWeight: 600,
              background: perfilId === p.id ? "#0E8C8C" : "#fff",
              color: perfilId === p.id ? "#fff" : "#475569",
              border: "1px solid " + (perfilId === p.id ? "#0E8C8C" : "#e2e8f0"),
            }}
          >
            {p.nome}
          </Link>
        ))}
      </div>

      <PerguntasAdmin perguntas={(perguntas ?? []) as PerguntaAdmin[]} perfilId={perfilId} />
    </div>
  );
}
