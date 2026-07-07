import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { limiterCheckout, dentroDoLimite, getIp } from "@/lib/ratelimit";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  try {
    if (!(await dentroDoLimite(limiterCheckout, getIp(req)))) {
      return NextResponse.json(
        { erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
        { status: 429 }
      );
    }

    const { avaliacaoId } = (await req.json()) as { avaliacaoId?: string };

    if (!avaliacaoId) {
      return NextResponse.json({ erro: "avaliacaoId é obrigatório" }, { status: 400 });
    }

    // Busca a avaliação + preço do perfil (o preço SEMPRE vem do banco)
    const { data: avaliacao, error } = await supabaseAdmin
      .from("avaliacoes")
      .select("id, pago, perfil_id, perfis ( nome, preco_centavos )")
      .eq("id", avaliacaoId)
      .single();

    if (error || !avaliacao) {
      return NextResponse.json({ erro: "Avaliação não encontrada" }, { status: 404 });
    }

    if (avaliacao.pago) {
      return NextResponse.json({ erro: "Esta avaliação já foi paga" }, { status: 409 });
    }

    // supabase-js tipa relações como array; normalizamos
    const perfil = Array.isArray(avaliacao.perfis) ? avaliacao.perfis[0] : avaliacao.perfis;
    const preco = perfil?.preco_centavos ?? 0;

    if (!preco || preco <= 0) {
      return NextResponse.json(
        { erro: "Preço da fórmula não configurado." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // PIX temporariamente desativado — reativar após habilitar no painel Stripe:
      // payment_method_types: ["card", "pix"],
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: preco,
            product_data: { name: `Fórmula ${perfil?.nome ?? ""}`.trim() },
          },
          quantity: 1,
        },
      ],
      metadata: { avaliacao_id: avaliacao.id },
      success_url: `${baseUrl}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/resultado`,
    });

    // Registra a tentativa de pagamento
    const { error: pagErr } = await supabaseAdmin.from("pagamentos").insert({
      avaliacao_id: avaliacao.id,
      stripe_session_id: session.id,
      valor_centavos: preco,
      status: "pendente",
    });
    if (pagErr) {
      // Não bloqueia o checkout, mas precisa ser visto: sem esta linha o
      // webhook não encontra o registro para marcar como pago.
      console.error("Erro ao registrar pagamento pendente:", pagErr);
      Sentry.captureException(new Error(`pagamentos insert: ${pagErr.message}`));
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar checkout:", err);
    Sentry.captureException(err);
    return NextResponse.json({ erro: "Erro ao iniciar o pagamento" }, { status: 500 });
  }
}
