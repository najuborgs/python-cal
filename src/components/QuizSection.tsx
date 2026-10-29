import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/learningContent';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

export default function QuizSection() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === QUIZ_QUESTIONS.length;
  const score = calculateScore();

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Quiz de Fixação
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Teste seus Conhecimentos em Python
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Responda às 4 perguntas rápidas para fixar como funciona a calculadora.
          </p>
        </div>

        {showResults ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Sua pontuação:</span>
              <span className="text-lg font-bold text-emerald-400">
                {score} / {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tentar Novamente
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {answeredCount} de {QUIZ_QUESTIONS.length} respondidas
            </span>
            <button
              onClick={() => setShowResults(true)}
              disabled={!isComplete}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isComplete
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              Verificar Respostas
            </button>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm font-semibold text-slate-200">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                {q.options.map((option, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let btnStyle = 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800';

                  if (showResults) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-600/70 text-emerald-300 font-medium';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/60 border-rose-600/70 text-rose-300';
                    } else {
                      btnStyle = 'bg-slate-900/40 opacity-50 border-slate-800 text-slate-500';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-blue-600/20 border-blue-500 text-blue-300 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={showResults}
                      className={`text-left text-xs p-3 rounded-lg border transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-mono text-slate-500 text-[11px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)})
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation after verification */}
              {showResults && (
                <div
                  className={`mt-3 pl-9 text-xs p-3 rounded-lg flex items-start gap-2.5 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border border-emerald-800/40 text-emerald-300'
                      : 'bg-rose-950/30 border border-rose-800/40 text-rose-300'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block mb-0.5">
                      {isCorrect ? 'Mandou bem! Resposta correta.' : 'Ops, não foi dessa vez!'}
                    </span>
                    <p className="text-slate-300/90 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
