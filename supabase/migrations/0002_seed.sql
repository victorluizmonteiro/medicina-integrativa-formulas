-- ============================================================
-- 0002_seed.sql
-- Carga inicial: perfis e perguntas
-- peso_sentinela: 1 = sentinela normal | 2 = "mais forte"
-- ============================================================

INSERT INTO perfis (id, nome) VALUES
  (1, 'Perfil 1'),
  (2, 'Perfil 2'),
  (3, 'Perfil 3');

-- ---------- PERFIL 1 (24 perguntas) ----------
INSERT INTO perguntas (perfil_id, ordem, texto, is_sentinela, peso_sentinela) VALUES
  (1, 1,  'Cafeína, energéticos ou pré-treinos pioram claramente ansiedade, irritação ou tensão interna?', TRUE, 1),
  (1, 2,  'Mesmo muito cansado fisicamente, sua mente continua acelerada?', FALSE, 0),
  (1, 3,  'Após uma situação estressante, você demora horas para recuperar a sensação de calma?', TRUE, 1),
  (1, 4,  'Você costuma reviver mentalmente conversas, problemas ou situações horas depois de terem acontecido?', TRUE, 1),
  (1, 5,  'Você apresenta congestão nasal, coceira, vermelhidão, dor de cabeça ou piora do sono após determinados alimentos? Alimentos fermentados, vinho, cerveja, queijos curados ou embutidos costumam piorar sintomas físicos ou emocionais?', TRUE, 1),
  (1, 6,  'Você percebe irritabilidade desproporcional sem motivo evidente?', FALSE, 0),
  (1, 7,  'Tem dificuldade para esquecer conflitos ou situações negativas?', FALSE, 0),
  (1, 8,  'Ambientes muito estimulantes geram sensação de sobrecarga mental?', TRUE, 1),
  (1, 9,  'Após infecções, períodos de estresse ou inflamação, você demora muito para recuperar energia?', TRUE, 1),
  (1, 10, 'Sente piora da disposição física quando está inflamado ou doente?', FALSE, 0),
  (1, 11, 'Em períodos de maior estresse, sente queda importante de motivação?', FALSE, 0),
  (1, 12, 'Você sente que seu corpo demora para voltar ao normal após doenças ou sobrecargas? Percebe que a energia, o humor e a motivação pioram?', TRUE, 1),
  (1, 13, 'Você sente dificuldade de tolerar múltiplos estímulos ao mesmo tempo (som, luz, pessoas falando), gerando incômodo ou até angústia e irritabilidade?', FALSE, 0),
  (1, 14, 'Você sente dificuldade para desligar a mente mesmo quando está cansado?', TRUE, 1),
  (1, 15, 'Barulhos altos ou ambientes movimentados causam desconforto excessivo?', FALSE, 0),
  (1, 16, 'Tem dificuldade para iniciar o sono porque sua mente continua excessivamente ativa?', TRUE, 1),
  (1, 17, 'Você acorda já sentindo o corpo em alerta ou tensão?', TRUE, 1),
  (1, 18, 'Mesmo em momentos de descanso você sente que seu corpo continua em estado de alerta? Tem dificuldade para desacelerar ao final do dia?', FALSE, 0),
  (1, 19, 'Pequenos problemas geram respostas físicas intensas de estresse?', FALSE, 0),
  (1, 20, 'Você sente que está constantemente "ligado"?', TRUE, 1),
  (1, 21, 'Situações relativamente simples geram respostas corporais intensas? Percebe que reage de forma exagerada a situações que parecem normais para outras pessoas?', FALSE, 0),
  (1, 22, 'Você sente que permanece em estado de vigilância mesmo em períodos tranquilos?', FALSE, 0),
  (1, 23, 'Após situações estressantes, sua recuperação física e emocional é lenta?', TRUE, 1),
  (1, 24, 'Tem dificuldade para relaxar completamente mesmo durante férias ou descanso?', TRUE, 1);

-- ---------- PERFIL 2 (24 perguntas) ----------
INSERT INTO perguntas (perfil_id, ordem, texto, is_sentinela, peso_sentinela) VALUES
  (2, 1,  'Você sente que perde energia mental rapidamente durante o dia?', FALSE, 0),
  (2, 2,  'Precisa de café ou estimulantes para começar a funcionar adequadamente?', TRUE, 1),
  (2, 3,  'Tem dificuldade para manter foco e produtividade por períodos prolongados?', FALSE, 0),
  (2, 4,  'Sente que sua motivação desaparece rapidamente após iniciar tarefas?', TRUE, 1),
  (2, 5,  'Sente pouca sensação de recompensa após concluir atividades importantes? Tem dificuldade de experimentar entusiasmo ou de se sentir recompensado mesmo após conquistas importantes?', TRUE, 1),
  (2, 6,  'Tem tendência a sentir apatia mesmo quando as coisas estão indo bem?', FALSE, 0),
  (2, 7,  'Percebe redução do entusiasmo em atividades que costumavam ser prazerosas?', TRUE, 1),
  (2, 8,  'Você precisa constantemente de novidades para manter interesse?', FALSE, 0),
  (2, 9,  'Após períodos de estresse ou doença sente queda importante da disposição?', FALSE, 0),
  (2, 10, 'Leva muito tempo para recuperar energia após infecções?', TRUE, 1),
  (2, 11, 'Sente fadiga desproporcional após situações emocionalmente desgastantes?', FALSE, 0),
  (2, 12, 'Tem sensação frequente de esgotamento sem causa evidente?', TRUE, 1),
  (2, 13, 'Sua mente parece lenta para iniciar tarefas ou tomar decisões? Você se sente facilmente sobrecarregado por excesso de informações?', FALSE, 0),
  (2, 14, 'Costuma sentir lentidão cognitiva principalmente pela manhã? Após um dia muito intenso mentalmente, sente dificuldade para recuperar clareza mental?', FALSE, 0),
  (2, 15, 'Precisa de muito tempo para engrenar após acordar? Seu cérebro parece permanecer "hiperconectado" após atividades exigentes?', TRUE, 1),
  (2, 16, 'Você percebe dificuldade para atingir sensação de relaxamento profundo?', TRUE, 1),
  (2, 17, 'Você acorda cansado mesmo após uma noite adequada de sono?', TRUE, 1),
  (2, 18, 'Demora muito para sentir que realmente despertou pela manhã?', FALSE, 0),
  (2, 19, 'Sente piora importante de energia no meio da manhã ou à tarde?', FALSE, 0),
  (2, 20, 'Seu rendimento físico e mental costuma ser melhor à noite do que pela manhã?', TRUE, 1),
  (2, 21, 'Pequenos esforços parecem exigir mais energia do que deveriam?', FALSE, 0),
  (2, 22, 'Você sente dificuldade para lidar com demandas contínuas do dia a dia?', FALSE, 0),
  (2, 23, 'Após períodos de estresse prolongado sente que nunca recupera totalmente sua energia?', TRUE, 1),
  (2, 24, 'Tem sensação frequente de reserva energética baixa?', TRUE, 1);

-- ---------- PERFIL 3 (20 perguntas) ----------
INSERT INTO perguntas (perfil_id, ordem, texto, is_sentinela, peso_sentinela) VALUES
  (3, 1,  'Sua capacidade de concentração varia muito de um dia para outro?', FALSE, 0),
  (3, 2,  'Existem dias em que você está acelerado e outros em que está sem energia?', TRUE, 2),
  (3, 3,  'A mesma quantidade de café pode estimular muito em alguns dias e quase não fazer efeito em outros?', TRUE, 2),
  (3, 4,  'Sua produtividade oscila sem uma causa clara?', FALSE, 0),
  (3, 5,  'Seu humor muda significativamente ao longo da semana sem explicação evidente?', FALSE, 0),
  (3, 6,  'Você alterna períodos de entusiasmo com períodos de apatia?', TRUE, 2),
  (3, 7,  'Sua tolerância ao estresse muda muito de um dia para outro?', FALSE, 0),
  (3, 8,  'Sua resposta emocional às situações parece imprevisível?', TRUE, 2),
  (3, 9,  'Após períodos de estresse sua recuperação é inconsistente?', TRUE, 2),
  (3, 10, 'Algumas infecções ou inflamações parecem afetá-lo muito mais do que outras?', FALSE, 0),
  (3, 11, 'Você sente períodos de fadiga sem causa aparente?', FALSE, 0),
  (3, 12, 'Sua energia varia muito após eventos estressantes?', TRUE, 2),
  (3, 13, 'Existem dias em que sua mente está muito acelerada e outros em que está lenta?', TRUE, 2),
  (3, 14, 'Seu sono varia muito de qualidade ao longo da semana?', FALSE, 0),
  (3, 15, 'Você alterna períodos de tensão interna com períodos de baixa energia?', TRUE, 2),
  (3, 16, 'Sua capacidade de relaxar muda bastante de um dia para outro?', FALSE, 0),
  (3, 17, 'Seu nível de energia ao acordar varia muito entre os dias?', TRUE, 2),
  (3, 18, 'Existem dias em que você acorda pronto para agir e outros em que parece exausto?', FALSE, 0),
  (3, 19, 'Sua resistência ao estresse é inconsistente?', TRUE, 2),
  (3, 20, 'Seu organismo parece reagir de forma diferente aos mesmos desafios em momentos distintos?', FALSE, 0);
