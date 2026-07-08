import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { obterResultado, PERFIL_PARA_FORMULA } from "@/lib/scoring";
import { getFormulasComComposicao } from "@/lib/data";
import { gerarPDFBuffer } from "@/lib/generate-pdf";
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

  // Marca a avaliação como paga, completa os dados do cliente coletados
  // no checkout (CPF, telefone, endereço) e envia a confirmação.
  if (avaliacaoId) {
    await supabaseAdmin.from("avaliacoes").update({ pago: true }).eq("id", avaliacaoId);
    await completarDadosCliente(session, avaliacaoId);
    await enviarConfirmacao(avaliacaoId);
  }
}

/**
 * Grava no cliente os dados que o Stripe coletou no checkout:
 * CPF (custom field), telefone e endereço de entrega.
 */
async function completarDadosCliente(session: Stripe.Checkout.Session, avaliacaoId: string) {
  // Descobre o cliente da avaliação
  const { data: av } = await supabaseAdmin
    .from("avaliacoes")
    .select("cliente_id")
    .eq("id", avaliacaoId)
    .single();
  if (!av?.cliente_id) return;

  const cd = session.customer_details;
  const cpf = session.custom_fields?.find((f) => f.key === "cpf")?.text?.value ?? null;

  // Endereço de entrega (shipping); cai no billing se não houver
  const shipping =
    // campos variam entre versões da API do Stripe — cobre ambas
    (session as unknown as { shipping_details?: { address?: Stripe.Address } })
      .shipping_details?.address ??
    (session as unknown as { collected_information?: { shipping_details?: { address?: Stripe.Address } } })
      .collected_information?.shipping_details?.address ??
    cd?.address ??
    null;

  await supabaseAdmin
    .from("clientes")
    .update({
      cpf,
      telefone: cd?.phone ?? null,
      endereco: shipping?.line1 ?? null,
      complemento: shipping?.line2 ?? null,
      cidade: shipping?.city ?? null,
      estado: shipping?.state ?? null,
      cep: shipping?.postal_code ?? null,
    })
    .eq("id", av.cliente_id);
}

/**
 * Pós-pagamento (executa uma única vez por avaliação):
 *  - envia a CONFIRMAÇÃO ao cliente (sem anexo);
 *  - envia a PRESCRIÇÃO (PDF) à farmácia parceira, no e-mail
 *    cadastrado em parceiros.email.
 */
async function enviarConfirmacao(avaliacaoId: string) {
  // Reivindica a flag atomicamente: só um evento concorrente vence
  // (o webhook pode disparar mais de uma vez para a mesma sessão).
  const { data: claimed } = await supabaseAdmin
    .from("avaliacoes")
    .update({ prescricao_enviada: true })
    .eq("id", avaliacaoId)
    .eq("prescricao_enviada", false)
    .select(
      "id, perfil_id, pontuacao_total, " +
        "clientes ( nome, cpf, email, telefone, endereco, numero, complemento, cidade, estado, cep ), " +
        "parceiros ( nome, email )"
    );

  const av = claimed?.[0];
  if (!av || !av.perfil_id) return;

  const cliente = Array.isArray(av.clientes) ? av.clientes[0] : av.clientes;
  const parceiro = Array.isArray(av.parceiros) ? av.parceiros[0] : av.parceiros;
  if (!cliente?.email) return;

  const formula = PERFIL_PARA_FORMULA[av.perfil_id];
  const resultado = obterResultado(formula, av.pontuacao_total ?? 0);
  const resend = new Resend(process.env.RESEND_API_KEY);

  // ── 1) Confirmação ao cliente (sem anexo) ──────────────────
  let clienteOk = false;
  try {
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
    clienteOk = true;
  } catch (err) {
    console.error("Erro ao enviar confirmação ao cliente:", err);
    Sentry.captureException(err);
  }

  // ── 2) Prescrição para a farmácia parceira ─────────────────
  let farmaciaOk = false;
  if (parceiro?.email) {
    try {
      const formulasComp = await getFormulasComComposicao(av.perfil_id);
      const pdfBuffer = gerarPDFBuffer(
        cliente.nome,
        cliente.cpf,
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

      await resend.emails.send({
        from: "Vitalyx Health <onboarding@resend.dev>",
        replyTo: "victorluiz.monteiro@gmail.com",
        to: [parceiro.email],
        subject: `Novo pedido pago — ${resultado.nome} — ${cliente.nome}`,
        html: `
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:Helvetica,Arial,sans-serif;color:#0f172a;">
  <h2 style="margin:0 0 4px;font-size:18px;">Novo pedido pago 💊</h2>
  <p style="margin:0 0 20px;color:#475569;font-size:14px;">A prescrição segue em anexo. Dados para produção e entrega:</p>
  <table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;color:#334155;">
    <tr><td style="padding-right:16px;color:#94a3b8;">Fórmula</td><td><strong>${resultado.nome}</strong></td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Cliente</td><td>${cliente.nome}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">CPF</td><td>${cliente.cpf}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Telefone</td><td>${cliente.telefone ?? "—"}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">E-mail</td><td>${cliente.email}</td></tr>
    <tr><td style="padding-right:16px;color:#94a3b8;">Entrega</td><td>${enderecoEntrega || "—"}</td></tr>
  </table>
  <p style="margin:24px 0 0;color:#94a3b8;font-size:11px;">Vitalyx Health — pedido confirmado via Stripe. Dados pessoais sob sigilo (LGPD): usar exclusivamente para produção e entrega deste pedido.</p>
</body></html>`.trim(),
        attachments: [
          { filename: `prescricao-vitalyx-${formula}.pdf`, content: pdfBuffer },
        ],
      });
      farmaciaOk = true;
    } catch (err) {
      console.error("Erro ao enviar prescrição à farmácia:", err);
      Sentry.captureException(err);
    }
  } else {
    // Parceiro sem e-mail cadastrado: pedido pago sem destino operacional
    Sentry.captureMessage(
      `Pedido pago sem e-mail de farmácia (avaliacao ${avaliacaoId}, parceiro ${parceiro?.nome ?? "?"})`
    );
  }

  // Só devolve a flag (para o retry do Stripe) se NADA foi entregue —
  // evita e-mail duplicado quando apenas um dos envios falhou.
  if (!clienteOk && !farmaciaOk) {
    await supabaseAdmin
      .from("avaliacoes")
      .update({ prescricao_enviada: false })
      .eq("id", avaliacaoId);
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
