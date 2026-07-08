-- ============================================================
-- 0017_cliente_dados_pos_checkout.sql
-- Novo fluxo: no envio da avaliação coletamos apenas nome + e-mail.
-- CPF, telefone e endereço passam a ser coletados no checkout do
-- Stripe e preenchidos pelo webhook após o pagamento.
--   → CPF deixa de ser obrigatório e único.
-- ============================================================

ALTER TABLE clientes ALTER COLUMN cpf DROP NOT NULL;
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_cpf_key;
