-- ============================================================
-- 0008_composicoes_seed.sql
-- Carga inicial das fórmulas e composições de cada perfil.
-- ============================================================

-- ══════════════════ PERFIL 1 (CALM·A) ══════════════════
INSERT INTO formulas (perfil_id, nome, forma_farmaceutica, posologia, ordem) VALUES
  (1, 'Fórmula Diurna',  'Cápsulas', 'Usar uma cápsula pela manhã.', 1),
  (1, 'Fórmula Noturna', 'Cápsulas', 'Usar uma dose à noite, por 30 dias.', 2);

INSERT INTO composicoes (formula_id, composto, quantidade, unidade, ordem) VALUES
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Hidroxocobalamina', 1000, 'mcg', 1),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Riboflavina-5-fosfato (B2)', 20, 'mg', 2),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Vitamina B6 (P-5-P)', 15, 'mg', 3),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Magnésio L-treonato', 144, 'mg', 4),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Magnésio glicinato', 100, 'mg', 5),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Zinco bisglicinato', 15, 'mg', 6),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Vitamina C', 500, 'mg', 7),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'CoQ10 (Ubiquinol)', 100, 'mg', 8),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Apigenina', 50, 'mg', 9),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Luteolina', 100, 'mg', 10),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'Curcumina fitossomal (95% + 5% piperina)', 500, 'mg', 11),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Diurna'), 'L-Teanina', 150, 'mg', 12);

INSERT INTO composicoes (formula_id, composto, quantidade, unidade, ordem) VALUES
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Noturna'), 'Taurina', 350, 'mg', 1),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Noturna'), 'Glicina', 350, 'mg', 2),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Noturna'), 'Fosfatidilserina', 150, 'mg', 3),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Noturna'), 'Ashwagandha', 200, 'mg', 4),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Noturna'), 'NAC (N-acetilcisteína)', 300, 'mg', 5),
  ((SELECT id FROM formulas WHERE perfil_id=1 AND nome='Fórmula Noturna'), 'L-Selenometionina', 100, 'mcg', 6);

-- ══════════════════ PERFIL 2 (VITAL·B) ══════════════════
INSERT INTO formulas (perfil_id, nome, forma_farmaceutica, posologia, ordem) VALUES
  (2, 'Fórmula Manhã', 'Cápsulas', 'Utilizar uma dose após o café da manhã, por 30 dias.', 1),
  (2, 'Fórmula Noite', 'Cápsulas', 'Usar uma dose à noite, 30 min antes de dormir, por 30 dias.', 2);

INSERT INTO composicoes (formula_id, composto, quantidade, unidade, ordem) VALUES
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'L-Tirosina', 300, 'mg', 1),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'CDP-Colina', 250, 'mg', 2),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Uridina monofosfato', 150, 'mg', 3),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), '5-MTHF', 200, 'mcg', 4),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Nicotinamida Ribosídeo', 250, 'mg', 5),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Acetil-L-Carnitina', 250, 'mg', 6),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Coenzima Q10 (Ubiquinol)', 200, 'mg', 7),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Vitamina C', 400, 'mg', 8),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Piridoxal-5-fosfato (B6)', 15, 'mg', 9),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Magnésio malato', 200, 'mg', 10),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Metilcobalamina', 500, 'mcg', 11),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Riboflavina-5-fosfato (B2)', 20, 'mg', 12),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Apigenina', 50, 'mg', 13),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Ácido pantotênico', 250, 'mg', 14),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Manhã'), 'Rhodiola rosea (3% rosavinas / 1% salidrosídeos)', 200, 'mg', 15);

INSERT INTO composicoes (formula_id, composto, quantidade, unidade, ordem) VALUES
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Noite'), 'Magnésio malato', 250, 'mg', 1),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Noite'), 'Taurina', 250, 'mg', 2),
  ((SELECT id FROM formulas WHERE perfil_id=2 AND nome='Fórmula Noite'), 'NAC (N-acetilcisteína)', 600, 'mg', 3);

-- ══════════════════ PERFIL 3 (EQUIL·C) ══════════════════
INSERT INTO formulas (perfil_id, nome, forma_farmaceutica, posologia, ordem) VALUES
  (3, 'Fórmula Tarde e Noite',      'Cápsulas', 'Uma dose às 14h e uma 60 min antes de dormir, por 30 dias.', 1),
  (3, 'Fórmula Dia, Tarde e Noite', 'Cápsulas', 'Uma dose 3 vezes ao dia, por 30 dias.', 2);

INSERT INTO composicoes (formula_id, composto, quantidade, unidade, ordem) VALUES
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Tarde e Noite'), 'Magnésio glicinato', 200, 'mg', 1),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Tarde e Noite'), 'Glicina', 500, 'mg', 2),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Tarde e Noite'), 'Taurina', 500, 'mg', 3),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Tarde e Noite'), 'Vitamina C', 500, 'mg', 4),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Tarde e Noite'), 'Ashwagandha KSM-66', 150, 'mg', 5),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Tarde e Noite'), 'Fosfatidilserina', 100, 'mg', 6);

INSERT INTO composicoes (formula_id, composto, quantidade, unidade, ordem) VALUES
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), '5-MTHF', 100, 'mcg', 1),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'Hidroxocobalamina', 250, 'mcg', 2),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'Riboflavina-5-fosfato (B2)', 10, 'mg', 3),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'Piridoxal-5-fosfato (B6)', 10, 'mg', 4),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'N-acetilcisteína', 200, 'mg', 5),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'L-Teanina', 100, 'mg', 6),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'Acetil-L-carnitina', 150, 'mg', 7),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'Coenzima Q10 (Ubiquinol)', 70, 'mg', 8),
  ((SELECT id FROM formulas WHERE perfil_id=3 AND nome='Fórmula Dia, Tarde e Noite'), 'Ácido alfa-lipóico', 150, 'mg', 9);
