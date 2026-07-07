import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { obterResultado, PERFIL_PARA_FORMULA } from "@/lib/scoring";
import * as Sentry from "@sentry/nextjs";

// Precisa do corpo bruto (raw) para validar a assinatura → runtime Node.
export const runtime = "nodejs";

async function marcarPago(session: Stripe.Checkout.Session) {
  const avaliacaoId = session.metadata?.avaliacao_id;
  const metodo = session.payment_method_types?.[0] ?? null;

  // Atualiza o registro de pagamento
  await supabaseAdmin
    .from("pagamentos")
    .update({
      status: "pago",
      pago_em: new Date().toISOString(),
      stripe_payment_intent:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      metodo,
    })
    .eq("stripe_session_id", session.id);

  // Marca a avaliação como paga e envia a confirmação ao cliente
  if (avaliacaoId) {
    await supabaseAdmin.from("avaliacoes").update({ pago: true }).eq("id", avaliacaoId);
    await enviarConfirmacao(avaliacaoId);
  }
}

/**
 * Envia o e-mail de confirmação de pagamento (uma única vez).
 * A prescrição NÃO é enviada ao cliente — fica registrada no banco
 * para a farmácia parceira dar andamento.
 */
async function enviarConfirmacao(avaliacaoId: string) {
  // Reivindica a flag atomicamente: só um evento concorrente vence
  // (o webhook pode disparar mais de uma vez para a mesma sessão).
  const { data: claimed } = await supabaseAdmin
    .from("avaliacoes")
    .update({ prescricao_enviada: true })
    .eq("id", avaliacaoId)
    .eq("prescricao_enviada", false)
    .select("id, perfil_id, pontuacao_total, clientes ( nome, email )");

  const av = claimed?.[0];
  if (!av || !av.perfil_id) return;

  const cliente = Array.isArray(av.clientes) ? av.clientes[0] : av.clientes;
  if (!cliente?.email) return;

  const formula = PERFIL_PARA_FORMULA[av.perfil_id];
  const resultado = obterResultado(formula, av.pontuacao_total ?? 0);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Vitalyx Health <onboarding@resend.dev>",
      replyTo: "victorluiz.monteiro@gmail.com",
      to: [cliente.email],
      subject: `Pedido confirmado — Fórmula ${resultado.nome}`,
      html: `
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr><td style="background:linear-gradient(135deg,#0A1D34,#0E8C8C);padding:28px 32px;text-align:center;">
          <p style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">vitalyx</p>
          <p style="margin:6px 0 0;color:#8FD64B;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Health</p>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 8px;color:#0f172a;font-size:16px;font-weight:700;">Pagamento confirmado, ${cliente.nome.split(" ")[0]}! 🎉</p>
          <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">
            Recebemos o pagamento da sua fórmula <strong>${resultado.nome}</strong>. Seu pedido foi encaminhado à farmácia de manipulação parceira, que dará andamento à produção e à entrega no endereço informado.
          </p>
          <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">
            Você será contatado(a) sobre o prazo de entrega. Em caso de dúvidas, basta responder este e-mail.
          </p>
        </td></tr>
        <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
          <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;">Osteopatia Alphaville — Dr. Thiago Possemozer Senra</p>
          <p style="margin:0;color:#94a3b8;font-size:11px;">Alameda Cauaxi, 293 • Barueri – SP • Tel.: (11) 4382-1790</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim(),
    });
  } catch (err) {
    // Falhou o envio: devolve a flag para o retry do Stripe tentar de novo
    await supabaseAdmin
      .from("avaliacoes")
      .update({ prescricao_enviada: false })
      .eq("id", avaliacaoId);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  const assinatura = req.headers.get("stripe-signature");
  const segredo = process.env.STRIPE_WEBHOOK_SECRET;

  if (!assinatura || !segredo) {
    return NextResponse.json({ erro: "Assinatura ausente" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, assinatura, segredo);
  } catch (err) {
    console.error("Falha ao validar webhook Stripe:", err);
    return NextResponse.json({ erro: "Assinatura inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Cartão: pagamento aprovado na hora
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Para PIX, o pagamento pode ser assíncrono → só marca se já pago
        if (session.payment_status === "paid") {
          await marcarPago(session);
        }
        break;
      }
      // PIX: confirmação assíncrona (cliente pagou o QR Code depois)
      case "checkout.session.async_payment_succeeded": {
        await marcarPago(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await supabaseAdmin
          .from("pagamentos")
          .update({ status: event.type.includes("expired") ? "expirado" : "cancelado" })
          .eq("stripe_session_id", session.id);
        break;
      }
    }
  } catch (err) {
    console.error("Erro ao processar evento Stripe:", err);
    Sentry.captureException(err);
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
