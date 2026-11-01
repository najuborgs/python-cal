import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { ConceptsGuide } from './components/ConceptsGuide';
import { PythonUnitTests } from './components/PythonUnitTests';
import { PythonTerminal } from './components/PythonTerminal';
import { pyodideService, PyodideState } from './services/pyodideService';
import { Cpu, CheckCircle2, AlertCircle, FileCode, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calc' | 'code' | 'concepts' | 'tests' | 'terminal'>('calc');
  const [pyodideState, setPyodideState] = useState<PyodideState>(pyodideService.getState());

  useEffect(() => {
    // Subscreve às atualizações de estado do interpretador WebAssembly
    const unsubscribe = pyodideService.subscribe((state) => {
      setPyodideState(state);
    });

    // Inicia o carregamento do Pyodide em segundo plano imediatamente
    pyodideService.init().catch((err) => {
      console.warn('Inicialização Pyodide:', err);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Barra de Navegação Superior (Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pyodideState={pyodideState}
      />

      {/* Aviso de carregamento inicial do WebAssembly se ainda estiver processando */}
      {pyodideState.status === 'loading' && (
        <div className="bg-blue-950/40 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-300 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
          <span>{pyodideState.mensagem}</span>
        </div>
      )}

      {/* Aviso de erro se o Pyodide falhar */}
      {pyodideState.status === 'error' && (
        <div className="bg-rose-950/60 border-b border-rose-800/60 px-4 py-3 text-center text-xs text-rose-300 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{pyodideState.mensagem}</span>
          <button
            onClick={() => pyodideService.init()}
            className="ml-2 underline font-medium text-white hover:text-rose-200"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Conteúdo Principal com base na aba ativa */}
      <main className="flex-1">
        {activeTab === 'calc' && <Calculator />}
        {activeTab === 'code' && <PythonCodeViewer />}
        {activeTab === 'concepts' && <ConceptsGuide />}
        {activeTab === 'tests' && <PythonUnitTests />}
        {activeTab === 'terminal' && <PythonTerminal />}
      </main>

      {/* Rodapé Arquitetural e Explicação de Arquivos */}
      <footer className="border-t border-slate-900 bg-slate-950/80 mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="font-semibold text-white">PyCalc</span>
              <span className="text-slate-400">— Calculadora Visual com Lógica em Python WebAssembly</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-xs">
              <span>Python 3.12 (CPython WASM)</span>
              <span>·</span>
              <span>React 19 & Tailwind CSS v4</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 font-semibold font-mono">
                <FileCode className="w-3.5 h-3.5" />
                <span>Onde está a lógica matemática em Python:</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">
                /public/calculadora.py e /src/python/calculadora.py
              </p>
              <p className="text-slate-400 text-[11px]">
                Contém as funções <code className="text-blue-300">def somar</code>, <code className="text-blue-300">def subtrair</code>, <code className="text-blue-300">def multiplicar</code>, <code className="text-blue-300">def dividir</code> com tratamento explícito de <code className="text-rose-400">ZeroDivisionError</code> e conversão <code className="text-cyan-400">float()</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold font-mono">
                <Layers className="w-3.5 h-3.5" />
                <span>Onde está a interface visual e a ponte WebAssembly:</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">
                /src/components/Calculator.tsx e /src/services/pyodideService.ts
              </p>
              <p className="text-slate-400 text-[11px]">
                Gerencia o visor grande, o teclado interativo e despacha cada operação para o interpretador CPython via Pyodide.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
