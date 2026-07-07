-- ============================================================
-- 0010_guia.sql
-- "Guia do Perfil" (rotina, alimentação, exercícios, sono, luz…)
-- enviado em PDF por e-mail ao final da avaliação.
-- Conteúdo hierárquico guardado como documento JSON por perfil
-- (fonte única, fácil de editar/versionar → renderizado no PDF).
--
-- Formato do `conteudo`:
-- {
--   "titulo": "Guia do Perfil — Vitalyx Calm",
--   "subtitulo": "...",
--   "secoes": [
--     {
--       "titulo": "Ao acordar",
--       "icone": "🌅",
--       "objetivo": "texto opcional",
--       "texto": "parágrafo opcional (seções simples)",
--       "blocos": [
--         { "titulo": "Faça", "tom": "positivo",
--           "itens": [ { "texto": "...", "detalhe": "..." } ] }
--       ]
--     }
--   ]
-- }
-- tom: 'neutro' | 'positivo' | 'negativo' | 'dica'
-- ============================================================

CREATE TABLE guias (
  perfil_id     SMALLINT PRIMARY KEY REFERENCES perfis(id),
  conteudo      JSONB NOT NULL DEFAULT '{}'::jsonb,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE guias ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON guias FROM anon, authenticated;
