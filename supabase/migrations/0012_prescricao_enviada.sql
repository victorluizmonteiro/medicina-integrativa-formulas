-- ============================================================
-- 0012_prescricao_enviada.sql
-- Controla o envio único da prescrição por e-mail após o pagamento.
-- ============================================================

ALTER TABLE avaliacoes
  ADD COLUMN prescricao_enviada BOOLEAN NOT NULL DEFAULT FALSE;
