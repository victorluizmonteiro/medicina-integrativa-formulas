export const metadata = {
  title: "Política de Privacidade — Vívea Saúde Natural",
};

export default function PoliticaPrivacidade() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--vivea-cream)",
        padding: "48px 20px 72px",
      }}
    >
      <article
        style={{
          maxWidth: 720,
          margin: "0 auto",
          fontFamily: "var(--font-dm-sans)",
          color: "#374151",
          lineHeight: 1.7,
          fontSize: "0.92rem",
        }}
      >
        <a
          href="/"
          style={{ fontSize: "0.8rem", color: "var(--vivea-sage)", textDecoration: "none" }}
        >
          ← Voltar ao início
        </a>

        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
            fontWeight: 900,
            color: "var(--vivea-dark)",
            margin: "20px 0 6px",
          }}
        >
          Política de Privacidade
        </h1>
        <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: 32 }}>
          Última atualização: 05 de julho de 2026
        </p>

        <p>
          Esta Política descreve como tratamos os seus dados pessoais ao utilizar
          nosso questionário de perfil e serviço de indicação de formulações,
          em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
          13.709/2018).
        </p>

        <Secao titulo="1. Controlador dos dados">
          <p>
            Osteopatia Alphaville — Dr. Thiago Possemozer Senra.
            <br />
            Alameda Cauaxi, 293, Ed. AlphaGreen, conj. 2103/2104 — Barueri/SP,
            CEP 06454-020.
            <br />
            Contato do encarregado (DPO): victorluiz.monteiro@gmail.com — Tel.:
            (11) 4382-1790.
          </p>
        </Secao>

        <Secao titulo="2. Dados que coletamos">
          <ul style={ulStyle}>
            <li>
              <strong>Identificação e contato:</strong> nome, CPF, idade,
              telefone/WhatsApp e e-mail.
            </li>
            <li>
              <strong>Endereço:</strong> CEP, logradouro, número, complemento,
              cidade e estado (para entrega da formulação).
            </li>
            <li>
              <strong>Dados de saúde:</strong> suas respostas ao questionário de
              perfil (dado pessoal sensível, art. 5º, II, da LGPD).
            </li>
            <li>
              <strong>Dados de pagamento:</strong> processados diretamente pela
              Stripe. Não temos acesso nem armazenamos os dados do seu cartão.
            </li>
          </ul>
        </Secao>

        <Secao titulo="3. Finalidades e base legal">
          <p>
            Tratamos seus dados com base no seu <strong>consentimento</strong>
            (art. 7º, I, e art. 11, I, da LGPD), fornecido no início do
            questionário, para as seguintes finalidades:
          </p>
          <ul style={ulStyle}>
            <li>calcular seu perfil e indicar a formulação adequada;</li>
            <li>enviar o resultado e a prescrição por e-mail;</li>
            <li>
              encaminhar seu pedido à farmácia de manipulação parceira e viabilizar
              a entrega;
            </li>
            <li>processar o pagamento da formulação.</li>
          </ul>
        </Secao>

        <Secao titulo="4. Compartilhamento">
          <p>Compartilhamos dados apenas com quem é necessário para o serviço:</p>
          <ul style={ulStyle}>
            <li>
              <strong>Farmácia de manipulação parceira</strong> — dados de contato,
              endereço e formulação indicada, para produção e entrega;
            </li>
            <li>
              <strong>Stripe</strong> — processamento de pagamento;
            </li>
            <li>
              <strong>Resend</strong> — envio do e-mail com o resultado;
            </li>
            <li>
              <strong>Supabase</strong> — hospedagem segura do banco de dados.
            </li>
          </ul>
          <p>Não vendemos nem cedemos seus dados para fins de marketing de terceiros.</p>
        </Secao>

        <Secao titulo="5. Armazenamento e segurança">
          <p>
            Os dados são armazenados em ambiente com controle de acesso e
            criptografia em repouso. Adotamos medidas técnicas e organizacionais
            para proteger suas informações contra acesso não autorizado.
          </p>
        </Secao>

        <Secao titulo="6. Retenção">
          <p>
            Mantemos seus dados pelo período necessário às finalidades acima e ao
            cumprimento de obrigações legais. Após esse período, os dados são
            eliminados ou anonimizados.
          </p>
        </Secao>

        <Secao titulo="7. Seus direitos">
          <p>
            Você pode, a qualquer momento, solicitar: confirmação e acesso aos seus
            dados, correção, anonimização, portabilidade, eliminação e revogação do
            consentimento. Para exercer seus direitos, contate o encarregado pelo
            e-mail informado no item 1.
          </p>
        </Secao>

        <Secao titulo="8. Aviso importante">
          <p>
            A indicação de formulação resulta de uma avaliação de perfil e{" "}
            <strong>não substitui</strong> consulta, diagnóstico ou prescrição de um
            profissional de saúde habilitado.
          </p>
        </Secao>

        <p style={{ marginTop: 32, fontSize: "0.8rem", color: "#9ca3af" }}>
          Ao marcar a caixa de consentimento no questionário, você declara que leu e
          concorda com esta Política de Privacidade.
        </p>
      </article>
    </main>
  );
}

const ulStyle: React.CSSProperties = {
  margin: "8px 0",
  paddingLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--vivea-dark)",
          marginBottom: 8,
        }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}
