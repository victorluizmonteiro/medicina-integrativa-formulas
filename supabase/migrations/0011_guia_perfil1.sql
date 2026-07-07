-- ============================================================
-- 0011_guia_perfil1.sql
-- Guia do Perfil 1 (Vitalyx Calm).
-- ============================================================

INSERT INTO guias (perfil_id, conteudo) VALUES (1, $json$
{
  "titulo": "Guia do Perfil — Vitalyx Calm",
  "subtitulo": "Rotina, alimentação e hábitos para acalmar seu sistema nervoso.",
  "secoes": [
    {
      "titulo": "Ao acordar",
      "icone": "🌅",
      "objetivo": "Reduzir o pico exagerado de cortisol sem bloquear completamente sua função fisiológica.",
      "blocos": [
        { "titulo": "Faça", "tom": "positivo", "itens": [
          { "texto": "Abrir as janelas imediatamente", "detalhe": "10–15 min de luz solar · sem óculos escuros · sem celular" },
          { "texto": "Respirar profundamente", "detalhe": "5 min · diafragmática · 4s inspirando / 6s expirando" },
          { "texto": "Hidratação", "detalhe": "500–700 ml de água · eletrólitos se houver atividade física" },
          { "texto": "Café da manhã rico em proteína", "detalhe": "30–40 g · ex.: ovos, iogurte grego, whey, abacate, sementes" }
        ]},
        { "titulo": "Evite", "tom": "negativo", "itens": [
          { "texto": "Celular na cama" }, { "texto": "Notícias" }, { "texto": "Redes sociais" },
          { "texto": "Discussões" }, { "texto": "Jejum prolongado" }, { "texto": "Café em jejum" },
          { "texto": "Treino extremamente intenso" }
        ]}
      ]
    },
    {
      "titulo": "Alimentação",
      "icone": "🥗",
      "objetivo": "Reduzir inflamação e a ativação da IDO, reduzir glutamato e estabilizar a glicemia.",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "Peixes", "detalhe": "sardinha, salmão, atum" },
          { "texto": "Ovos" }, { "texto": "Frutas vermelhas" }, { "texto": "Abacate" }, { "texto": "Azeite" },
          { "texto": "Vegetais verdes", "detalhe": "brócolis, couve, espinafre, aspargos" },
          { "texto": "Castanhas", "detalhe": "nozes, macadâmia, pistache" },
          { "texto": "Chá verde", "detalhe": "preferencialmente até o início da tarde" },
          { "texto": "Temperos", "detalhe": "cúrcuma, alecrim, orégano, gengibre, canela" }
        ]},
        { "titulo": "Reduzir", "tom": "negativo", "itens": [
          { "texto": "Açúcar" }, { "texto": "Ultraprocessados" }, { "texto": "Óleos vegetais refinados" },
          { "texto": "Álcool" }, { "texto": "Excesso de carne processada" }, { "texto": "Refrigerantes" },
          { "texto": "Bebidas energéticas" }, { "texto": "Excesso de glúten", "detalhe": "quando houver sensibilidade" }
        ]},
        { "titulo": "Atenção especial — intolerância à histamina", "tom": "dica", "itens": [
          { "texto": "Evitar temporariamente", "detalhe": "vinho, queijos maturados, embutidos, atum enlatado, fermentados, sobras aquecidas" }
        ]}
      ]
    },
    {
      "titulo": "Cafeína",
      "icone": "☕",
      "blocos": [
        { "titulo": "Ideal", "tom": "positivo", "itens": [
          { "texto": "Até 1 café pequeno", "detalhe": "somente pela manhã · antes das 10h" }
        ]},
        { "titulo": "Evitar", "tom": "negativo", "itens": [
          { "texto": "Energéticos" }, { "texto": "Pré-treinos estimulantes" }, { "texto": "Múltiplos cafés ao longo do dia" }
        ]}
      ]
    },
    {
      "titulo": "Atividade física",
      "icone": "🏃",
      "objetivo": "Reduzir catecolaminas, melhorar o BDNF, aumentar GABA e a sensibilidade autonômica.",
      "blocos": [
        { "titulo": "Semana", "tom": "neutro", "itens": [
          { "texto": "Segunda", "detalhe": "Musculação moderada · 45–60 min · sem falha em todas as séries" },
          { "texto": "Terça", "detalhe": "Caminhada · 40 min · Zona 2" },
          { "texto": "Quarta", "detalhe": "Musculação moderada" },
          { "texto": "Quinta", "detalhe": "Pilates, yoga, mobilidade ou caminhada" },
          { "texto": "Sexta", "detalhe": "Musculação" },
          { "texto": "Sábado", "detalhe": "Natureza · trilha leve, bicicleta leve, praia" },
          { "texto": "Domingo", "detalhe": "Descanso ativo" }
        ]},
        { "titulo": "Evite", "tom": "negativo", "itens": [
          { "texto": "HIIT diário" }, { "texto": "CrossFit intenso todos os dias" }, { "texto": "Treinar duas vezes ao dia" },
          { "texto": "Treinos acima de 90 minutos" }, { "texto": "Treinar muito tarde" }
        ]}
      ]
    },
    {
      "titulo": "Durante o trabalho",
      "icone": "💼",
      "blocos": [
        { "titulo": "A cada 90 minutos", "tom": "dica", "itens": [
          { "texto": "Levantar e andar 2 minutos" }, { "texto": "Respirar profundamente" },
          { "texto": "Alongar a cervical" }, { "texto": "Olhar para longe" }
        ]}
      ]
    },
    {
      "titulo": "Reduzir estímulos",
      "icone": "🔕",
      "blocos": [
        { "titulo": "Evite", "tom": "negativo", "itens": [
          { "texto": "Notificações constantes" }, { "texto": "Múltiplas telas" },
          { "texto": "Trabalhar ouvindo notícias" }, { "texto": "Discussões longas" },
          { "texto": "Ambientes extremamente barulhentos" }
        ]}
      ]
    },
    {
      "titulo": "Exposição à natureza",
      "icone": "🌳",
      "blocos": [
        { "titulo": "Ideal — 3x por semana, 30–60 min", "tom": "positivo", "itens": [
          { "texto": "Parques" }, { "texto": "Praia" }, { "texto": "Montanha" }, { "texto": "Jardins" }
        ]}
      ]
    },
    { "titulo": "Sol", "icone": "☀️", "texto": "20 minutos de sol diariamente." },
    {
      "titulo": "Relacionamentos",
      "icone": "🤝",
      "blocos": [
        { "titulo": "Priorizar", "tom": "positivo", "itens": [
          { "texto": "Conversas calmas" }, { "texto": "Família" }, { "texto": "Contato social positivo" },
          { "texto": "Evitar conflitos desnecessários" }
        ]}
      ]
    },
    {
      "titulo": "Higiene do sono",
      "icone": "🌙",
      "blocos": [
        { "titulo": "2 horas antes", "tom": "neutro", "itens": [
          { "texto": "Reduzir a iluminação da casa" }, { "texto": "Evitar reuniões" },
          { "texto": "Evitar trabalho intenso" }, { "texto": "Evitar redes sociais" }
        ]},
        { "titulo": "1 hora antes", "tom": "neutro", "itens": [
          { "texto": "Banho morno" }, { "texto": "Leitura" }, { "texto": "Respiração" }, { "texto": "Alongamento leve" }
        ]},
        { "titulo": "30 minutos antes", "tom": "negativo", "itens": [
          { "texto": "Nenhuma tela" }, { "texto": "Nenhum e-mail" }, { "texto": "Nenhuma notícia" },
          { "texto": "Quarto escuro, silencioso e com temperatura agradável" }
        ]},
        { "titulo": "Horário", "tom": "dica", "itens": [
          { "texto": "Dormir aproximadamente no mesmo horário todos os dias", "detalhe": "idealmente entre 22h e 23h" },
          { "texto": "Acordar aproximadamente no mesmo horário diariamente" }
        ]}
      ]
    },
    { "titulo": "Meditação", "icone": "🧘", "texto": "10–20 minutos todos os dias, preferencialmente no final da tarde ou à noite." },
    { "titulo": "Respiração", "icone": "🌬️", "texto": "2 a 3 vezes por dia, 5 minutos de respiração lenta — 4s inspirando e 6–8s expirando." },
    {
      "titulo": "Desaceleradores naturais",
      "icone": "🍃",
      "blocos": [
        { "tom": "positivo", "itens": [
          { "texto": "Ouvir música relaxante" }, { "texto": "Contato com animais" }, { "texto": "Jardinagem" },
          { "texto": "Caminhadas contemplativas" }, { "texto": "Atividades manuais (desenho, pintura, artesanato)" },
          { "texto": "Leitura de livros físicos" }
        ]}
      ]
    }
  ]
}
$json$::jsonb);
