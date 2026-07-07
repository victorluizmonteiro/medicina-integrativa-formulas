-- ============================================================
-- 0014_guia_perfil3.sql
-- Guia do Perfil 3 (Vitalyx Balance) — Instável / oscilante.
-- ============================================================

INSERT INTO guias (perfil_id, conteudo) VALUES (3, $json$
{
  "titulo": "Guia do Perfil — Vitalyx Balance",
  "subtitulo": "Rotina e hábitos para estabilizar seus ritmos e reduzir as oscilações.",
  "secoes": [
    {
      "titulo": "Objetivo do plano",
      "icone": "🎯",
      "objetivo": "Diferente dos perfis anteriores, aqui não há uma deficiência fixa nem um excesso permanente, mas dificuldade do organismo em manter estabilidade. O sistema neuroendócrino oscila continuamente:",
      "blocos": [
        { "tom": "neutro", "itens": [
          { "texto": "Dias de muita energia alternados com dias de fadiga" },
          { "texto": "Períodos de ansiedade seguidos por apatia" },
          { "texto": "Sono excelente em alguns dias e ruim em outros" },
          { "texto": "Grande influência do estresse, alimentação e privação de sono" }
        ]},
        { "titulo": "Objetivo principal", "tom": "dica", "itens": [
          { "texto": "Aumentar a previsibilidade fisiológica, estabilizando os ritmos biológicos e reduzindo as oscilações" }
        ]}
      ]
    },
    {
      "titulo": "Princípio nº 1",
      "icone": "⭐",
      "blocos": [
        { "tom": "dica", "itens": [
          { "texto": "Rotina vence intensidade", "detalhe": "este perfil responde muito melhor à consistência diária do que a intervenções intensas ou esporádicas" }
        ]}
      ]
    },
    {
      "titulo": "Ao acordar (6h–8h)",
      "icone": "🌅",
      "objetivo": "Ancorar o relógio biológico e reduzir a variabilidade do eixo HPA.",
      "blocos": [
        { "titulo": "Faça", "tom": "positivo", "itens": [
          { "texto": "Acordar sempre no mesmo horário", "detalhe": "variação máxima de 30 min, inclusive nos fins de semana" },
          { "texto": "Exposição ao sol", "detalhe": "15–20 minutos" },
          { "texto": "Beber 500–700 ml de água" },
          { "texto": "Respirar profundamente por 5 minutos" },
          { "texto": "Não começar o dia em mensagens ou redes sociais" }
        ]}
      ]
    },
    {
      "titulo": "Café da manhã",
      "icone": "🍳",
      "objetivo": "Estabilizar a glicemia e fornecer substratos constantes para neurotransmissores.",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "30–40 g de proteína" }, { "texto": "Ovos" }, { "texto": "Iogurte natural" },
          { "texto": "Whey protein" }, { "texto": "Abacate" }, { "texto": "Aveia" },
          { "texto": "Frutas vermelhas" }, { "texto": "Castanhas" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Apenas café" }, { "texto": "Apenas frutas" },
          { "texto": "Café da manhã rico em açúcar" }, { "texto": "Jejum prolongado sem indicação clínica" }
        ]}
      ]
    },
    {
      "titulo": "Alimentação",
      "icone": "🥗",
      "objetivo": "Evitar oscilações glicêmicas e inflamatórias.",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "Proteínas em todas as refeições" }, { "texto": "Vegetais variados" },
          { "texto": "Azeite de oliva" }, { "texto": "Abacate" }, { "texto": "Peixes" }, { "texto": "Ovos" },
          { "texto": "Castanhas" }, { "texto": "Frutas com baixo índice glicêmico" }, { "texto": "Fibras" },
          { "texto": "Temperos anti-inflamatórios", "detalhe": "cúrcuma, gengibre, alecrim, canela" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Grandes excessos" }, { "texto": "Dietas extremamente restritivas" },
          { "texto": "Dia do lixo exagerado" }, { "texto": "Excesso de açúcar" },
          { "texto": "Ultraprocessados" }, { "texto": "Álcool frequente" },
          { "texto": "Grandes quantidades de cafeína" }
        ]}
      ]
    },
    {
      "titulo": "Horários das refeições",
      "icone": "🕐",
      "texto": "Este perfil se beneficia muito da regularidade. O ideal é manter café da manhã, almoço, lanche e jantar sempre em horários semelhantes."
    },
    {
      "titulo": "Cafeína",
      "icone": "☕",
      "objetivo": "Este perfil pode alternar entre boa e má tolerância.",
      "blocos": [
        { "titulo": "Recomendação", "tom": "positivo", "itens": [
          { "texto": "1 café pela manhã" }, { "texto": "Evitar após 14h" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Consumo excessivo em dias de ansiedade, insônia ou palpitações" }
        ]}
      ]
    },
    {
      "titulo": "Atividade física",
      "icone": "🏃",
      "objetivo": "Regular o sistema nervoso autônomo e melhorar a estabilidade neuroendócrina.",
      "blocos": [
        { "titulo": "Semana", "tom": "neutro", "itens": [
          { "texto": "Segunda", "detalhe": "Musculação moderada" },
          { "texto": "Terça", "detalhe": "Caminhada, mobilidade" },
          { "texto": "Quarta", "detalhe": "Musculação" },
          { "texto": "Quinta", "detalhe": "Pilates, yoga, alongamentos" },
          { "texto": "Sexta", "detalhe": "Musculação" },
          { "texto": "Sábado", "detalhe": "Esporte recreativo, natureza, bike" },
          { "texto": "Domingo", "detalhe": "Descanso ativo" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Treinos extremamente intensos em dias consecutivos" },
          { "texto": "Treinar até a exaustão" },
          { "texto": "Mudanças constantes de modalidade" },
          { "texto": "Rotinas imprevisíveis" }
        ]}
      ]
    },
    {
      "titulo": "Durante o trabalho",
      "icone": "💼",
      "blocos": [
        { "titulo": "A cada 90 minutos", "tom": "dica", "itens": [
          { "texto": "Levantar" }, { "texto": "Andar" }, { "texto": "Alongar" },
          { "texto": "Respirar profundamente" }, { "texto": "Tomar água" },
          { "texto": "Evitar permanecer muitas horas sentado" }
        ]}
      ]
    },
    {
      "titulo": "Organização da rotina",
      "icone": "🗓️",
      "objetivo": "Este perfil melhora muito quando reduz decisões repetitivas. Crie horários fixos para:",
      "blocos": [
        { "tom": "positivo", "itens": [
          { "texto": "Dormir" }, { "texto": "Acordar" }, { "texto": "Treinar" },
          { "texto": "Alimentar-se" }, { "texto": "Trabalhar" }, { "texto": "Relaxar" }
        ]}
      ]
    },
    {
      "titulo": "Higiene digital",
      "icone": "📵",
      "blocos": [
        { "titulo": "Reduzir", "tom": "negativo", "itens": [
          { "texto": "Excesso de notificações" }, { "texto": "Troca constante entre tarefas" },
          { "texto": "Uso prolongado de redes sociais" }, { "texto": "Sobrecarga de informação" }
        ]}
      ]
    },
    { "titulo": "Exposição ao sol", "icone": "☀️", "texto": "15–20 minutos, todos os dias." },
    {
      "titulo": "Contato com a natureza",
      "icone": "🌳",
      "objetivo": "Ideal: 2–3 vezes por semana.",
      "blocos": [
        { "tom": "positivo", "itens": [
          { "texto": "Parques" }, { "texto": "Praia" }, { "texto": "Trilhas leves" }, { "texto": "Jardins" }
        ]}
      ]
    },
    {
      "titulo": "Relacionamentos",
      "icone": "🤝",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "Relações previsíveis" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Conflitos prolongados" }, { "texto": "Ambientes emocionalmente instáveis" }
        ]}
      ]
    },
    {
      "titulo": "Higiene do sono",
      "icone": "🌙",
      "objetivo": "Costuma ser o fator que mais influencia as oscilações deste perfil.",
      "blocos": [
        { "titulo": "2 horas antes", "tom": "neutro", "itens": [
          { "texto": "Reduzir a intensidade do trabalho" }, { "texto": "Reduzir telas" },
          { "texto": "Evitar discussões" }, { "texto": "Evitar atividades altamente estimulantes" }
        ]},
        { "titulo": "1 hora antes", "tom": "neutro", "itens": [
          { "texto": "Banho morno" }, { "texto": "Leitura" }, { "texto": "Respiração" }, { "texto": "Alongamento leve" }
        ]},
        { "titulo": "Quarto", "tom": "neutro", "itens": [
          { "texto": "Escuro" }, { "texto": "Silencioso" }, { "texto": "Temperatura agradável" }
        ]},
        { "titulo": "Horário", "tom": "dica", "itens": [
          { "texto": "Dormir entre 22h e 23h" }, { "texto": "Acordar no mesmo horário diariamente" }
        ]}
      ]
    },
    {
      "titulo": "Respiração",
      "icone": "🌬️",
      "texto": "Duas vezes ao dia, 5 minutos de respiração diafragmática — inspiração de 4 segundos e expiração de 6–8 segundos."
    },
    {
      "titulo": "Meditação",
      "icone": "🧘",
      "texto": "10–15 minutos, preferencialmente no final da tarde. O objetivo não é esvaziar a mente, mas reduzir a variabilidade do sistema nervoso autônomo."
    },
    {
      "titulo": "Gestão do estresse",
      "icone": "🧭",
      "objetivo": "Este perfil é altamente influenciado pelo ambiente. Crie âncoras diárias:",
      "blocos": [
        { "tom": "positivo", "itens": [
          { "texto": "Caminhada após o almoço" }, { "texto": "Leitura antes de dormir" },
          { "texto": "Horário fixo para refeições" }, { "texto": "Horário fixo para atividade física" },
          { "texto": "Horário fixo para descanso" }
        ]}
      ]
    },
    {
      "titulo": "Fundamentação fisiológica",
      "icone": "🔬",
      "objetivo": "O principal desafio deste perfil é a instabilidade da homeostase — não um excesso ou deficiência isolada. Cada orientação busca reduzir a variabilidade fisiológica:",
      "blocos": [
        { "tom": "neutro", "itens": [
          { "texto": "COMT intermediária/mista e MAO variável", "detalhe": "evitar extremos de estimulação ou sedação, com rotina previsível que estabilize o metabolismo das monoaminas" },
          { "texto": "IDO moderada (oscila entre quinolínico e quinurênico)", "detalhe": "manter alimentação anti-inflamatória consistente e minimizar inflamação episódica" },
          { "texto": "HPA instável e cortisol inconsistente", "detalhe": "reforçar os sincronizadores circadianos: luz matinal e horários regulares de sono, refeições e exercício" },
          { "texto": "Oscilação entre glutamato e GABA", "detalhe": "equilibrar estímulos físicos e cognitivos, evitar sobrecarga e manter práticas regulares de relaxamento" }
        ]}
      ]
    },
    {
      "titulo": "Princípio clínico",
      "icone": "🧩",
      "blocos": [
        { "tom": "dica", "itens": [
          { "texto": "A melhora não depende de fazer mais, e sim de oscilar menos", "detalhe": "quanto mais previsível a rotina, maior a estabilidade do sistema nervoso, do eixo HPA, da energia e dos neurotransmissores. A consistência diária costuma superar intervenções intensas e irregulares." }
        ]}
      ]
    }
  ]
}
$json$::jsonb);
