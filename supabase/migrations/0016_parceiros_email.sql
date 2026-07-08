-- ============================================================
-- 0016_parceiros_email.sql
-- E-mail operacional do parceiro: destino da prescrição (PDF)
-- enviada automaticamente quando um pedido é pago.
-- ============================================================

ALTER TABLE parceiros
  ADD COLUMN email TEXT;

-- >>> Defina o e-mail da farmácia que atende o link puro <<<
-- UPDATE parceiros SET email = 'pedidos@farmacia.com.br' WHERE is_default;
