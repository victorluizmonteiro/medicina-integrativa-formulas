import { z } from "zod";

// Coletamos apenas nome + e-mail nesta etapa. CPF, telefone e endereço
// são coletados no checkout do Stripe (dados de cobrança/entrega).
export const clienteSchema = z.object({
  nome: z.string().trim().min(2, "Nome é obrigatório").max(200),
  // Obrigatório: é o canal de entrega do guia e das comunicações do pedido
  email: z.string().trim().email("E-mail inválido").max(200),
  // LGPD: o consentimento é obrigatório e precisa ser verdadeiro
  consentimento: z.literal(true, {
    message: "É necessário aceitar a Política de Privacidade",
  }),
});

export const submitSchema = z.object({
  turnstileToken: z.string().optional(),
  cliente: clienteSchema,
  // { [perguntaId]: valor 0..3 }
  respostas: z.record(
    z.string(),
    z.number().int().min(0).max(3)
  ),
});

export type SubmitPayload = z.infer<typeof submitSchema>;
