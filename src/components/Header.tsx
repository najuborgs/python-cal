import React from 'react';
import { Calculator, Code2, BookOpen, TestTube, Terminal, Cpu } from 'lucide-react';
import { PyodideState } from '../services/pyodideService';

interface HeaderProps {
  activeTab: 'calc' | 'code' | 'concepts' | 'tests' | 'terminal';
  setActiveTab: (tab: 'calc' | 'code' | 'concepts' | 'tests' | 'terminal') => void;
  pyodideState: PyodideState;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pyodideState,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shadow-blue-500/20">
            <Calculator className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">PyCalc</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Python 3.12 WASM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Calculadora com lógica matemática 100% em Python nativo
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('calc')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'calc'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculadora</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Código Python</span>
          </button>

          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'concepts'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Conceitos & Funções</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'tests'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TestTube className="w-4 h-4" />
            <span>Testes Automatizados</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'terminal'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Console Python</span>
          </button>
        </nav>

        {/* Zone 3: Pyodide Engine Status */}
        <div className="hidden lg:flex items-center gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 font-mono text-[11px]">Interpretador:</span>
            {pyodideState.status === 'ready' && (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Ativo ({pyodideState.tempoCarregamentoMs}ms)
              </span>
            )}
            {pyodideState.status === 'loading' && (
              <span className="text-amber-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Iniciando...
              </span>
            )}
            {pyodideState.status === 'idle' && (
              <span className="text-slate-400 font-medium">Aguardando</span>
            )}
            {pyodideState.status === 'error' && (
              <span className="text-rose-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Erro
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
