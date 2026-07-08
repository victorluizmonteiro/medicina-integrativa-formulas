import { supabaseAdmin } from "@/lib/supabase";
import PrecosAdmin, { PerfilPreco } from "@/components/admin/PrecosAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPrecos() {
  const { data } = await supabaseAdmin
    .from("perfis")
    .select("id, nome, preco_centavos")
    .order("id");

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: "1.3rem", color: "#0A1D34" }}>
        Preços das fórmulas
      </h1>
      <PrecosAdmin perfis={(data ?? []) as PerfilPreco[]} />
    </div>
  );
}
