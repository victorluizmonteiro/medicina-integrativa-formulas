export const metadata = {
  title: "Termos de Uso — Vitalyx Health",
};

export default function TermosDeUso() {
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
        <a href="/" style={{ fontSize: "0.8rem", color: "var(--vivea-sage)", textDecoration: "none" }}>
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
          Termos de Uso
        </h1>
        <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: 32 }}>
          Última atualização: 05 de julho de 2026
        </p>

        <p>
          Estes Termos regem o uso do questionário de perfil e do serviço de
          indicação e aquisição de formulações oferecido nesta página. Ao utilizar
          o serviço, você declara ter lido e concordado com estes Termos.
        </p>

        <Secao titulo="1. Descrição do serviço">
          <p>
            Oferecemos um questionário que, a partir das suas respostas, indica uma
            formulação de perfil. A indicação é <strong>informativa</strong> e{" "}
            <strong>não constitui</strong> consulta, diagnóstico ou prescrição
            médica, nem substitui a avaliação de um profissional de saúde
            habilitado.
          </p>
        </Secao>

        <Secao titulo="2. Elegibilidade">
          <p>
            O serviço destina-se a maiores de 18 anos. Ao utilizá-lo, você declara
            que as informações fornecidas são verdadeiras, completas e atualizadas.
          </p>
        </Secao>

        <Secao titulo="3. Pagamento">
          <ul style={ulStyle}>
            <li>
              O valor da formulação é exibido antes da confirmação e cobrado em
              pagamento único.
            </li>
            <li>
              O pagamento é processado pela <strong>Stripe</strong>. Não temos
              acesso nem armazenamos os dados do seu cartão.
            </li>
            <li>
              O pedido só é encaminhado à farmácia após a confirmação do pagamento.
            </li>
          </ul>
        </Secao>

        <Secao titulo="4. Produção e entrega">
          <p>
            A formulação é produzida e entregue por{" "}
            <strong>farmácia de manipulação parceira</strong>, no endereço informado
            por você. Prazos e condições de entrega são combinados diretamente com a
            farmácia. Endereço incorreto ou incompleto pode impedir a entrega.
          </p>
        </Secao>

        <Secao titulo="5. Cancelamento e reembolso">
          <p>
            Por se tratar de <strong>produto personalizado</strong> (manipulado sob
            medida a partir do seu perfil), o cancelamento após o início da produção
            pode não ser possível. Para solicitar cancelamento ou tratar de qualquer
            problema com o pedido, entre em contato pelo canal do item 9 o quanto
            antes. Eventuais direitos previstos no Código de Defesa do Consumidor
            serão respeitados.
          </p>
        </Secao>

        <Secao titulo="6. Responsabilidades do usuário">
          <p>
            Você é responsável pela veracidade dos dados informados e pelo uso
            adequado da formulação. Em caso de dúvida sobre o uso, sintomas ou
            condições de saúde, consulte um profissional habilitado.
          </p>
        </Secao>

        <Secao titulo="7. Limitação de responsabilidade">
          <p>
            O serviço é fornecido "no estado em que se encontra". Não nos
            responsabilizamos por decisões tomadas exclusivamente com base na
            indicação do questionário, nem por indisponibilidades temporárias de
            serviços de terceiros (pagamento, e-mail, hospedagem).
          </p>
        </Secao>

        <Secao titulo="8. Propriedade intelectual">
          <p>
            O conteúdo, a marca e o questionário são de nossa titularidade e não
            podem ser reproduzidos sem autorização.
          </p>
        </Secao>

        <Secao titulo="9. Contato">
          <p>
            Osteopatia Alphaville — Dr. Thiago Possemozer Senra.
            <br />
            E-mail: victorluiz.monteiro@gmail.com — Tel.: (11) 4382-1790.
          </p>
        </Secao>

        <Secao titulo="10. Alterações e legislação aplicável">
          <p>
            Podemos atualizar estes Termos a qualquer momento; a versão vigente é a
            publicada nesta página. Aplica-se a legislação brasileira, eleito o foro
            do domicílio do consumidor para dirimir controvérsias.
          </p>
        </Secao>

        <p style={{ marginTop: 32, fontSize: "0.8rem", color: "#9ca3af" }}>
          Veja também a{" "}
          <a href="/politica-de-privacidade" style={{ color: "var(--vivea-sage)" }}>
            Política de Privacidade
          </a>
          .
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
