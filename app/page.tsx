import QuestionnaireForm from "@/components/QuestionnaireForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm tracking-wide">
              Mental ABC
            </span>
          </div>
          <div className="text-xs text-slate-500 border border-slate-200 rounded-full px-3 py-1 bg-white">
            Saúde Integrativa
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-start px-4 py-10">

          {/* ── HERO ─────────────────────────────────────────────── */}
          <div className="text-center max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-700 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Formulações magistrais com base fisiológica real
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
              Você não está{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  fraco.
                </span>
              </span>
              <br />
              Seu sistema nervoso está{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                desequilibrado.
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 max-w-xl mx-auto">
              Ansiedade constante, cansaço sem fim ou humor instável têm origem fisiológica real — e solução magistral comprovada.
              Descubra em 5 minutos qual formulação foi feita para o seu perfil.
            </p>

            {/* Benefícios em linha */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                "✓ Avaliação gratuita em 5 minutos",
                "✓ Base fisiológica real",
                "✓ Prescrição personalizada em PDF",
              ].map((item) => (
                <span
                  key={item}
                  className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── CARDS DAS FÓRMULAS ────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-10">
            {[
              {
                nome: "SERENA",
                icone: "🌿",
                problema: "Pensa demais e não consegue desligar?",
                beneficio: "Calma genuína sem sedação. Mente em paz para viver.",
                bg: "bg-amber-50",
                borda: "border-amber-200",
                tituloColor: "text-amber-700",
                tag: "Para quem não desliga",
                tagBg: "bg-amber-100 text-amber-700",
              },
              {
                nome: "VIVA",
                icone: "✨",
                problema: "Cansado, sem motivação, precisando de café para funcionar?",
                beneficio: "Energia real de volta. Disposição e prazer de viver.",
                bg: "bg-blue-50",
                borda: "border-blue-200",
                tituloColor: "text-blue-700",
                tag: "Para quem perdeu a energia",
                tagBg: "bg-blue-100 text-blue-700",
              },
              {
                nome: "ÂNCORA",
                icone: "⚓",
                problema: "Dias bons e ruins sem padrão? Humor em montanha-russa?",
                beneficio: "Estabilidade emocional real. Chega de depender do acaso.",
                bg: "bg-purple-50",
                borda: "border-purple-200",
                tituloColor: "text-purple-700",
                tag: "Para quem vive em altos e baixos",
                tagBg: "bg-purple-100 text-purple-700",
              },
            ].map((item) => (
              <div
                key={item.nome}
                className={`${item.bg} border ${item.borda} rounded-2xl p-5 text-left flex flex-col gap-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icone}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.tagBg}`}>
                    {item.tag}
                  </span>
                </div>
                <div>
                  <p className={`text-xl font-black tracking-wide ${item.tituloColor}`}>
                    {item.nome}
                  </p>
                  <p className="text-sm text-slate-600 font-medium mt-1 leading-snug">
                    {item.problema}
                  </p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
                  {item.beneficio}
                </p>
              </div>
            ))}
          </div>

          {/* ── CTA + FORMULÁRIO ─────────────────────────────────── */}
          <div className="w-full max-w-2xl">
            <div className="text-center mb-6">
              <p className="text-slate-500 text-sm">
                Responda as 30 questões abaixo e descubra qual formulação é a sua.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <QuestionnaireForm />
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-400 text-center max-w-sm">
            Suas respostas são confidenciais e utilizadas exclusivamente para
            indicação da formulação adequada ao seu perfil.
          </p>
        </div>
      </div>
    </main>
  );
}
