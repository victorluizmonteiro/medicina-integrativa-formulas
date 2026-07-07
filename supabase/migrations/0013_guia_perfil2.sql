-- ============================================================
-- 0013_guia_perfil2.sql
-- Guia do Perfil 2 (Vitalyx Energy) — Hipoativo dopaminérgico.
-- ============================================================

INSERT INTO guias (perfil_id, conteudo) VALUES (2, $json$
{
  "titulo": "Guia do Perfil — Vitalyx Energy",
  "subtitulo": "Rotina, alimentação e hábitos para restaurar energia, disposição e foco.",
  "secoes": [
    {
      "titulo": "Objetivo do plano",
      "icone": "🎯",
      "objetivo": "Este perfil se caracteriza por baixa disponibilidade funcional de dopamina e noradrenalina, menor resposta adaptativa ao estresse e redução da produção de energia celular. O plano busca:",
      "blocos": [
        { "tom": "neutro", "itens": [
          { "texto": "Melhorar a produção de energia (ATP)" },
          { "texto": "Aumentar a disponibilidade de dopamina e noradrenalina" },
          { "texto": "Restaurar o ritmo circadiano" },
          { "texto": "Estimular adequadamente o eixo HPA" },
          { "texto": "Melhorar a função mitocondrial" },
          { "texto": "Reduzir a inflamação de baixo grau e a ativação da IDO" },
          { "texto": "Recuperar disposição física e mental sem hiperestimulação" }
        ]}
      ]
    },
    {
      "titulo": "Ao acordar (6h–8h)",
      "icone": "🌅",
      "objetivo": "Estimular o pico fisiológico de cortisol e sincronizar o relógio biológico.",
      "blocos": [
        { "titulo": "Faça", "tom": "positivo", "itens": [
          { "texto": "Levantar imediatamente ao despertar", "detalhe": "evite permanecer na cama" },
          { "texto": "Exposição ao sol", "detalhe": "15–30 minutos" },
          { "texto": "Caminhada leve ao ar livre", "detalhe": "10–15 minutos, se possível" },
          { "texto": "Hidratação", "detalhe": "500–700 ml de água · eletrólitos conforme necessidade" }
        ]},
        { "titulo": "Evite", "tom": "negativo", "itens": [
          { "texto": "Dormir novamente após acordar" },
          { "texto": "Permanecer em ambiente escuro" },
          { "texto": "Começar o dia no celular por longos períodos" },
          { "texto": "Pular o café da manhã" }
        ]}
      ]
    },
    {
      "titulo": "Café da manhã",
      "icone": "🍳",
      "objetivo": "Estimular neurotransmissores e fornecer substrato energético.",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "35–45 g de proteína" }, { "texto": "Ovos" }, { "texto": "Whey protein" },
          { "texto": "Iogurte natural" }, { "texto": "Frango" }, { "texto": "Abacate" },
          { "texto": "Frutas vermelhas" }, { "texto": "Castanhas" }
        ]},
        { "titulo": "Carboidratos de baixo índice glicêmico", "tom": "positivo", "itens": [
          { "texto": "Aveia" }, { "texto": "Batata-doce" }, { "texto": "Banana" },
          { "texto": "Tapioca com proteína" }
        ]}
      ]
    },
    {
      "titulo": "Alimentação",
      "icone": "🥗",
      "objetivo": "Fornecer substratos para neurotransmissores, estabilizar a glicemia e favorecer a função mitocondrial.",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "Proteínas de alta qualidade", "detalhe": "ovos, frango, peixes, carnes magras" },
          { "texto": "Gorduras saudáveis", "detalhe": "azeite de oliva, abacate, nozes, castanhas, macadâmia" },
          { "texto": "Vegetais", "detalhe": "brócolis, couve, espinafre, aspargos, rúcula" },
          { "texto": "Frutas", "detalhe": "frutas vermelhas, kiwi, laranja, romã" },
          { "texto": "Temperos anti-inflamatórios", "detalhe": "cúrcuma, gengibre, alecrim, canela" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Longos períodos de jejum" }, { "texto": "Dietas extremamente restritivas" },
          { "texto": "Baixo consumo proteico" }, { "texto": "Excesso de açúcar" },
          { "texto": "Refrigerantes" }, { "texto": "Ultraprocessados" }, { "texto": "Álcool em excesso" }
        ]}
      ]
    },
    {
      "titulo": "Cafeína",
      "icone": "☕",
      "objetivo": "Neste perfil costuma haver boa tolerância; pode ser usada estrategicamente.",
      "blocos": [
        { "titulo": "Ideal", "tom": "positivo", "itens": [
          { "texto": "1–2 cafés pela manhã" }, { "texto": "Preferencialmente antes das 14h" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Consumo no final da tarde e à noite" }
        ]}
      ]
    },
    {
      "titulo": "Atividade física",
      "icone": "🏃",
      "objetivo": "Estimular dopamina, noradrenalina, BDNF e a função mitocondrial.",
      "blocos": [
        { "titulo": "Semana", "tom": "neutro", "itens": [
          { "texto": "Segunda", "detalhe": "Musculação · 60 min · multiarticulares · progressão de carga" },
          { "texto": "Terça", "detalhe": "Cardio moderado · 30–40 min · Zona 2" },
          { "texto": "Quarta", "detalhe": "Musculação" },
          { "texto": "Quinta", "detalhe": "HIIT curto · 15–20 min · ou treino funcional" },
          { "texto": "Sexta", "detalhe": "Musculação" },
          { "texto": "Sábado", "detalhe": "Esporte recreativo · tênis, natação, bike, corrida leve" },
          { "texto": "Domingo", "detalhe": "Caminhada, mobilidade, alongamento" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Sedentarismo" }, { "texto": "Permanecer sentado o dia todo" },
          { "texto": "Treinos muito longos (>90 min)", "detalhe": "podem agravar a fadiga" }
        ]}
      ]
    },
    {
      "titulo": "Durante o trabalho",
      "icone": "💼",
      "blocos": [
        { "titulo": "A cada 60–90 minutos", "tom": "dica", "itens": [
          { "texto": "Levantar" }, { "texto": "Caminhar 3–5 minutos" }, { "texto": "Alongar" },
          { "texto": "Tomar água" }, { "texto": "Receber luz natural quando possível" }
        ]}
      ]
    },
    {
      "titulo": "Estímulo cognitivo",
      "icone": "🧠",
      "objetivo": "Este perfil responde bem a desafios mentais.",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "Aprender novas habilidades" }, { "texto": "Estudar" }, { "texto": "Idiomas" },
          { "texto": "Música" }, { "texto": "Leitura" }, { "texto": "Jogos de estratégia" },
          { "texto": "Planejamento de metas" }
        ]}
      ]
    },
    { "titulo": "Exposição ao sol", "icone": "☀️", "texto": "20–30 minutos, todos os dias." },
    {
      "titulo": "Relacionamento social",
      "icone": "🤝",
      "texto": "O isolamento tende a piorar este perfil.",
      "blocos": [
        { "titulo": "Estimular", "tom": "positivo", "itens": [
          { "texto": "Contato social" }, { "texto": "Conversas presenciais" },
          { "texto": "Atividades em grupo" }, { "texto": "Projetos colaborativos" }
        ]}
      ]
    },
    {
      "titulo": "Higiene do sono",
      "icone": "🌙",
      "objetivo": "Costuma haver facilidade para dormir, mas a qualidade pode ser insuficiente para a recuperação.",
      "blocos": [
        { "titulo": "2 horas antes", "tom": "neutro", "itens": [
          { "texto": "Reduzir iluminação intensa" }, { "texto": "Evitar trabalho" }, { "texto": "Evitar excesso de cafeína" }
        ]},
        { "titulo": "1 hora antes", "tom": "neutro", "itens": [
          { "texto": "Leitura" }, { "texto": "Banho morno" }, { "texto": "Alongamento" }, { "texto": "Relaxamento" }
        ]},
        { "titulo": "Horário", "tom": "dica", "itens": [
          { "texto": "Dormir preferencialmente entre 22h e 23h" },
          { "texto": "Acordar sempre no mesmo horário", "detalhe": "inclusive nos fins de semana" },
          { "texto": "Evitar dormir até tarde", "detalhe": "reduz o estímulo matinal do eixo HPA" }
        ]}
      ]
    },
    {
      "titulo": "Respiração",
      "icone": "🌬️",
      "texto": "1–2 vezes ao dia, respiração diafragmática por 5 minutos. Não há necessidade de excesso de técnicas relaxantes durante o dia — o foco é manter o equilíbrio sem reduzir ainda mais a ativação fisiológica."
    },
    {
      "titulo": "Exposição ao frio",
      "icone": "❄️",
      "texto": "Pode ser benéfica para este perfil. Banho frio ou finalização fria por 30–90 segundos, preferencialmente pela manhã, pode aumentar alerta, noradrenalina e energia em algumas pessoas. Evitar em casos de contraindicações cardiovasculares ou outras condições específicas."
    },
    {
      "titulo": "Fundamentação fisiológica",
      "icone": "🔬",
      "objetivo": "Cada orientação foi direcionada aos principais mecanismos deste perfil:",
      "blocos": [
        { "tom": "neutro", "itens": [
          { "texto": "COMT rápida", "detalhe": "favorecer a síntese e disponibilidade de catecolaminas com rotina estruturada, exercício e proteína adequada" },
          { "texto": "MAO alta", "detalhe": "evitar fatores que reduzam ainda mais as monoaminas e priorizar hábitos que sustentem sua produção" },
          { "texto": "IDO alta (via quinurenina)", "detalhe": "reduzir inflamação sistêmica e favorecer o metabolismo equilibrado do triptofano" },
          { "texto": "Cortisol baixo / HPA hipoativo", "detalhe": "fortalecer o ritmo circadiano com luz matinal, atividade regular e horários consistentes, evitando tanto a hiperestimulação crônica quanto a inatividade prolongada" }
        ]}
      ]
    }
  ]
}
$json$::jsonb);
