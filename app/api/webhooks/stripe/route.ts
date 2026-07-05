import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

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

  // Marca a avaliação como paga
  if (avaliacaoId) {
    await supabaseAdmin.from("avaliacoes").update({ pago: true }).eq("id", avaliacaoId);
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
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
