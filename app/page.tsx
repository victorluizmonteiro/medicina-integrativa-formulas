import QuestionnaireForm from "@/components/QuestionnaireForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Fundo decorativo sutil */}
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

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col items-center justify-start px-4 py-10">
          {/* Hero */}
          <div className="text-center mb-8 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-700 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Avaliação Clínica Personalizada
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3">
              Descubra sua{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                fórmula ideal
              </span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Responda 30 questões com base fisiológica real e receba uma
              prescrição personalizada para o seu perfil.
            </p>
          </div>

          {/* Cards de perfis */}
          <div className="grid grid-cols-3 gap-3 max-w-lg w-full mb-8">
            {[
              { letra: "A", nome: "Mente Acelerada", icone: "⚡", bg: "bg-amber-50", borda: "border-amber-200", texto: "text-amber-700" },
              { letra: "B", nome: "Sem Energia",     icone: "🔋", bg: "bg-blue-50",  borda: "border-blue-200",  texto: "text-blue-700" },
              { letra: "C", nome: "Instável",        icone: "🌊", bg: "bg-purple-50",borda: "border-purple-200",texto: "text-purple-700" },
            ].map((item) => (
              <div
                key={item.letra}
                className={`${item.bg} border ${item.borda} rounded-2xl p-3 text-center`}
              >
                <div className="text-xl mb-1">{item.icone}</div>
                <div className={`text-xs font-bold mb-0.5 ${item.texto}`}>
                  Fórmula {item.letra}
                </div>
                <div className="text-[11px] text-slate-500">{item.nome}</div>
              </div>
            ))}
          </div>

          {/* Formulário */}
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <QuestionnaireForm />
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
