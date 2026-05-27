"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PERGUNTAS, ESCALA } from "@/lib/questions";
import { DadosCliente, Resposta } from "@/lib/types";

const TOTAL_STEPS = 4;

function formatarCPF(valor: string) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function formatarTelefone(valor: string) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2")
    .slice(0, 15);
}

export default function QuestionnaireForm() {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [cliente, setCliente] = useState<DadosCliente>({
    nome: "", cpf: "", idade: "", telefone: "", email: "",
  });

  const [respostas, setRespostas] = useState<Record<number, Resposta>>({});

  const secaoAtual = passo === 2 ? "A" : passo === 3 ? "B" : "C";

  const perguntasSecaoAtual = () =>
    PERGUNTAS.filter((p) => p.secao === secaoAtual);

  const secaoAtualCompleta = () =>
    perguntasSecaoAtual().every((p) => respostas[p.id] !== undefined);

  const dadosClienteValidos = () =>
    cliente.nome.trim() && cliente.cpf.replace(/\D/g, "").length === 11;

  const progresso = ((passo - 1) / TOTAL_STEPS) * 100;

  const handleSubmit = async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, respostas }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao enviar");

      // Armazena resultado na sessão — nenhum dado sensível vai para a URL
      sessionStorage.setItem(
        "vivea_resultado",
        JSON.stringify({
          formula: data.formula,
          pontos: data.pontuacaoTotal,
          nome: data.cliente.nome,
          cpf: data.cliente.cpf,
          emailOk: data.emailOk ?? null,
        })
      );

      router.push("/resultado");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao enviar formulário");
      setCarregando(false);
    }
  };

  const corSecao: Record<string, { badge: string; botao: string; selecionado: string }> = {
    A: {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      botao: "bg-amber-500 text-white ring-2 ring-amber-400/30",
      selecionado: "bg-amber-500",
    },
    B: {
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      botao: "bg-blue-500 text-white ring-2 ring-blue-400/30",
      selecionado: "bg-blue-500",
    },
    C: {
      badge: "bg-purple-50 text-purple-700 border-purple-200",
      botao: "bg-purple-500 text-white ring-2 ring-purple-400/30",
      selecionado: "bg-purple-500",
    },
  };

  const nomeSecao: Record<string, string> = {
    A: "Mente & Alerta",
    B: "Energia & Motivação",
    C: "Humor & Estabilidade",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Barra de progresso */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-500">
            {passo === 1 ? "Seus dados" : `Bloco ${secaoAtual} — ${nomeSecao[secaoAtual]}`}
          </span>
          <span className="text-sm font-semibold text-emerald-600">
            {Math.round(progresso)}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {["Dados", "Bloco A", "Bloco B", "Bloco C"].map((label, i) => (
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

      {/* PASSO 1: Dados pessoais */}
      {passo === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Olá! Vamos começar.</h2>
            <p className="text-slate-500 text-sm">
              Preencha seus dados para receber a prescrição personalizada.
            </p>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cliente.nome}
                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                placeholder="Seu nome completo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  CPF <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cliente.cpf}
                  onChange={(e) => setCliente({ ...cliente, cpf: formatarCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Idade</label>
                <input
                  type="number"
                  value={cliente.idade}
                  onChange={(e) => setCliente({ ...cliente, idade: e.target.value })}
                  placeholder="Ex: 35"
                  min="1" max="120"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={cliente.telefone}
                onChange={(e) => setCliente({ ...cliente, telefone: formatarTelefone(e.target.value) })}
                placeholder="(11) 99999-9999"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={cliente.email}
                onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>
          </div>

          <button
            onClick={() => setPasso(2)}
            disabled={!dadosClienteValidos()}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm mt-2"
          >
            Iniciar Avaliação →
          </button>
        </div>
      )}

      {/* PASSOS 2, 3, 4: Questões */}
      {passo >= 2 && passo <= 4 && (
        <div className="animate-fadeIn">
          <div className="mb-5">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${corSecao[secaoAtual].badge}`}>
              Bloco {secaoAtual} • {nomeSecao[secaoAtual]}
            </div>
            <p className="text-slate-500 text-sm">
              Responda com base nos últimos 3 a 6 meses.
            </p>
          </div>

          <div className="space-y-3">
            {perguntasSecaoAtual().map((pergunta, idx) => (
              <div
                key={pergunta.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
              >
                <p className="text-slate-800 text-sm font-medium mb-3 leading-relaxed">
                  <span className="text-slate-400 mr-2">{idx + 1}.</span>
                  {pergunta.texto}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {ESCALA.map((opcao) => (
                    <button
                      key={opcao.valor}
                      onClick={() =>
                        setRespostas({ ...respostas, [pergunta.id]: opcao.valor as Resposta })
                      }
                      className={`py-2.5 px-1 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        respostas[pergunta.id] === opcao.valor
                          ? corSecao[secaoAtual].botao
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
            <button
              onClick={() => setPasso(passo - 1)}
              className="px-6 py-3.5 rounded-xl font-medium text-slate-600 bg-white hover:bg-slate-50 transition border border-slate-200 shadow-sm"
            >
              ← Voltar
            </button>

            {passo < 4 ? (
              <button
                onClick={() => setPasso(passo + 1)}
                disabled={!secaoAtualCompleta()}
                className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Próximo Bloco →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!secaoAtualCompleta() || carregando}
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
                  "Ver Minha Prescrição ✦"
                )}
              </button>
            )}
          </div>

          {erro && (
            <p className="mt-3 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {erro}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
