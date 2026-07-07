"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ESCALA } from "@/lib/questions";
import { DadosCliente, Resposta } from "@/lib/types";
import Turnstile from "@/components/Turnstile";

/** Pergunta recebida do servidor (subconjunto de perguntas do banco). */
export interface PerguntaProp {
  id: number;
  perfil_id: number;
  ordem: number;
  texto: string;
}

const TOTAL_STEPS = 4;

function formatarCPF(valor: string) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function formatarCEP(valor: string) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2")
    .slice(0, 9);
}

function formatarTelefone(valor: string) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2")
    .slice(0, 15);
}

/** Cores e nome de cada bloco, por perfil (1→Vitalyx Calm, 2→Vitalyx Energy, 3→Vitalyx Balance). */
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

export default function QuestionnaireForm({ perguntas }: { perguntas: PerguntaProp[] }) {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [cliente, setCliente] = useState<DadosCliente>({
    nome: "", cpf: "", idade: "", telefone: "", email: "",
    cep: "", endereco: "", numero: "", complemento: "", cidade: "", estado: "",
  });

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [consentimento, setConsentimento] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileAtivo = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Autopreenchimento de endereço via ViaCEP quando o CEP tiver 8 dígitos
  const buscarCep = async (cepFormatado: string) => {
    const digitos = cepFormatado.replace(/\D/g, "");
    if (digitos.length !== 8) return;
    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setCliente((c) => ({
          ...c,
          endereco: data.logradouro || c.endereco,
          cidade: data.localidade || c.cidade,
          estado: data.uf || c.estado,
        }));
      }
    } catch {
      // silencioso — usuário pode preencher manualmente
    } finally {
      setBuscandoCep(false);
    }
  };

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

  // passo 2 → perfil 1, passo 3 → perfil 2, passo 4 → perfil 3
  const perfilAtual = passo - 1;

  const perguntasPerfilAtual = () =>
    perguntas.filter((p) => p.perfil_id === perfilAtual);

  const perfilCompleto = () =>
    perguntasPerfilAtual().every((p) => respostas[p.id] !== undefined);

  const dadosClienteValidos = () =>
    cliente.nome.trim() &&
    cliente.cpf.replace(/\D/g, "").length === 11 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email.trim()) &&
    consentimento;

  const progresso = ((passo - 1) / TOTAL_STEPS) * 100;

  const handleSubmit = async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente: { ...cliente, consentimento }, respostas, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao enviar");

      // Armazena resultado na sessão — nenhum dado sensível vai para a URL
      sessionStorage.setItem(
        "vivea_resultado",
        JSON.stringify({
          formula: data.formula,
          pontos: data.pontuacaoTotal,
          avaliacaoId: data.avaliacaoId,
          precoCentavos: data.precoCentavos ?? 0,
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

  const ui = perfilUI[perfilAtual] ?? perfilUI[1];

  return (
    <div ref={topoRef} className="w-full max-w-2xl mx-auto scroll-mt-4">
      {/* Barra de progresso */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-500">
            {passo === 1 ? "Seus dados" : `Bloco ${perfilAtual} — ${ui.nome}`}
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
          {["Dados", "Bloco 1", "Bloco 2", "Bloco 3"].map((label, i) => (
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={cliente.email}
                onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  CEP {buscandoCep && <span className="text-emerald-500 text-xs">buscando…</span>}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cliente.cep}
                  onChange={(e) => {
                    const cep = formatarCEP(e.target.value);
                    setCliente({ ...cliente, cep });
                    buscarCep(cep);
                  }}
                  placeholder="00000-000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
                <input
                  type="text"
                  value={cliente.estado}
                  onChange={(e) => setCliente({ ...cliente, estado: e.target.value.toUpperCase().slice(0, 2) })}
                  placeholder="UF"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço</label>
              <input
                type="text"
                value={cliente.endereco}
                onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
                placeholder="Rua / Avenida"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Número</label>
                <input
                  type="text"
                  value={cliente.numero}
                  onChange={(e) => setCliente({ ...cliente, numero: e.target.value })}
                  placeholder="123"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Complemento</label>
                <input
                  type="text"
                  value={cliente.complemento}
                  onChange={(e) => setCliente({ ...cliente, complemento: e.target.value })}
                  placeholder="Apto, bloco…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cidade</label>
              <input
                type="text"
                value={cliente.cidade}
                onChange={(e) => setCliente({ ...cliente, cidade: e.target.value })}
                placeholder="Cidade"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
              />
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
              <a
                href="/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline hover:text-emerald-700"
              >
                Política de Privacidade
              </a>{" "}
              e autorizo o tratamento dos meus dados pessoais e de saúde para a
              indicação da formulação, contato da farmácia parceira e processamento
              do pagamento, nos termos da LGPD (Lei nº 13.709/2018).
            </span>
          </label>

          <button
            onClick={() => setPasso(2)}
            disabled={!dadosClienteValidos()}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm mt-2"
          >
            Iniciar Avaliação →
          </button>
        </div>
      )}

      {/* PASSOS 2, 3, 4: Questões por perfil */}
      {passo >= 2 && passo <= 4 && (
        <div className="animate-fadeIn">
          <div className="mb-5">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${ui.badge}`}>
              Bloco {perfilAtual} • {ui.nome}
            </div>
            <p className="text-slate-500 text-sm">
              Responda com base nos últimos 3 a 6 meses.
            </p>
          </div>

          <div className="space-y-3">
            {perguntasPerfilAtual().map((pergunta, idx) => (
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

          {passo === 4 && turnstileAtivo && (
            <div className="mt-5 flex justify-center">
              <Turnstile onToken={setTurnstileToken} />
            </div>
          )}

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
                disabled={!perfilCompleto()}
                className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Próximo Bloco →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!perfilCompleto() || carregando || (turnstileAtivo && !turnstileToken)}
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
