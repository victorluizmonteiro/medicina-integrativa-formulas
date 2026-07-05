-- ============================================================
-- 0001_schema.sql
-- Estrutura de tabelas do sistema de fórmulas (Vívea)
-- ============================================================

-- 1. PERFIS (Perfil 1, 2, 3)
CREATE TABLE perfis (
  id        SMALLINT PRIMARY KEY,          -- 1, 2, 3
  nome      TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT,
  cor       TEXT,
  icone     TEXT,
  ativo     BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. PERGUNTAS (pertencem direto a um perfil)
--    peso_sentinela: 0 = não sentinela | 1 = sentinela normal | 2 = "mais forte"
--    O bônus só é aplicado quando a resposta for > 0 (ver scoring no app).
CREATE TABLE perguntas (
  id             SERIAL PRIMARY KEY,
  perfil_id      SMALLINT NOT NULL REFERENCES perfis(id),
  ordem          SMALLINT NOT NULL,        -- 1..N dentro do perfil
  texto          TEXT NOT NULL,
  is_sentinela   BOOLEAN NOT NULL DEFAULT FALSE,
  peso_sentinela SMALLINT NOT NULL DEFAULT 0,
  ativo          BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (perfil_id, ordem),
  CHECK ( (is_sentinela AND peso_sentinela > 0)
       OR (NOT is_sentinela AND peso_sentinela = 0) )
);

-- 3. CLIENTES (identidade — uma linha por pessoa)
CREATE TABLE clientes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome               TEXT NOT NULL,
  cpf                TEXT NOT NULL UNIQUE,
  email              TEXT,
  telefone           TEXT,
  idade              SMALLINT,
  consentimento_lgpd BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. AVALIACOES (cada preenchimento do formulário)
CREATE TABLE avaliacoes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id         UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  perfil_id          SMALLINT REFERENCES perfis(id),   -- perfil designado
  pontuacao_total    SMALLINT,
  data_preenchimento TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_avaliacoes_cliente ON avaliacoes(cliente_id);

-- 5. RESPOSTAS (cada pergunta respondida em uma avaliação)
CREATE TABLE respostas (
  id           BIGSERIAL PRIMARY KEY,
  avaliacao_id UUID NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
  pergunta_id  INTEGER NOT NULL REFERENCES perguntas(id),
  valor        SMALLINT NOT NULL CHECK (valor BETWEEN 0 AND 3),
  UNIQUE (avaliacao_id, pergunta_id)
);
CREATE INDEX idx_respostas_avaliacao ON respostas(avaliacao_id);
