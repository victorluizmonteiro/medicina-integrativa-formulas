import { Resend } from "resend";
import { supabaseAdmin } from "./supabase";
import { getFormulasComComposicao } from "./data";
import { gerarPDFBuffer } from "./generate-pdf";
import { obterResultado, PERFIL_PARA_FORMULA } from "./scoring";

function um<T>(v: T | T[] | null): T | null {
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

// Tipos explícitos: select por concatenação não é inferível pelo
// parser de tipos do supabase-js (viraria GenericStringError).
interface ClientePrescricao {
  nome: string;
  cpf: string | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
}
interface AvPrescricao {
  id: string;
  perfil_id: number | null;
  pontuacao_total: number | null;
  pago: boolean;
  clientes: ClientePrescricao | ClientePrescricao[] | null;
  parceiros:
    | { nome: string; email: string | null }
    | { nome: string; email: string | null }[]
    | null;
}

/**
 * Envia (ou reenvia) a prescrição em PDF para a farmácia parceira
 * da avaliação. Usada pelo painel admin. Marca prescricao_enviada
 * e o carimbo de horário em caso de sucesso.
 */
export async function enviarPrescricaoFarmacia(
  avaliacaoId: string
): Promise<{ ok: boolean; motivo?: string }> {
  const { data } = await supabaseAdmin
    .from("avaliacoes")
    .select(
      "id, perfil_id, pontuacao_total, pago, " +
        "clientes ( nome, cpf, email, telefone, endereco, numero, complemento, cidade, estado, cep ), " +
        "parceiros ( nome, email )"
    )
    .eq("id", avaliacaoId)
    .maybeSingle();

  const av = data as unknown as AvPrescricao | null;
  if (!av) return { ok: false, motivo: "Avaliação não encontrada" };
  if (!av.pago) return { ok: false, motivo: "Pedido ainda não está pago" };
  if (!av.perfil_id) return { ok: false, motivo: "Avaliação sem perfil" };

  const cliente = um(av.clientes);
  const parceiro = um(av.parceiros);
  if (!parceiro?.email) return { ok: false, motivo: "Parceiro sem e-mail cadastrado" };
  if (!cliente) return { ok: false, motivo: "Cliente não encontrado" };

  const formula = PERFIL_PARA_FORMULA[av.perfil_id];
  const resultado = obterResultado(formula, av.pontuacao_total ?? 0);
  const formulasComp = await getFormulasComComposicao(av.perfil_id);
  const pdfBuffer = gerarPDFBuffer(
    cliente.nome,
    cliente.cpf ?? "—",
    formula,
    av.pontuacao_total ?? 0,
    formulasComp
  );

  const enderecoEntrega = [
    [cliente.endereco, cliente.numero].filter(Boolean).join(", "),
    cliente.complemento,
    [cliente.cidade, cliente.estado].filter(Boolean).join(" – "),
    cliente.cep ? `CEP ${cliente.cep}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Vitalyx Health <onboarding@resend.dev>",
    replyTo: "victorluiz.monteiro@gmail.com",
    to: [parceiro.email],
    subject: `Pedido pago — ${resultado.nome} — ${cliente.nome}`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:Helvetica,Arial,sans-serif;color:#0f172a;">
  <h2 style="margin:0 0 4px;font-size:18px;">Pedido pago 💊</h2>
  <p style="margin:0 0 20px;color:#475569;font-size:14px;">A prescrição segue em anexo. Dados para produção e entrega:</p>
  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;color:#334155;">
    <tr><td style="padding-right:16px;color:#94a3b8;">Fórmula</td><td><strong>${resultado.nome}</strong></td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Cliente</td><td>${cliente.nome}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">CPF</td><td>${cliente.cpf ?? "—"}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Telefone</td><td>${cliente.telefone ?? "—"}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">E-mail</td><td>${cliente.email ?? "—"}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Entrega</td><td>${enderecoEntrega || "—"}</td></tr>
  </table>
  <p style="margin:24px 0 0;color:#94a3b8;font-size:11px;">Vitalyx Health — dados pessoais sob sigilo (LGPD): usar exclusivamente para produção e entrega deste pedido.</p>
</body></html>`.trim(),
    attachments: [{ filename: `prescricao-vitalyx-${formula}.pdf`, content: pdfBuffer }],
  });

  await supabaseAdmin
    .from("avaliacoes")
    .update({ prescricao_enviada: true, prescricao_enviada_em: new Date().toISOString() })
    .eq("id", avaliacaoId);

  return { ok: true };
}
