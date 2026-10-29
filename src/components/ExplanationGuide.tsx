import { PILLARS_OF_CODE, HOW_TO_RUN_STEPS } from '../data/learningContent';
import { Layers, Terminal, GitBranch, ShieldAlert, CheckCircle2, Laptop, Copy, ExternalLink } from 'lucide-react';

const iconMap = {
  Layers: Layers,
  Terminal: Terminal,
  GitBranch: GitBranch,
  ShieldAlert: ShieldAlert,
};

export default function ExplanationGuide() {
  return (
    <div className="space-y-12">
      {/* 4 Pillars Section */}
      <section>
        <div className="flex flex-col mb-8 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            Anatomia do Código
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Os 4 Pilares da sua Calculadora em Python
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Entenda detalhadamente cada conceito de programação usado na construção deste projeto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PILLARS_OF_CODE.map((pillar) => {
            const IconComponent = iconMap[pillar.icon as keyof typeof iconMap] || Layers;

            return (
              <div
                key={pillar.step}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                      PASSO {pillar.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-3 mt-2">
                  <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800/80 overflow-x-auto">
                    <code>{pillar.pythonCode}</code>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pillar.detail}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guide on How to Run locally */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Como Executar no seu Computador</h3>
            <p className="text-xs text-slate-400">Guia rápido para testar o código fora do navegador</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOW_TO_RUN_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-200">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{step.content}</p>
              </div>

              {step.step === 3 && (
                <div className="mt-3 bg-slate-900 px-3 py-2 rounded-lg font-mono text-xs text-amber-300 border border-slate-800 flex items-center justify-between">
                  <span>python calculadora.py</span>
                  <button
                    onClick={() => navigator.clipboard.writeText('python calculadora.py')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copiar comando"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {step.step === 4 && (
                <div className="mt-3">
                  <a
                    href="https://colab.research.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Abrir Google Colab
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
