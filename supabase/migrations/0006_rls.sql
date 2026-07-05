-- ============================================================
-- 0006_rls.sql
-- Ativa Row Level Security em todas as tabelas.
-- Sem policies → a anon/public key não acessa nada.
-- A service_role (usada só no servidor) IGNORA RLS e continua
-- funcionando normalmente.
-- ============================================================

ALTER TABLE perfis     ENABLE ROW LEVEL SECURITY;
ALTER TABLE perguntas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE respostas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Bloqueio extra (defesa em profundidade): revoga acesso direto
-- das roles públicas à API REST.
REVOKE ALL ON perfis, perguntas, clientes, avaliacoes, respostas, pagamentos
  FROM anon, authenticated;
