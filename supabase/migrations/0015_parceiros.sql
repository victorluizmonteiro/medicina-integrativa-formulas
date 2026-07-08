-- ============================================================
-- 0015_parceiros.sql
-- Estrutura multi-parceiro (farmácias de manipulação).
--  - Preço é ÚNICO na plataforma (segue em perfis.preco_centavos);
--    o que varia por parceiro é a comissão retida (comissao_pct),
--    aplicada na Fase 2 via Stripe Connect (application fee).
--  - O link "puro" (vitalyxhealth.com.br) é o parceiro default.
--  - Cada avaliação registra por qual parceiro o cliente chegou.
-- ============================================================

CREATE TABLE parceiros (
  id                SERIAL PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,     -- 'barbozao' → barbozao.vitalyxhealth.com.br
  nome              TEXT NOT NULL,
  whatsapp          TEXT,
  logo_url          TEXT,
  comissao_pct      NUMERIC(5,2) NOT NULL DEFAULT 0, -- % retido pela plataforma
  stripe_account_id TEXT,                    -- conta Stripe Connect (Fase 2)
  is_default        BOOLEAN NOT NULL DEFAULT FALSE,
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Garante um único parceiro default
CREATE UNIQUE INDEX idx_parceiros_default ON parceiros (is_default) WHERE is_default;

-- Vínculo da avaliação com o parceiro que originou o cliente
ALTER TABLE avaliacoes
  ADD COLUMN parceiro_id INTEGER REFERENCES parceiros(id);
CREATE INDEX idx_avaliacoes_parceiro ON avaliacoes(parceiro_id);

-- Segurança: mesma postura das demais tabelas
ALTER TABLE parceiros ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON parceiros FROM anon, authenticated;

-- ── Parceiro default (o link "puro") ────────────────────────
-- >>> Edite nome/whatsapp/comissão com os dados reais da farmácia
--     que atenderá os pedidos do domínio principal. <<<
INSERT INTO parceiros (slug, nome, whatsapp, comissao_pct, is_default)
VALUES ('vitalyx', 'Farmácia Parceira Principal', NULL, 0, TRUE);
