-- ============================================================
-- 0003_perfis_conteudo.sql
-- Preenche a apresentação dos perfis (reaproveita o branding
-- CALM·A / VITAL·B / EQUIL·C). Usado para exibição/admin.
-- ============================================================

UPDATE perfis SET
  nome      = 'CALM·A',
  subtitulo = 'Mente em paz. Alerta sob controle.',
  descricao = 'Sua mente está em overdrive — pensa demais, tensa-se sem motivo e não consegue desligar mesmo quando está exausta. Isso não é frescura: é hiperexcitação fisiológica real. A Fórmula CALM·A atua nos circuitos excitatórios do sistema nervoso, reduzindo o estado de alerta crônico e devolvendo calma genuína — sem sedação, sem perda de foco.',
  cor       = '#C46060',
  icone     = '⚡'
WHERE id = 1;

UPDATE perfis SET
  nome      = 'VITAL·B',
  subtitulo = 'Energia de volta. Prazer restaurado.',
  descricao = 'Corpo pesado, motivação zero — você levanta sem querer, precisa de café para funcionar e o prazer pelas coisas simples sumiu. Isso é colapso energético real, não preguiça. A Fórmula VITAL·B restaura o eixo energético e a dopamina funcional, devolvendo disposição real, clareza mental e o prazer de viver o dia a dia.',
  cor       = '#C8763A',
  icone     = '🌑'
WHERE id = 2;

UPDATE perfis SET
  nome      = 'EQUIL·C',
  subtitulo = 'Estabilidade emocional. Clareza mental.',
  descricao = 'Um dia bem, outro destruído — humor que sobe e cai, sono sem padrão, emoções que não têm freio. Essa oscilação constante é sinal de um sistema nervoso sem base estável. A Fórmula EQUIL·C estabiliza sua resposta ao estresse, ancora o humor e o sono em um equilíbrio sustentável — para você parar de depender do acaso para ter um bom dia.',
  cor       = '#4A7C59',
  icone     = '🌊'
WHERE id = 3;
