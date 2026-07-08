import { supabaseAdmin } from "@/lib/supabase";
import ParceirosAdmin, { ParceiroLinha } from "@/components/admin/ParceirosAdmin";

export const dynamic = "force-dynamic";

export default async function AdminParceiros() {
  const { data } = await supabaseAdmin
    .from("parceiros")
    .select("id, slug, nome, email, whatsapp, comissao_pct, is_default, ativo")
    .order("is_default", { ascending: false })
    .order("nome");

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: "1.3rem", color: "#0A1D34" }}>Parceiros</h1>
      <ParceirosAdmin parceiros={(data ?? []) as ParceiroLinha[]} />
    </div>
  );
}
