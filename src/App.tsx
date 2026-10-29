import { useState } from 'react';
import Header from './components/Header';
import TerminalSimulator from './components/TerminalSimulator';
import CodeViewer from './components/CodeViewer';
import ExplanationGuide from './components/ExplanationGuide';
import QuizSection from './components/QuizSection';
import { CodeVersionKey } from './types';
import { Sparkles, Terminal, Code2, BookOpen, HelpCircle, Check, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'codigo' | 'guia' | 'quiz'>('terminal');
  const [selectedVersion, setSelectedVersion] = useState<CodeVersionKey>('funcoes');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Welcome Banner */}
      <section className="border-b border-slate-900 bg-gradient-to-b from-slate-900/60 to-slate-950 px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Guia Prático para Iniciantes em Programação</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Calculadora Simples em Python
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
                Aprenda a realizar as quatro operações básicas (<strong>+</strong>, <strong>-</strong>, <strong>*</strong>, <strong>/</strong>) com código limpo, funções reutilizáveis (<code className="text-blue-400 font-mono text-xs bg-slate-900 px-1 py-0.5 rounded">def</code>), conversão de tipos (<code className="text-emerald-400 font-mono text-xs bg-slate-900 px-1 py-0.5 rounded">float()</code>) e proteção contra divisão por zero.
              </p>
            </div>

            {/* Quick feature pill tags */}
            <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>4 Operações Matemáticas</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Proteção contra Divisão por 0</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Código 100% Comentado</span>
              </div>
            </div>
          </div>

          {/* Quick tab switch buttons in Hero */}
          <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-900/80">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>1. Testar no Terminal Interativo</span>
            </button>

            <button
              onClick={() => setActiveTab('codigo')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'codigo'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>2. Ver Código Python & Anotações</span>
            </button>

            <button
              onClick={() => setActiveTab('guia')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'guia'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. Explicação dos Conceitos (def, input, if)</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>4. Quiz Prático</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Terminal on left / top */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    Simulador do Script Python
                  </h2>
                  <span className="text-xs text-slate-400">
                    Interaja como se estivesse no VS Code
                  </span>
                </div>
                <TerminalSimulator />
              </div>

              {/* Side helper / Mini Guide */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    O que você pode testar aqui:
                  </h3>

                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <strong className="text-white block mb-0.5">Operações normais</strong>
                        Escolha 1, 2 ou 3 e digite números inteiros ou decimais (ex: 15 e 4.5).
                      </div>
                    </li>

                    <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <strong className="text-white block mb-0.5">Teste a divisão por zero</strong>
                        Escolha a opção 4 (Divisão) e digite 0 no segundo número. Veja como o código impede o travamento!
                      </div>
                    </li>

                    <li className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <strong className="text-white block mb-0.5">Inspecione a memória</strong>
                        Observe no rodapé do terminal como as variáveis (<code className="text-amber-300">opcao</code>, <code className="text-blue-300">num1</code>, <code className="text-purple-300">num2</code>) vão sendo preenchidas.
                      </div>
                    </li>
                  </ul>

                  <button
                    onClick={() => setActiveTab('codigo')}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Ver o código-fonte correspondente</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-blue-950/30 to-purple-950/20 border border-blue-900/30 rounded-2xl p-4 text-xs text-slate-300">
                  <p className="font-semibold text-blue-300 mb-1">Dica para o seu aprendizado:</p>
                  <p className="text-slate-400 leading-relaxed">
                    Em Python, a função <code className="text-emerald-400 font-mono">input()</code> sempre devolve texto. Por isso colocamos <code className="text-blue-400 font-mono">float(input())</code> para converter em número decimal!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'codigo' && (
          <div className="space-y-6">
            <CodeViewer
              selectedVersion={selectedVersion}
              onSelectVersion={setSelectedVersion}
            />
          </div>
        )}

        {activeTab === 'guia' && (
          <div className="space-y-6">
            <ExplanationGuide />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <QuizSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Desenvolvido para estudantes iniciantes de programação em <strong>Python 3</strong>.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('terminal')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terminal
            </button>
            <button
              onClick={() => setActiveTab('codigo')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Código
            </button>
            <button
              onClick={() => setActiveTab('guia')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Guia
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Quiz
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
