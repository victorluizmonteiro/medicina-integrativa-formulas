-- ============================================================
-- 0007_composicoes.sql
-- Parametrização das prescrições:
--   perfis → formulas (várias por perfil) → composicoes (ativos)
-- Cada perfil pode ter mais de uma fórmula (ex.: diurna e noturna),
-- cada fórmula com sua própria posologia e lista de compostos.
-- Tudo editável no Supabase (Table Editor), sem deploy.
-- ============================================================

CREATE TABLE formulas (
  id                 SERIAL PRIMARY KEY,
  perfil_id          SMALLINT NOT NULL REFERENCES perfis(id),
  nome               TEXT NOT NULL,     -- ex.: 'Fórmula Diurna'
  forma_farmaceutica TEXT,              -- ex.: 'Cápsulas'
  posologia          TEXT,              -- ex.: 'Usar 1 cápsula pela manhã, por 30 dias'
  ordem              SMALLINT NOT NULL DEFAULT 1,
  habilitado         BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (perfil_id, nome)
);
CREATE INDEX idx_formulas_perfil ON formulas(perfil_id);

CREATE TABLE composicoes (
  id          SERIAL PRIMARY KEY,
  formula_id  INTEGER NOT NULL REFERENCES formulas(id) ON DELETE CASCADE,
  composto    TEXT NOT NULL,            -- nome do ativo
  quantidade  NUMERIC(10,3) NOT NULL,   -- ex.: 200, 0.5
  unidade     TEXT NOT NULL,            -- mg, g, mcg, ml, UI...
  ordem       SMALLINT NOT NULL DEFAULT 1,
  observacao  TEXT,
  habilitado  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (formula_id, composto)
);
CREATE INDEX idx_composicoes_formula ON composicoes(formula_id);

-- Segurança: mesma postura das demais tabelas (só service_role acessa)
ALTER TABLE formulas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE composicoes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON formulas, composicoes FROM anon, authenticated;
