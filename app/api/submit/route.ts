import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Resend } from "resend";
import { calcularFormula, obterResultado } from "@/lib/scoring";
import { gerarPDFBuffer } from "@/lib/generate-pdf";
import { RespostaFormulario } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "responses.json");


async function lerRespostas(): Promise<RespostaFormulario[]> {
  try {
    const conteudo = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(conteudo);
  } catch {
    return [];
  }
}

async function salvarResposta(resposta: RespostaFormulario) {
  const respostas = await lerRespostas();
  respostas.push(resposta);
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(respostas, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cliente, respostas } = body;

    if (!cliente?.nome || !cliente?.cpf) {
      return NextResponse.json({ erro: "Nome e CPF são obrigatórios" }, { status: 400 });
    }

    if (!respostas || Object.keys(respostas).length !== 30) {
      return NextResponse.json({ erro: "Todas as 30 questões devem ser respondidas" }, { status: 400 });
    }

    const pontuacaoTotal = Object.values(respostas as Record<string, number>).reduce(
      (acc, val) => acc + val,
      0
    );

    const formula = calcularFormula(pontuacaoTotal);
    const resultado = obterResultado(formula, pontuacaoTotal);

    const registro: RespostaFormulario = {
      cliente,
      respostas,
      pontuacaoTotal,
      formula,
      dataHora: new Date().toISOString(),
    };

    // Persiste localmente quando possível (dev). Em produção serverless o
    // filesystem é efêmero — a falha aqui não deve impedir a resposta.
    salvarResposta(registro).catch((err) =>
      console.warn("Não foi possível salvar resposta em disco:", err)
    );

    // ── ENVIO DE E-MAIL ──────────────────────────────────────────
    let emailOk: boolean | null = null;

    if (cliente.email) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const pdfBuffer = gerarPDFBuffer(cliente.nome, cliente.cpf, formula, pontuacaoTotal);

        await resend.emails.send({
          from: "Mental ABC <onboarding@resend.dev>",
          replyTo: "victorluiz.monteiro@gmail.com",
          to: [cliente.email],
          subject: `Sua prescrição Mental ABC — Fórmula ${resultado.nome}`,
          html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <!-- Cabeçalho -->
        <tr>
          <td style="background:linear-gradient(135deg,#10b981,#0d9488);padding:28px 32px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:0.5px;">Mental ABC</p>
            <p style="margin:6px 0 0;color:#d1fae5;font-size:13px;">Saúde Integrativa</p>
          </td>
        </tr>
        <!-- Saudação -->
        <tr>
          <td style="padding:28px 32px 16px;">
            <p style="margin:0 0 8px;color:#0f172a;font-size:16px;font-weight:700;">Olá, ${cliente.nome.split(" ")[0]}!</p>
            <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
              Sua avaliação foi concluída. Com base nas suas respostas, identificamos o seu perfil e preparamos a sua prescrição personalizada.
            </p>
          </td>
        </tr>
        <!-- Fórmula -->
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
        <!-- Pontuação -->
        <tr>
          <td style="padding:0 32px 24px;">
            <p style="margin:0 0 6px;color:#94a3b8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Pontuação Obtida</p>
            <p style="margin:0;color:#0f172a;font-size:14px;"><strong>${pontuacaoTotal}</strong> <span style="color:#94a3b8;">/ 90 pontos</span></p>
          </td>
        </tr>
        <!-- Aviso PDF -->
        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;color:#065f46;font-size:13px;line-height:1.6;">
                    📎 <strong>Sua prescrição em PDF está em anexo</strong> neste e-mail. Guarde-a e apresente na farmácia parceira para adquirir a formulação indicada.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Rodapé -->
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
          attachments: [
            {
              filename: `prescricao-mental-abc-${formula}.pdf`,
              content: pdfBuffer,
            },
          ],
        });

        emailOk = true;
      } catch (emailErr) {
        console.error("Erro ao enviar e-mail:", emailErr);
        emailOk = false;
      }
    }

    return NextResponse.json({ formula, pontuacaoTotal, cliente, emailOk });
  } catch (err) {
    console.error("Erro ao processar formulário:", err);
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 });
  }
}
