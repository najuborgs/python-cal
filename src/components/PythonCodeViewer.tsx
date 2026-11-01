import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Search, Terminal } from 'lucide-react';
import { pyodideService } from '../services/pyodideService';

export const PythonCodeViewer: React.FC = () => {
  const [copiado, setCopiado] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const codigoCompleto = pyodideService.getCodigoFontePython();

  const handleCopiar = () => {
    navigator.clipboard.writeText(codigoCompleto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codigoCompleto], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calculadora.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Separa o código em linhas
  const linhas = codigoCompleto.split('\n');

  // Syntax highlighting leve em Python para renderização limpa
  const renderizarLinhaPython = (linha: string) => {
    // Se for comentário
    if (linha.trim().startsWith('#') || linha.trim().startsWith('"""') || linha.trim().startsWith("'''")) {
      return <span className="text-emerald-400/80 italic">{linha}</span>;
    }

    // Tokenização simples de palavras-chave
    const tokens = linha.split(/(\bdef\b|\breturn\b|\bif\b|\belif\b|\belse\b|\btry\b|\bexcept\b|\braise\b|\bimport\b|\bfrom\b|\bfloat\b|\bint\b|\bstr\b|\bbool\b|\bZeroDivisionError\b|\bValueError\b|\bTrue\b|\bFalse\b|\bNone\b|"[^"]*"|'[^']*')/g);

    return tokens.map((token, idx) => {
      if (['def', 'return', 'if', 'elif', 'else', 'try', 'except', 'raise', 'import', 'from'].includes(token)) {
        return <span key={idx} className="text-blue-400 font-semibold">{token}</span>;
      }
      if (['float', 'int', 'str', 'bool', 'ZeroDivisionError', 'ValueError'].includes(token)) {
        return <span key={idx} className="text-cyan-300 font-medium">{token}</span>;
      }
      if (['True', 'False', 'None'].includes(token)) {
        return <span key={idx} className="text-amber-300">{token}</span>;
      }
      if (token.startsWith('"') || token.startsWith("'")) {
        return <span key={idx} className="text-emerald-300">{token}</span>;
      }
      return <span key={idx}>{token}</span>;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Cabeçalho da Seção de Código */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Código Python da Calculadora</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800/60 font-mono">
                calculadora.py
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Arquivo com as funções <code className="text-blue-400">def</code>, condicionais, tipos <code className="text-blue-400">float()</code> e tratamento de divisão por zero.
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopiar}
            className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2 active:scale-95"
            title="Copiar código para a área de transferência"
          >
            {copiado ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-medium rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/30 transition-colors flex items-center justify-center gap-2 active:scale-95"
            title="Baixar calculadora.py"
          >
            <Download className="w-4 h-4" />
            <span>Baixar calculadora.py</span>
          </button>
        </div>
      </div>

      {/* Atalhos Rápidos para Funções */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400">
        <span className="font-semibold text-slate-300 shrink-0">Funções Principais:</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-300 font-mono">def somar(a, b)</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-300 font-mono">def subtrair(a, b)</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-300 font-mono">def multiplicar(a, b)</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-300 font-mono">def dividir(a, b)</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-300 font-mono">def potencia(b, exp)</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-300 font-mono">def raiz_quadrada(n)</span>
      </div>

      {/* Visualizador de Código com Numeração de Linhas */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-300 font-medium">calculadora.py</span>
          </div>
          <span>Python 3.12 · UTF-8 · {linhas.length} linhas</span>
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto max-h-[650px] font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
          <table className="w-full border-collapse">
            <tbody>
              {linhas.map((linha, index) => {
                const numLinha = index + 1;
                const estaDestacada = termoBusca && linha.toLowerCase().includes(termoBusca.toLowerCase());
                return (
                  <tr
                    key={index}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      estaDestacada ? 'bg-blue-900/30' : ''
                    }`}
                  >
                    <td className="w-12 pr-4 text-right text-slate-600 select-none align-top font-mono text-[11px]">
                      {numLinha}
                    </td>
                    <td className="whitespace-pre">
                      {renderizarLinhaPython(linha)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
