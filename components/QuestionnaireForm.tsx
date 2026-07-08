"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ESCALA } from "@/lib/questions";
import { Resposta } from "@/lib/types";
import Turnstile from "@/components/Turnstile";

/** Pergunta recebida do servidor (subconjunto de perguntas do banco). */
export interface PerguntaProp {
  id: number;
  perfil_id: number;
  ordem: number;
  texto: string;
}

const TOTAL_STEPS = 4; // 3 blocos de perguntas + 1 passo de dados

/** Cores e nome de cada bloco, por perfil (1→Calm, 2→Energy, 3→Balance). */
const perfilUI: Record<number, { nome: string; badge: string; botao: string }> = {
  1: {
    nome: "Mente & Alerta",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    botao: "bg-teal-500 text-white ring-2 ring-teal-400/30",
  },
  2: {
    nome: "Energia & Motivação",
    badge: "bg-lime-50 text-lime-700 border-lime-200",
    botao: "bg-lime-500 text-white ring-2 ring-lime-400/30",
  },
  3: {
    nome: "Humor & Estabilidade",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    botao: "bg-emerald-500 text-white ring-2 ring-emerald-400/30",
  },
};

const PASSO_DADOS = 4;

export default function QuestionnaireForm({ perguntas }: { perguntas: PerguntaProp[] }) {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Nesta etapa coletamos apenas nome e e-mail. CPF e endereço são
  // coletados depois, no checkout do Stripe (dados de entrega/cobrança).
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [consentimento, setConsentimento] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileAtivo = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const [respostas, setRespostas] = useState<Record<number, Resposta>>({});

  // Ao trocar de passo, rola o formulário de volta ao topo
  const topoRef = useRef<HTMLDivElement>(null);
  const primeiraRenderizacao = useRef(true);
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    topoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [passo]);

  // passos 1, 2, 3 → perfis 1, 2, 3
  const perfilAtual = passo;
  const naDados = passo === PASSO_DADOS;

  const perguntasPerfilAtual = () => perguntas.filter((p) => p.perfil_id === perfilAtual);

  const perfilCompleto = () =>
    perguntasPerfilAtual().every((p) => respostas[p.id] !== undefined);

  const dadosValidos = () =>
    nome.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    consentimento &&
    (!turnstileAtivo || !!turnstileToken);

  const progresso = ((passo - 1) / TOTAL_STEPS) * 100;

  const handleSubmit = async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: { nome, email, consentimento },
          respostas,
          turnstileToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao enviar");

      sessionStorage.setItem(
        "vivea_resultado",
        JSON.stringify({
          formula: data.formula,
          pontos: data.pontuacaoTotal,
          avaliacaoId: data.avaliacaoId,
          precoCentavos: data.precoCentavos ?? 0,
          emailOk: data.emailOk ?? null,
        })
      );

      router.push("/resultado");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao enviar formulário");
      setCarregando(false);
    }
  };

  const ui = perfilUI[perfilAtual] ?? perfilUI[1];
  const passosLabel = ["Bloco 1", "Bloco 2", "Bloco 3", "Dados"];

  return (
    <div ref={topoRef} className="w-full max-w-2xl mx-auto scroll-mt-4">
      {/* Barra de progresso */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-500">
            {naDados ? "Seus dados" : `Bloco ${passo} — ${ui.nome}`}
          </span>
          <span className="text-sm font-semibold text-emerald-600">{Math.round(progresso)}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {passosLabel.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i + 1 < passo
                    ? "bg-emerald-500 text-white"
                    : i + 1 === passo
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white ring-2 ring-emerald-300"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {i + 1 < passo ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i + 1 === passo ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PASSOS 1–3: Questões por perfil */}
      {!naDados && (
        <div className="animate-fadeIn">
          <div className="mb-5">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${ui.badge}`}>
              Bloco {passo} • {ui.nome}
            </div>
            <p className="text-slate-500 text-sm">Responda com base nos últimos 3 a 6 meses.</p>
          </div>

          <div className="space-y-3">
            {perguntasPerfilAtual().map((pergunta, idx) => (
              <div key={pergunta.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-slate-800 text-sm font-medium mb-3 leading-relaxed">
                  <span className="text-slate-400 mr-2">{idx + 1}.</span>
                  {pergunta.texto}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {ESCALA.map((opcao) => (
                    <button
                      key={opcao.valor}
                      onClick={() => setRespostas({ ...respostas, [pergunta.id]: opcao.valor as Resposta })}
                      className={`py-2.5 px-1 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        respostas[pergunta.id] === opcao.valor
                          ? ui.botao
                          : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                    >
                      <span className="block text-base font-bold">{opcao.valor}</span>
                      <span className="block text-[10px] mt-0.5 opacity-80">{opcao.rotulo}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-5">
            {passo > 1 && (
              <button
                onClick={() => setPasso(passo - 1)}
                className="px-6 py-3.5 rounded-xl font-medium text-slate-600 bg-white hover:bg-slate-50 transition border border-slate-200 shadow-sm"
              >
                ← Voltar
              </button>
            )}
            <button
              onClick={() => setPasso(passo + 1)}
              disabled={!perfilCompleto()}
              className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {passo < 3 ? "Próximo Bloco →" : "Ver Meu Resultado →"}
            </button>
          </div>
        </div>
      )}

      {/* PASSO 4: Dados para receber o resultado */}
      {naDados && (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Quase lá!</h2>
            <p className="text-slate-500 text-sm">
              Informe seus dados para ver seu perfil e receber seu guia personalizado por e-mail.
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Enviaremos seu guia personalizado para este e-mail. Os dados de entrega
                serão solicitados apenas na finalização da compra.
              </p>
            </div>
          </div>

          {/* Consentimento LGPD */}
          <label className="flex items-start gap-3 mt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentimento}
              onChange={(e) => setConsentimento(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-emerald-500 cursor-pointer"
            />
            <span className="text-xs leading-relaxed text-slate-500">
              Li e concordo com a{" "}
              <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline hover:text-emerald-700">
                Política de Privacidade
              </a>{" "}
              e autorizo o tratamento dos meus dados pessoais e de saúde para a indicação
              da formulação, contato da farmácia parceira e processamento do pagamento,
              nos termos da LGPD (Lei nº 13.709/2018).
            </span>
          </label>

          {turnstileAtivo && (
            <div className="flex justify-center">
              <Turnstile onToken={setTurnstileToken} />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setPasso(3)}
              className="px-6 py-3.5 rounded-xl font-medium text-slate-600 bg-white hover:bg-slate-50 transition border border-slate-200 shadow-sm"
            >
              ← Voltar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!dadosValidos() || carregando}
              className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {carregando ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Calculando...
                </span>
              ) : (
                "Ver Meu Resultado ✦"
              )}
            </button>
          </div>

          {erro && (
            <p className="mt-1 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {erro}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
