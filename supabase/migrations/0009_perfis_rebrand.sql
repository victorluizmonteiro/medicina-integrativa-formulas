-- ============================================================
-- 0009_perfis_rebrand.sql
-- Rebrand dos perfis: nomes da família Vitalyx + cores teal/lima.
-- (perfis.nome alimenta o nome do produto no checkout do Stripe.)
-- ============================================================

UPDATE perfis SET nome = 'Vitalyx Calm',    cor = '#158C93' WHERE id = 1;
UPDATE perfis SET nome = 'Vitalyx Energy',  cor = '#6FA82E' WHERE id = 2;
UPDATE perfis SET nome = 'Vitalyx Balance', cor = '#2E9E88' WHERE id = 3;
