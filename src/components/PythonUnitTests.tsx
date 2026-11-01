import React, { useState, useEffect } from 'react';
import { TestTube, Play, CheckCircle2, XCircle, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { pyodideService, UnitTestsResponse } from '../services/pyodideService';

export const PythonUnitTests: React.FC = () => {
  const [resultados, setResultados] = useState<UnitTestsResponse | null>(null);
  const [executando, setExecutando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const rodarTestes = async () => {
    setExecutando(true);
    setErro(null);
    try {
      const resp = await pyodideService.executarTestesUnitarios();
      setResultados(resp);
    } catch (err: any) {
      setErro(err.message || 'Falha ao executar testes em Python');
    } finally {
      setExecutando(false);
    }
  };

  useEffect(() => {
    rodarTestes();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <TestTube className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Bateria de Testes Automatizados em Python</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Validação das quatro operações básicas, inteiros, decimais (float), divisão por zero e expressões.
            </p>
          </div>
        </div>

        <button
          onClick={rodarTestes}
          disabled={executando}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {executando ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Executando em Python...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Executar Testes Novamente</span>
            </>
          )}
        </button>
      </div>

      {/* Resumo dos Testes */}
      {resultados && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <span className="text-[11px] text-slate-400">Total de Testes</span>
            <div className="text-2xl font-bold text-white mt-1">{resultados.total}</div>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-emerald-900/40 p-4">
            <span className="text-[11px] text-emerald-400">Passaram com Sucesso</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{resultados.passou}</div>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-rose-900/40 p-4">
            <span className="text-[11px] text-rose-400">Falharam</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">{resultados.falhou}</div>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <span className="text-[11px] text-blue-400">Tempo no CPython</span>
            <div className="text-2xl font-bold text-blue-400 mt-1">{resultados.tempo_execucao_ms} ms</div>
          </div>
        </div>
      )}

      {erro && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Lista de Casos de Teste */}
      <div className="space-y-3">
        {resultados?.detalhes.map((teste, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              teste.passou
                ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40'
                : 'bg-rose-950/20 border-rose-800/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {teste.passou ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{teste.nome}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                        teste.passou
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {teste.passou ? 'PASSOU' : 'FALHOU'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{teste.descricao}</p>
                </div>
              </div>

              {teste.detalhe && (
                <span className="text-[11px] text-blue-300/80 font-mono bg-blue-950/30 px-2 py-1 rounded border border-blue-900/30 self-start sm:self-auto">
                  {teste.detalhe}
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[11px]">Entrada:</span>
                <span className="ml-2 text-slate-300">{teste.entrada}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Esperado:</span>
                <span className="ml-2 text-emerald-300">{teste.esperado}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">Obtido pelo Python:</span>
                <span className="ml-2 text-blue-300 font-semibold">{teste.obtido}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
