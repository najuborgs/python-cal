import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Delete,
  Equal,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { pyodideService, PythonCalculationResponse } from '../services/pyodideService';

interface HistoryItem {
  id: string;
  expressao: string;
  resultado: string;
  tempoMs: number;
  data: string;
  tipoDado?: string;
}

export const Calculator: React.FC = () => {
  const [expressao, setExpressao] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [ultimoResultado, setUltimoResultado] = useState<string | null>(null);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);
  const [isCalculando, setIsCalculando] = useState<boolean>(false);
  const [ultimoTempoPython, setUltimoTempoPython] = useState<number | null>(null);
  const [modoCientifico, setModoCientifico] = useState<boolean>(true);
  const [emGraus, setEmGraus] = useState<boolean>(true);
  const [historico, setHistorico] = useState<HistoryItem[]>(() => {
    try {
      const salvo = localStorage.getItem('pycalc_history');
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });
  const [mostrarHistoricoMobile, setMostrarHistoricoMobile] = useState<boolean>(false);

  const displayRef = useRef<HTMLDivElement>(null);

  // Salva histórico no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pycalc_history', JSON.stringify(historico.slice(0, 30)));
    } catch {
      // Ignora erro de cota
    }
  }, [historico]);

  // Teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evita interceptar se estiver em um input ou textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        inserirCaractere(e.key);
      } else if (e.key === '.') {
        inserirDecimal();
      } else if (e.key === '%') {
        e.preventDefault();
        inserirPorcentagem();
      } else if (e.key === '+') {
        inserirOperador('+');
      } else if (e.key === '-') {
        inserirOperador('-');
      } else if (e.key === '*') {
        inserirOperador('×');
      } else if (e.key === '/') {
        e.preventDefault();
        inserirOperador('÷');
      } else if (e.key === '^') {
        inserirOperador('^');
      } else if (e.key === '(' || e.key === ')') {
        inserirCaractere(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calcular();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        apagarUltimo();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        limparTudo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expressao, displayValue, ultimoResultado, emGraus]);

  // Inserção de dígitos 0-9
  const inserirCaractere = (char: string) => {
    setErroMensagem(null);
    if (ultimoResultado !== null) {
      // Se acabou de calcular e digitou número, começa nova conta
      setExpressao(char);
      setDisplayValue(char);
      setUltimoResultado(null);
      return;
    }

    if (displayValue === '0' && char !== '.') {
      setDisplayValue(char);
      setExpressao(char);
    } else {
      setDisplayValue((prev) => prev + char);
      setExpressao((prev) => prev + char);
    }
  };

  // Inserção de ponto decimal para float()
  const inserirDecimal = () => {
    setErroMensagem(null);
    if (ultimoResultado !== null) {
      setExpressao('0.');
      setDisplayValue('0.');
      setUltimoResultado(null);
      return;
    }

    // Pega o último token numérico para evitar múltiplos pontos como 1.2.3
    const partes = expressao.split(/[+\-×÷^()%]/);
    const ultimoToken = partes[partes.length - 1] || '';

    if (!ultimoToken.includes('.')) {
      const valor = ultimoToken === '' ? '0.' : '.';
      setExpressao((prev) => (prev === '' ? '0.' : prev + valor));
      setDisplayValue((prev) => (prev === '0' ? '0.' : prev + valor));
    }
  };

  // Inserção de porcentagem (%)
  const inserirPorcentagem = () => {
    setErroMensagem(null);

    // Se já havia um resultado anterior, aplica porcentagem sobre ele (ex: 50 -> 50%)
    if (ultimoResultado !== null) {
      setExpressao(ultimoResultado + '%');
      setDisplayValue(ultimoResultado + '%');
      setUltimoResultado(null);
      return;
    }

    if (!expressao || expressao === '0') {
      return;
    }

    const trimmed = expressao.trim();
    const ultimoChar = trimmed.slice(-1);

    // Evita duplicar % ou colocar imediatamente após operadores
    if (['+', '-', '×', '÷', '^', '*', '/', '('].includes(ultimoChar)) {
      return;
    }

    if (ultimoChar === '%') {
      return;
    }

    setExpressao(expressao + '%');
    setDisplayValue((prev) => (prev.endsWith('%') ? prev : prev + '%'));
  };

  // Inserção de operadores aritméticos +, -, ×, ÷, ^
  const inserirOperador = (op: string) => {
    setErroMensagem(null);

    // Se já tinha um resultado anterior, continua a partir dele
    if (ultimoResultado !== null) {
      setExpressao(ultimoResultado + ' ' + op + ' ');
      setDisplayValue(op);
      setUltimoResultado(null);
      return;
    }

    if (!expressao) {
      if (op === '-') {
        setExpressao('-');
        setDisplayValue('-');
      }
      return;
    }

    const trimmed = expressao.trim();
    const ultimoChar = trimmed.slice(-1);

    // Se o último caractere for operador, substitui
    if (['+', '-', '×', '÷', '^', '*'].includes(ultimoChar)) {
      setExpressao(trimmed.slice(0, -1) + ' ' + op + ' ');
    } else {
      setExpressao(expressao + ' ' + op + ' ');
    }
    setDisplayValue(op);
  };

  // Inversão de sinal (+/-)
  const inverterSinal = async () => {
    setErroMensagem(null);
    const alvo = ultimoResultado !== null ? ultimoResultado : displayValue;
    if (alvo && alvo !== '0') {
      try {
        const resp = await pyodideService.executarOperacao('inverter', alvo);
        if (resp.sucesso && resp.resultado !== undefined) {
          setDisplayValue(resp.resultado);
          setExpressao(resp.resultado);
          setUltimoResultado(resp.resultado);
          if (resp.tempo_execucao_ms) setUltimoTempoPython(resp.tempo_execucao_ms);
        }
      } catch (err: any) {
        setErroMensagem(err.message || 'Erro ao inverter sinal');
      }
    }
  };

  // Funções científicas diretas (sin, cos, tan, sqrt, log, ln, fact)
  const aplicarFuncaoCientifica = (nomeFunc: string) => {
    setErroMensagem(null);
    if (ultimoResultado !== null) {
      setExpressao(`${nomeFunc}(${ultimoResultado})`);
      setDisplayValue(`${nomeFunc}(${ultimoResultado})`);
      setUltimoResultado(null);
    } else if (expressao) {
      setExpressao(`${nomeFunc}(${expressao})`);
      setDisplayValue(`${nomeFunc}(${displayValue})`);
    } else {
      setExpressao(`${nomeFunc}(`);
      setDisplayValue(`${nomeFunc}(`);
    }
  };

  // Potência ao quadrado x²
  const aplicarQuadrado = () => {
    setErroMensagem(null);
    if (ultimoResultado !== null) {
      setExpressao(`${ultimoResultado} ^ 2`);
      setDisplayValue('^ 2');
      setUltimoResultado(null);
    } else if (expressao) {
      setExpressao(`(${expressao}) ^ 2`);
      setDisplayValue('^ 2');
    }
  };

  // Inserir constante matemática (π ou e)
  const inserirConstante = (constante: string) => {
    setErroMensagem(null);
    if (ultimoResultado !== null) {
      setExpressao(constante);
      setDisplayValue(constante);
      setUltimoResultado(null);
    } else {
      const sep = expressao && !expressao.endsWith(' ') && !expressao.endsWith('(') ? ' × ' : '';
      setExpressao((prev) => prev + sep + constante);
      setDisplayValue(constante);
    }
  };

  // Apagar último caractere (DEL)
  const apagarUltimo = () => {
    setErroMensagem(null);
    if (ultimoResultado !== null) {
      limparTudo();
      return;
    }

    if (expressao.length <= 1) {
      limparTudo();
      return;
    }

    const novaExpr = expressao.slice(0, -1).trimEnd();
    setExpressao(novaExpr);

    const partes = novaExpr.split(' ');
    const ultimo = partes[partes.length - 1];
    setDisplayValue(ultimo || '0');
  };

  // Limpar operação (C)
  const limparTudo = () => {
    setExpressao('');
    setDisplayValue('0');
    setUltimoResultado(null);
    setErroMensagem(null);
  };

  // Executar cálculo em Python via Pyodide WebAssembly
  const calcular = async () => {
    if (!expressao || isCalculando) return;

    setIsCalculando(true);
    setErroMensagem(null);

    try {
      const resp: PythonCalculationResponse = await pyodideService.calcularExpressao(
        expressao,
        emGraus
      );

      if (resp.sucesso && resp.resultado !== undefined) {
        setDisplayValue(resp.resultado);
        setUltimoResultado(resp.resultado);
        if (resp.tempo_execucao_ms !== undefined) {
          setUltimoTempoPython(resp.tempo_execucao_ms);
        }

        // Adiciona ao histórico de cálculos
        const novoItem: HistoryItem = {
          id: Date.now().toString(),
          expressao: expressao,
          resultado: resp.resultado,
          tempoMs: resp.tempo_execucao_ms || 1.2,
          data: new Date().toLocaleTimeString(),
          tipoDado: resp.tipo_dado || 'float',
        };

        setHistorico((prev) => [novoItem, ...prev]);
      } else {
        // Erro retornado pelo Python (ZeroDivisionError, ValueError, etc)
        setErroMensagem(resp.erro || 'Erro no processamento matemático');
        if (resp.tipo_erro === 'ZeroDivisionError') {
          setDisplayValue('Erro: Divisão por Zero');
        } else {
          setDisplayValue('Erro');
        }
      }
    } catch (err: any) {
      setErroMensagem(`Falha no interpretador Python: ${err.message || 'Erro inesperado'}`);
      setDisplayValue('Erro');
    } finally {
      setIsCalculando(false);
    }
  };

  // Reusar item do histórico
  const usarHistorico = (item: HistoryItem) => {
    setExpressao(item.resultado);
    setDisplayValue(item.resultado);
    setUltimoResultado(item.resultado);
    setErroMensagem(null);
  };

  const limparHistorico = () => {
    setHistorico([]);
    try {
      localStorage.removeItem('pycalc_history');
    } catch {
      // Ignora
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Banner de Execução Real em Python */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950 border border-blue-500/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Calculadora Científica com Motor CPython 3.12 (WASM)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Cada tecla, soma, subtração, raiz ou divisão é avaliada diretamente no interpretador
              Python via WebAssembly no seu navegador.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setModoCientifico(!modoCientifico)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              modoCientifico
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {modoCientifico ? 'Modo Científico Ativo' : 'Modo Padrão'}
          </button>

          {modoCientifico && (
            <button
              onClick={() => setEmGraus(!emGraus)}
              className="px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-900 border border-slate-800 text-blue-400 hover:border-blue-500/40 transition-colors"
            >
              {emGraus ? 'DEG (Graus)' : 'RAD (Radianos)'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Painel Principal da Calculadora (7 a 8 colunas no desktop) */}
        <div className={`lg:col-span-8 space-y-4`}>
          {/* Caixa da Calculadora */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 p-5 sm:p-7 shadow-2xl shadow-black/60 relative overflow-hidden">
            {/* Brilho decorativo no canto superior */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* VISOR GRANDE DA CALCULADORA */}
            <div
              ref={displayRef}
              className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-6 mb-6 shadow-inner relative"
            >
              {/* Barra de Status do Visor */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2 pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-[11px] text-blue-400 font-semibold">PYTHON WASM</span>
                  {modoCientifico && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {emGraus ? 'DEG' : 'RAD'}
                    </span>
                  )}
                </div>

                {ultimoTempoPython !== null && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    <Clock className="w-3 h-3" />
                    <span>CPython: {ultimoTempoPython} ms</span>
                  </div>
                )}
              </div>

              {/* Linha da Expressão Matemática digitada */}
              <div className="min-h-[28px] text-sm sm:text-base text-slate-400 font-mono overflow-x-auto whitespace-nowrap scrollbar-none tracking-wide text-right">
                {expressao || '0'}
              </div>

              {/* Linha do Resultado em Destaque */}
              <div className="mt-1 text-right">
                <div
                  className={`font-mono font-bold tracking-tight text-3xl sm:text-5xl truncate transition-all ${
                    erroMensagem
                      ? 'text-rose-400 text-2xl sm:text-3xl'
                      : ultimoResultado !== null
                      ? 'text-blue-400'
                      : 'text-white'
                  }`}
                >
                  {displayValue}
                </div>
              </div>

              {/* Alerta de Divisão por Zero ou Erro Específico */}
              {erroMensagem && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-rose-200">
                      Exceção Capturada no Python:
                    </span>{' '}
                    {erroMensagem}
                  </div>
                </div>
              )}
            </div>

            {/* TECLADO DA CALCULADORA */}
            <div className="space-y-2.5">
              {/* Linha de Funções Científicas (se modo científico ativo) */}
              {modoCientifico && (
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 pb-2 mb-1 border-b border-slate-800/60">
                  <button
                    onClick={() => aplicarFuncaoCientifica('sin')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Seno (função seno em Python)"
                  >
                    sin
                  </button>
                  <button
                    onClick={() => aplicarFuncaoCientifica('cos')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Cosseno (função cosseno em Python)"
                  >
                    cos
                  </button>
                  <button
                    onClick={() => aplicarFuncaoCientifica('tan')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Tangente"
                  >
                    tan
                  </button>
                  <button
                    onClick={() => aplicarFuncaoCientifica('sqrt')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Raiz Quadrada (math.sqrt)"
                  >
                    √x
                  </button>
                  <button
                    onClick={aplicarQuadrado}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Potência ao quadrado (x²)"
                  >
                    x²
                  </button>
                  <button
                    onClick={() => inserirOperador('^')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Potência genérica (base ^ expoente)"
                  >
                    xʸ
                  </button>
                  <button
                    onClick={() => aplicarFuncaoCientifica('fact')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95 hidden sm:block"
                    title="Fatorial (math.factorial)"
                  >
                    x!
                  </button>

                  <button
                    onClick={() => aplicarFuncaoCientifica('log')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Logaritmo base 10 (math.log10)"
                  >
                    log
                  </button>
                  <button
                    onClick={() => aplicarFuncaoCientifica('ln')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Logaritmo natural (math.log)"
                  >
                    ln
                  </button>
                  <button
                    onClick={() => inserirConstante('π')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Constante Pi (math.pi)"
                  >
                    π
                  </button>
                  <button
                    onClick={() => inserirConstante('e')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Constante de Euler (math.e)"
                  >
                    e
                  </button>
                  <button
                    onClick={() => inserirCaractere('(')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                  >
                    (
                  </button>
                  <button
                    onClick={() => inserirCaractere(')')}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                  >
                    )
                  </button>
                  <button
                    onClick={inserirPorcentagem}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 text-blue-300 hover:text-blue-200 border border-slate-800/80 font-mono text-xs transition-all active:scale-95"
                    title="Cálculo de Porcentagem (%)"
                  >
                    %
                  </button>
                </div>
              )}

              {/* Grid Principal de Teclas (4 Colunas) */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {/* Linha 1: Limpar (C), Apagar (DEL), Inverter (+/-), Divisão (÷) */}
                <button
                  onClick={limparTudo}
                  className="h-14 sm:h-16 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 hover:text-rose-100 border border-rose-800/40 font-semibold text-lg transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
                  title="Limpar toda a operação (C)"
                >
                  <RotateCcw className="w-5 h-5 text-rose-400" />
                  <span>C</span>
                </button>

                <button
                  onClick={apagarUltimo}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 border border-slate-700/60 font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-1 shadow-sm"
                  title="Apagar último caractere (Backspace)"
                >
                  <Delete className="w-5 h-5 text-slate-400" />
                  <span>DEL</span>
                </button>

                <button
                  onClick={inverterSinal}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 border border-slate-700/60 font-semibold text-lg transition-all active:scale-95 shadow-sm"
                  title="Inverter sinal (+/-)"
                >
                  ±
                </button>

                <button
                  onClick={() => inserirOperador('÷')}
                  className="h-14 sm:h-16 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 font-bold text-2xl transition-all active:scale-95 shadow-sm shadow-blue-900/20"
                  title="Operação de Divisão (em Python: dividir(a, b))"
                >
                  ÷
                </button>

                {/* Linha 2: 7, 8, 9, Multiplicação (×) */}
                <button
                  onClick={() => inserirCaractere('7')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  7
                </button>
                <button
                  onClick={() => inserirCaractere('8')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  8
                </button>
                <button
                  onClick={() => inserirCaractere('9')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  9
                </button>
                <button
                  onClick={() => inserirOperador('×')}
                  className="h-14 sm:h-16 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 font-bold text-2xl transition-all active:scale-95 shadow-sm shadow-blue-900/20"
                  title="Operação de Multiplicação (em Python: multiplicar(a, b))"
                >
                  ×
                </button>

                {/* Linha 3: 4, 5, 6, Subtração (-) */}
                <button
                  onClick={() => inserirCaractere('4')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  4
                </button>
                <button
                  onClick={() => inserirCaractere('5')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  5
                </button>
                <button
                  onClick={() => inserirCaractere('6')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  6
                </button>
                <button
                  onClick={() => inserirOperador('-')}
                  className="h-14 sm:h-16 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 font-bold text-2xl transition-all active:scale-95 shadow-sm shadow-blue-900/20"
                  title="Operação de Subtração (em Python: subtrair(a, b))"
                >
                  −
                </button>

                {/* Linha 4: 1, 2, 3, Adição (+) */}
                <button
                  onClick={() => inserirCaractere('1')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  1
                </button>
                <button
                  onClick={() => inserirCaractere('2')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  2
                </button>
                <button
                  onClick={() => inserirCaractere('3')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  3
                </button>
                <button
                  onClick={() => inserirOperador('+')}
                  className="h-14 sm:h-16 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 font-bold text-2xl transition-all active:scale-95 shadow-sm shadow-blue-900/20"
                  title="Operação de Adição (em Python: somar(a, b))"
                >
                  +
                </button>

                {/* Linha 5: 0, Ponto decimal (.), Porcentagem (%), Calcular (=) */}
                <button
                  onClick={() => inserirCaractere('0')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                >
                  0
                </button>

                <button
                  onClick={inserirDecimal}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                  title="Separador decimal float()"
                >
                  .
                </button>

                <button
                  onClick={inserirPorcentagem}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/70 font-semibold text-2xl font-mono transition-all active:scale-95 shadow-sm"
                  title="Cálculo de Porcentagem (%)"
                >
                  %
                </button>

                <button
                  onClick={calcular}
                  disabled={isCalculando}
                  className="h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-2xl transition-all active:scale-98 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 border border-blue-400/40 disabled:opacity-50"
                  title="Calcular resultado em Python (Enter ou =)"
                >
                  {isCalculando ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Equal className="w-6 h-6" />
                      <span className="hidden sm:inline text-base font-semibold">Calcular</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Lateral: Histórico de Cálculos & Detalhes de Execução (4 colunas) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-white">Histórico de Cálculos</h2>
                <span className="text-xs text-slate-400">({historico.length})</span>
              </div>

              {historico.length > 0 && (
                <button
                  onClick={limparHistorico}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {historico.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Nenhum cálculo realizado ainda.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Os cálculos executados em Python serão listados aqui com o tempo de resposta.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {historico.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => usarHistorico(item)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      <span>{item.data}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        CPython: {item.tempoMs}ms
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-mono truncate group-hover:text-blue-300">
                      {item.expressao}
                    </div>
                    <div className="text-base font-bold font-mono text-white text-right">
                      = {item.resultado}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cartão Informativo de Arquitetura */}
          <div className="rounded-2xl bg-blue-950/20 border border-blue-500/20 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <h3 className="font-semibold text-white">CPython 3.12 WebAssembly</h3>
                <p className="text-slate-300 leading-relaxed">
                  As expressões são enviadas em JSON para a função{' '}
                  <code className="text-blue-300 font-mono">calcular_expressao()</code> no arquivo{' '}
                  <code className="text-blue-300 font-mono">calculadora.py</code>, sem qualquer
                  avaliação por `eval()` em JavaScript.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
