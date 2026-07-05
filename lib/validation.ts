import { z } from "zod";

// Aceita e-mail válido ou string vazia (campo opcional no formulário)
const emailOpcional = z
  .union([z.string().email(), z.literal("")])
  .optional();

export const clienteSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(200),
  cpf: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length === 11, "CPF inválido"),
  email: emailOpcional,
  telefone: z.string().max(20).optional(),
  idade: z.string().max(3).optional(),
  // LGPD: o consentimento é obrigatório e precisa ser verdadeiro
  consentimento: z.literal(true, {
    message: "É necessário aceitar a Política de Privacidade",
  }),
  cep: z.string().max(9).optional(),
  endereco: z.string().max(200).optional(),
  numero: z.string().max(20).optional(),
  complemento: z.string().max(100).optional(),
  cidade: z.string().max(120).optional(),
  estado: z.string().max(2).optional(),
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
