import React, { useState } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { pyodideService, PythonFreeExecutionResponse } from '../services/pyodideService';

interface CommandHistoryItem {
  id: string;
  codigo: string;
  resposta: PythonFreeExecutionResponse;
  timestamp: string;
}

export const PythonTerminal: React.FC = () => {
  const [codigo, setCodigo] = useState<string>('somar(15.75, 24.25)');
  const [executando, setExecutando] = useState<boolean>(false);
  const [historicoConsole, setHistoricoConsole] = useState<CommandHistoryItem[]>([
    {
      id: 'init-1',
      codigo: 'somar(10.5, 5.5)',
      resposta: {
        sucesso: true,
        saida: '16.0',
        tipo: 'float',
        tempo_execucao_ms: 1.1,
      },
      timestamp: 'Sistema',
    },
    {
      id: 'init-2',
      codigo: 'dividir(50, 0)',
      resposta: {
        sucesso: false,
        erro: 'Erro: Não é possível dividir por zero!',
        tipo: 'ZeroDivisionError',
        tempo_execucao_ms: 0.8,
      },
      timestamp: 'Sistema',
    },
  ]);

  const exemplos = [
    { label: 'Soma float', code: 'somar(123.45, 678.90)' },
    { label: 'Divisão por Zero', code: 'dividir(100, 0)' },
    { label: 'Raiz Quadrada', code: 'raiz_quadrada(625)' },
    { label: 'Potência 2^16', code: 'potencia(2, 16)' },
    { label: 'Fatorial de 6', code: 'fatorial(6)' },
    { label: 'Seno de 90°', code: 'seno(90, em_graus=True)' },
  ];

  const executarCodigo = async (codigoParaRodar?: string) => {
    const code = (codigoParaRodar || codigo).trim();
    if (!code || executando) return;

    setExecutando(true);
    try {
      const resp = await pyodideService.executarCodigoLivre(code);
      setHistoricoConsole((prev) => [
        {
          id: Date.now().toString(),
          codigo: code,
          resposta: resp,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      setHistoricoConsole((prev) => [
        {
          id: Date.now().toString(),
          codigo: code,
          resposta: {
            sucesso: false,
            erro: err.message || 'Erro inesperado',
            tipo: 'ExecutionError',
            tempo_execucao_ms: 0,
          },
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } finally {
      setExecutando(false);
    }
  };

  const limparConsole = () => {
    setHistoricoConsole([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Console Interativo Python (REPL)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute diretamente as funções de <code className="text-blue-300 font-mono">calculadora.py</code> no CPython compilado para WebAssembly.
            </p>
          </div>
        </div>

        {historicoConsole.length > 0 && (
          <button
            onClick={limparConsole}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-900"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Console</span>
          </button>
        )}
      </div>

      {/* Editor e Input de Comandos */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Digite sua chamada de função em Python:
          </span>
          <span className="text-[11px] text-blue-400">Pressione Enter para executar</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2 font-mono">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3.5 text-blue-400 font-bold select-none">&gt;&gt;&gt;</span>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executarCodigo();
                }
              }}
              placeholder="Ex: somar(10.5, 20.3) ou dividir(10, 0)"
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3 text-sm text-white font-mono outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            onClick={() => executarCodigo()}
            disabled={executando || !codigo.trim()}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shrink-0 font-sans"
          >
            {executando ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Rodando...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Executar no Python</span>
              </>
            )}
          </button>
        </div>

        {/* Exemplos Rápidos */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 font-mono">Exemplos:</span>
          {exemplos.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCodigo(ex.code);
                executarCodigo(ex.code);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] hover:text-blue-300 hover:border-blue-500/30 transition-all whitespace-nowrap shrink-0"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Histórico do Terminal */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Saída do Interpretador ({historicoConsole.length})
        </h3>

        <div className="space-y-2.5">
          {historicoConsole.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 font-mono text-xs ${
                item.resposta.sucesso
                  ? 'bg-slate-950 border-slate-800/90'
                  : 'bg-rose-950/20 border-rose-900/40'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 mb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">&gt;&gt;&gt;</span>
                  <span className="text-white font-medium">{item.codigo}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.resposta.tipo && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      tipo: {item.resposta.tipo}
                    </span>
                  )}
                  <span className="text-emerald-400">{item.resposta.tempo_execucao_ms}ms</span>
                </div>
              </div>

              {item.resposta.sucesso ? (
                <div className="text-emerald-300 text-sm font-semibold pl-4">
                  {item.resposta.saida}
                </div>
              ) : (
                <div className="text-rose-300 text-xs pl-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-400">{item.resposta.tipo}:</span>{' '}
                    {item.resposta.erro}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
