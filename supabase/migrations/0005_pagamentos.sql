-- ============================================================
-- 0005_pagamentos.sql
-- Preço por perfil + registro de pagamentos (Stripe).
-- Valores em CENTAVOS (INTEGER) para evitar imprecisão de float.
-- ============================================================

-- Preço de cada fórmula (defina os valores reais no UPDATE abaixo)
ALTER TABLE perfis
  ADD COLUMN preco_centavos INTEGER NOT NULL DEFAULT 0;

-- >>> DEFINA OS PREÇOS EM REAIS (edite só o número antes de "* 100") <<<
--     A coluna guarda centavos; a multiplicação converte o valor em reais.
UPDATE perfis SET preco_centavos = ROUND(0.00 * 100) WHERE id = 1; -- CALM·A  (R$ 0,00)
UPDATE perfis SET preco_centavos = ROUND(0.00 * 100) WHERE id = 2; -- VITAL·B (R$ 0,00)
UPDATE perfis SET preco_centavos = ROUND(0.00 * 100) WHERE id = 3; -- EQUIL·C (R$ 0,00)

-- Flag de conveniência: avaliação já paga?
ALTER TABLE avaliacoes
  ADD COLUMN pago BOOLEAN NOT NULL DEFAULT FALSE;

-- Registro de cada tentativa/cobrança
CREATE TABLE pagamentos (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliacao_id          UUID NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  stripe_session_id     TEXT UNIQUE,
  stripe_payment_intent TEXT,
  valor_centavos        INTEGER NOT NULL,
  moeda                 TEXT NOT NULL DEFAULT 'brl',
  metodo                TEXT,                          -- 'pix' | 'card'
  status                TEXT NOT NULL DEFAULT 'pendente', -- pendente | pago | cancelado | expirado
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT now(),
  pago_em               TIMESTAMPTZ
);
CREATE INDEX idx_pagamentos_avaliacao ON pagamentos(avaliacao_id);
