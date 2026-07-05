import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function PagamentoSucesso({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let pago = false;
  let pendente = false;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      pago = session.payment_status === "paid";
      pendente = session.payment_status === "unpaid"; // PIX aguardando compensação
    } catch {
      // sessão inválida — trata como estado desconhecido
    }
  }

  const titulo = pago
    ? "Pagamento confirmado!"
    : pendente
    ? "Estamos aguardando seu pagamento"
    : "Recebemos sua solicitação";

  const mensagem = pago
    ? "Seu pagamento foi aprovado. A farmácia parceira dará andamento à sua formulação. Você receberá o contato para a entrega no endereço informado."
    : pendente
    ? "Se você pagou via PIX, a confirmação pode levar alguns instantes. Assim que compensar, a farmácia dará andamento à sua formulação."
    : "Obrigado! Em breve você terá novidades sobre a sua formulação.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--vivea-cream)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: 16 }}>{pago ? "✅" : "⏳"}</div>
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          fontWeight: 900,
          color: "var(--vivea-dark)",
          marginBottom: 12,
        }}
      >
        {titulo}
      </h1>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#666",
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 300,
          maxWidth: 420,
          lineHeight: 1.7,
          marginBottom: 32,
        }}
      >
        {mensagem}
      </p>
      <a
        href="/"
        style={{
          background: "var(--vivea-dark)",
          color: "#fff",
          padding: "14px 28px",
          borderRadius: 12,
          textDecoration: "none",
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.95rem",
          fontWeight: 500,
        }}
      >
        Voltar ao início
      </a>
    </main>
  );
}
