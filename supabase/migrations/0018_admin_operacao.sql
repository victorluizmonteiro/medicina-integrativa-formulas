-- ============================================================
-- 0018_admin_operacao.sql
-- Operação no painel admin:
--  - status de produção do pedido (controlado manualmente)
--  - carimbo do último envio da prescrição à farmácia
-- ============================================================

ALTER TABLE avaliacoes
  ADD COLUMN status_pedido TEXT NOT NULL DEFAULT 'novo'
    CHECK (status_pedido IN ('novo', 'em_producao', 'enviado', 'entregue', 'cancelado')),
  ADD COLUMN prescricao_enviada_em TIMESTAMPTZ;
