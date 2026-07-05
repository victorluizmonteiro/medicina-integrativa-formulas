-- ============================================================
-- 0004_clientes_endereco.sql
-- Adiciona campos de endereço à tabela de clientes.
-- ============================================================

ALTER TABLE clientes
  ADD COLUMN endereco    TEXT,        -- logradouro (rua/avenida)
  ADD COLUMN numero      TEXT,        -- TEXT para aceitar "S/N", "123-A" etc.
  ADD COLUMN complemento TEXT,
  ADD COLUMN cep         TEXT,
  ADD COLUMN cidade      TEXT,
  ADD COLUMN estado      CHAR(2);     -- UF (ex.: 'SP')
