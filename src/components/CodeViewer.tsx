import { useState } from 'react';
import { Copy, Check, Download, FileCode, Info, Lightbulb, Sparkles } from 'lucide-react';
import { CODE_VERSIONS, CODE_ANNOTATIONS } from '../data/codeSnippets';
import { CodeVersionKey } from '../types';

interface CodeViewerProps {
  selectedVersion: CodeVersionKey;
  onSelectVersion: (version: CodeVersionKey) => void;
}

export default function CodeViewer({ selectedVersion, onSelectVersion }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string>('functions');

  const currentCode = CODE_VERSIONS[selectedVersion];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentCode.code], { type: 'text/x-python' });
    element.href = URL.createObjectURL(file);
    element.download = currentCode.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const activeAnnotation = CODE_ANNOTATIONS.find((a) => a.id === activeAnnotationId) || CODE_ANNOTATIONS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Top Header & Version Selector */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-slate-200">
                {currentCode.filename}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {currentCode.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {currentCode.description}
            </p>
          </div>
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copiar código Python para a área de transferência"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Baixar arquivo .py para executar no seu computador"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Version Tabs */}
      <div className="bg-slate-950/40 px-4 pt-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        {(Object.keys(CODE_VERSIONS) as CodeVersionKey[]).map((key) => {
          const item = CODE_VERSIONS[key];
          const isActive = selectedVersion === key;
          return (
            <button
              key={key}
              onClick={() => onSelectVersion(key)}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-slate-900 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Code Display Area */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto bg-slate-950/70 max-h-[480px] overflow-y-auto">
        <pre className="text-slate-300 leading-relaxed">
          <code>
            {currentCode.code.split('\n').map((line, index) => {
              const lineNum = index + 1;
              const isComment = line.trim().startsWith('#');
              const isDef = line.includes('def ');
              const isReturn = line.includes('return');
              const isIfElif = line.includes('if ') || line.includes('elif ') || line.includes('else:');
              const isTry = line.includes('try:') || line.includes('except ');

              let textColorClass = 'text-slate-300';
              if (isComment) textColorClass = 'text-slate-500 italic';
              else if (isDef) textColorClass = 'text-blue-400 font-semibold';
              else if (isReturn) textColorClass = 'text-purple-400 font-medium';
              else if (isIfElif) textColorClass = 'text-amber-300 font-medium';
              else if (isTry) textColorClass = 'text-rose-400 font-medium';
              else if (line.includes('input(') || line.includes('float(')) textColorClass = 'text-emerald-300';

              return (
                <div key={lineNum} className="table-row hover:bg-slate-800/30 transition-colors">
                  <span className="table-cell pr-4 text-right select-none text-slate-600 text-[11px] w-8">
                    {lineNum}
                  </span>
                  <span className={`table-cell whitespace-pre ${textColorClass}`}>
                    {line}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Interactive Concept Breakdown Bar */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Explorador de Conceitos do Código
          </span>
          <span className="text-[11px] text-slate-500">
            Clique num componente para entender:
          </span>
        </div>

        {/* Buttons for annotations */}
        <div className="flex flex-wrap gap-1.5">
          {CODE_ANNOTATIONS.map((annotation) => {
            const isSelected = activeAnnotationId === annotation.id;
            return (
              <button
                key={annotation.id}
                onClick={() => setActiveAnnotationId(annotation.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {annotation.title}
              </button>
            );
          })}
        </div>

        {/* Selected Annotation Card */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              {activeAnnotation.title}
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeAnnotation.description}
          </p>

          <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-emerald-400 border border-slate-800/80">
            <code>{activeAnnotation.codeSnippet}</code>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-800/30 p-2 rounded-lg">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Dica de ouro:</strong> {activeAnnotation.tip}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
