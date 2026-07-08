import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { getPerguntas, getGuia } from "@/lib/data";
import { gerarGuiaPDFBuffer } from "@/lib/generate-guia-pdf";
import { calcularResultado, obterResultado } from "@/lib/scoring";
import { limiterSubmit, dentroDoLimite, getIp } from "@/lib/ratelimit";
import { verificarTurnstile } from "@/lib/turnstile";
import { submitSchema } from "@/lib/validation";
import { getParceiro, slugDoHost } from "@/lib/parceiros";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);

    // Rate limiting por IP
    if (!(await dentroDoLimite(limiterSubmit, ip))) {
      return NextResponse.json(
        { erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
        { status: 429 }
      );
    }

    // ── Validação de schema (Zod) ───────────────────────────────
    const parsed = submitSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { erro: parsed.error.issues[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    const { cliente, respostas, turnstileToken } = parsed.data;

    // Verificação anti-bot (Cloudflare Turnstile)
    if (!(await verificarTurnstile(turnstileToken, ip))) {
      return NextResponse.json(
        { erro: "Verificação de segurança falhou. Recarregue a página e tente novamente." },
        { status: 400 }
      );
    }

    // ── Carrega as perguntas e valida a completude ──────────────
    const perguntas = await getPerguntas();

    const faltando = perguntas.filter(
      (p) => respostas?.[p.id] === undefined && respostas?.[String(p.id)] === undefined
    );
    if (faltando.length > 0) {
      return NextResponse.json(
        { erro: "Todas as perguntas devem ser respondidas" },
        { status: 400 }
      );
    }

    // ── Pontuação (base 100, vencedor por proporção) ────────────
    const { formula, perfilId, pontos } = calcularResultado(perguntas, respostas);

    // ── Persiste: cliente → avaliação → respostas ───────────────
    // Só nome + e-mail nesta etapa. CPF, telefone e endereço são
    // preenchidos pelo webhook após o checkout do Stripe.
    const { data: clienteRow, error: clienteErr } = await supabaseAdmin
      .from("clientes")
      .insert({
        nome: cliente.nome,
        email: cliente.email,
        consentimento_lgpd: cliente.consentimento ?? false,
      })
      .select("id")
      .single();

    if (clienteErr || !clienteRow) {
      console.error("Erro ao salvar cliente:", clienteErr);
      return NextResponse.json({ erro: "Erro ao salvar dados do cliente" }, { status: 500 });
    }

    // Parceiro de origem: cookie de atribuição (first-touch) → subdomínio → default
    const slugParceiro =
      req.cookies.get("vx_parceiro")?.value ?? slugDoHost(req.headers.get("host"));
    const parceiro = await getParceiro(slugParceiro ?? null);

    const { data: avaliacaoRow, error: avaliacaoErr } = await supabaseAdmin
      .from("avaliacoes")
      .insert({
        cliente_id: clienteRow.id,
        perfil_id: perfilId,
        pontuacao_total: pontos,
        parceiro_id: parceiro?.id ?? null,
      })
      .select("id")
      .single();

    if (avaliacaoErr || !avaliacaoRow) {
      console.error("Erro ao salvar avaliação:", avaliacaoErr);
      return NextResponse.json({ erro: "Erro ao salvar avaliação" }, { status: 500 });
    }

    // Preço da fórmula (para exibir na tela de resultado)
    const { data: perfilRow } = await supabaseAdmin
      .from("perfis")
      .select("preco_centavos")
      .eq("id", perfilId)
      .single();
    const precoCentavos = perfilRow?.preco_centavos ?? 0;

    const linhasResp = perguntas.map((p) => ({
      avaliacao_id: avaliacaoRow.id,
      pergunta_id: p.id,
      valor: Number(respostas[p.id] ?? respostas[String(p.id)]),
    }));

    const { error: respErr } = await supabaseAdmin.from("respostas").insert(linhasResp);
    if (respErr) {
      // não impede a resposta ao cliente, mas registra
      console.error("Erro ao salvar respostas:", respErr);
    }

    // ── Envio de e-mail (opcional) ──────────────────────────────
    const resultado = obterResultado(formula, pontos);
    let emailOk: boolean | null = null;

    if (cliente.email) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Guia do Perfil (se cadastrado) — único anexo desta etapa.
        // A prescrição só é enviada após o pagamento (webhook do Stripe).
        const anexos: { filename: string; content: Buffer }[] = [];
        const guia = await getGuia(perfilId);
        if (guia) {
          const hex = resultado.cor.replace("#", "");
          const corRGB: [number, number, number] = [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
          ];
          const guiaBuffer = gerarGuiaPDFBuffer(cliente.nome, resultado.nome, corRGB, guia);
          anexos.push({ filename: `guia-vitalyx-${formula}.pdf`, content: guiaBuffer });
        }

        await resend.emails.send({
          from: "Vitalyx Health <onboarding@resend.dev>",
          replyTo: "victorluiz.monteiro@gmail.com",
          to: [cliente.email],
          subject: `Seu Guia Vitalyx — Perfil ${resultado.nome}`,
          html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="background:linear-gradient(135deg,#0A1D34,#0E8C8C);padding:28px 32px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;font-family:Helvetica,Arial,sans-serif;">vitalyx</p>
            <p style="margin:6px 0 0;color:#8FD64B;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Health</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 16px;">
            <p style="margin:0 0 8px;color:#0f172a;font-size:16px;font-weight:700;">Olá, ${cliente.nome.split(" ")[0]}!</p>
            <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
              Sua avaliação foi concluída. Com base nas suas respostas, identificamos o seu perfil e preparamos um guia personalizado com orientações para o seu dia a dia.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Fórmula Indicada</p>
                  <p style="margin:0 0 6px;color:#0f172a;font-size:26px;font-weight:900;">${resultado.nome}</p>
                  <p style="margin:0 0 12px;color:#64748b;font-size:14px;font-weight:600;">${resultado.subtitulo}</p>
                  <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">${resultado.descricao}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 24px;">
            <p style="margin:0 0 6px;color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Pontuação Obtida</p>
            <p style="margin:0;color:#0f172a;font-size:14px;"><strong>${pontos}</strong> <span style="color:#94a3b8;">/ 100 pontos</span></p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 10px;color:#065f46;font-size:13px;line-height:1.6;">
                    📎 <strong>Seu Guia do Perfil está em anexo</strong> — com orientações de rotina, alimentação, atividade física, luz e sono, personalizadas para o seu perfil.
                  </p>
                  <p style="margin:0;color:#065f46;font-size:13px;line-height:1.6;">
                    💊 Para receber a sua <strong>fórmula personalizada</strong>, finalize o pedido na página de resultado. Após a confirmação do pagamento, enviaremos a prescrição para a farmácia parceira dar andamento.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;">Osteopatia Alphaville — Dr. Thiago Possemozer Senra</p>
            <p style="margin:0;color:#94a3b8;font-size:11px;">Alameda Cauaxi, 293 • Barueri – SP • Tel.: (11) 4382-1790</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
          `.trim(),
          attachments: anexos,
        });

        emailOk = true;
      } catch (emailErr) {
        console.error("Erro ao enviar e-mail:", emailErr);
        emailOk = false;
      }
    }

    return NextResponse.json({
      formula,
      pontuacaoTotal: pontos,
      avaliacaoId: avaliacaoRow.id,
      precoCentavos,
      emailOk,
    });
  } catch (err) {
    console.error("Erro ao processar formulário:", err);
    Sentry.captureException(err);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}
