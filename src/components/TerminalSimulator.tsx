import { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Terminal as TerminalIcon, Sparkles, AlertCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { TerminalLog } from '../types';

type ExecutionStep = 
  | 'idle' 
  | 'waiting_option' 
  | 'waiting_num1' 
  | 'waiting_num2' 
  | 'finished';

export default function TerminalSimulator() {
  const [step, setStep] = useState<ExecutionStep>('idle');
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [userInput, setUserInput] = useState('');
  
  // Track Python variables state
  const [stateVariables, setStateVariables] = useState<{
    opcao: string | null;
    num1: number | null;
    num2: number | null;
    resultado: number | string | null;
    activeFunction: string | null;
  }>({
    opcao: null,
    num1: null,
    num2: null,
    resultado: null,
    activeFunction: null,
  });

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    if (step !== 'idle' && step !== 'finished') {
      inputRef.current?.focus();
    }
  }, [step]);

  // Start execution simulation
  const startProgram = () => {
    const initialLogs: TerminalLog[] = [
      { id: '1', type: 'system', text: '$ python3 calculadora.py' },
      { id: '2', type: 'output', text: '===================================' },
      { id: '3', type: 'output', text: '       CALCULADORA EM PYTHON       ' },
      { id: '4', type: 'output', text: '===================================' },
      { id: '5', type: 'output', text: '1 - Adição (+)' },
      { id: '6', type: 'output', text: '2 - Subtração (-)' },
      { id: '7', type: 'output', text: '3 - Multiplicação (*)' },
      { id: '8', type: 'output', text: '4 - Divisão (/)' },
      { id: '9', type: 'output', text: '-----------------------------------' },
      { id: '10', type: 'output', text: 'Escolha uma operação (1/2/3/4):' },
    ];
    setLogs(initialLogs);
    setStep('waiting_option');
    setUserInput('');
    setStateVariables({
      opcao: null,
      num1: null,
      num2: null,
      resultado: null,
      activeFunction: null,
    });
  };

  const handleOptionSelect = (op: string) => {
    if (step !== 'waiting_option') return;
    
    const opClean = op.trim();
    if (!['1', '2', '3', '4'].includes(opClean)) {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'input', text: `> ${opClean}` },
        { id: String(Date.now() + 1), type: 'error', text: 'Opção inválida! Escolha entre 1 e 4.' },
        { id: String(Date.now() + 2), type: 'output', text: 'Escolha uma operação (1/2/3/4):' }
      ]);
      setUserInput('');
      return;
    }

    const funcNames: Record<string, string> = {
      '1': 'adicao(a, b)',
      '2': 'subtracao(a, b)',
      '3': 'multiplicacao(a, b)',
      '4': 'divisao(a, b)'
    };

    setStateVariables((prev) => ({
      ...prev,
      opcao: opClean,
      activeFunction: funcNames[opClean]
    }));

    setLogs((prev) => [
      ...prev,
      { id: String(Date.now()), type: 'input', text: `> ${opClean}` },
      { id: String(Date.now() + 1), type: 'output', text: 'Digite o primeiro número: ' }
    ]);
    setStep('waiting_num1');
    setUserInput('');
  };

  const handleNum1Submit = (val: string) => {
    const num = parseFloat(val.replace(',', '.'));
    if (isNaN(num)) {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'input', text: `> ${val}` },
        { id: String(Date.now() + 1), type: 'error', text: 'ValueError: poderia converter apenas números válidos!' },
        { id: String(Date.now() + 2), type: 'output', text: 'Digite o primeiro número novamente: ' }
      ]);
      setUserInput('');
      return;
    }

    setStateVariables((prev) => ({ ...prev, num1: num }));
    setLogs((prev) => [
      ...prev,
      { id: String(Date.now()), type: 'input', text: `> ${num}` },
      { id: String(Date.now() + 1), type: 'output', text: 'Digite o segundo número: ' }
    ]);
    setStep('waiting_num2');
    setUserInput('');
  };

  const handleNum2Submit = (val: string) => {
    const num2 = parseFloat(val.replace(',', '.'));
    if (isNaN(num2)) {
      setLogs((prev) => [
        ...prev,
        { id: String(Date.now()), type: 'input', text: `> ${val}` },
        { id: String(Date.now() + 1), type: 'error', text: 'ValueError: digite um número válido!' },
        { id: String(Date.now() + 2), type: 'output', text: 'Digite o segundo número novamente: ' }
      ]);
      setUserInput('');
      return;
    }

    const n1 = stateVariables.num1 ?? 0;
    const op = stateVariables.opcao;

    let res: number | string = 0;
    let symbol = '+';

    if (op === '1') {
      res = n1 + num2;
      symbol = '+';
    } else if (op === '2') {
      res = n1 - num2;
      symbol = '-';
    } else if (op === '3') {
      res = n1 * num2;
      symbol = '*';
    } else if (op === '4') {
      symbol = '/';
      if (num2 === 0) {
        res = 'Erro: Não é possível dividir por zero!';
      } else {
        res = n1 / num2;
      }
    }

    setStateVariables((prev) => ({
      ...prev,
      num2,
      resultado: res
    }));

    const resultMessage = typeof res === 'string'
      ? res
      : `Resultado: ${n1} ${symbol} ${num2} = ${res}`;

    setLogs((prev) => [
      ...prev,
      { id: String(Date.now()), type: 'input', text: `> ${num2}` },
      { id: String(Date.now() + 1), type: 'output', text: '-----------------------------------' },
      { 
        id: String(Date.now() + 2), 
        type: typeof res === 'string' ? 'error' : 'success', 
        text: `>>> ${resultMessage}` 
      },
      { id: String(Date.now() + 3), type: 'system', text: '[Programa finalizado com sucesso (código 0)]' }
    ]);

    setStep('finished');
    setUserInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (step === 'waiting_option') {
      handleOptionSelect(userInput);
    } else if (step === 'waiting_num1') {
      handleNum1Submit(userInput);
    } else if (step === 'waiting_num2') {
      handleNum2Submit(userInput);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Terminal Title Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
            Terminal Python 3.12 (calculadora.py)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {step === 'idle' ? (
            <button
              onClick={startProgram}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Executar Código
            </button>
          ) : (
            <button
              onClick={startProgram}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reiniciar execução"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[300px] max-h-[420px] overflow-y-auto space-y-1.5 bg-slate-950/60 selection:bg-blue-600 selection:text-white">
        {step === 'idle' && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TerminalIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-300 font-sans font-medium text-base">Simulador de Terminal Python</p>
              <p className="text-slate-500 text-xs font-sans max-w-sm mt-1">
                Veja seu script Python funcionando em tempo real. Teste somas, divisões e até a proteção contra divisão por zero!
              </p>
            </div>
            <button
              onClick={startProgram}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-900/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Iniciar Calculadora
            </button>
          </div>
        )}

        {logs.map((log) => {
          if (log.type === 'system') {
            return (
              <div key={log.id} className="text-slate-500 italic">
                {log.text}
              </div>
            );
          }
          if (log.type === 'input') {
            return (
              <div key={log.id} className="text-amber-300 font-semibold flex items-center gap-1">
                {log.text}
              </div>
            );
          }
          if (log.type === 'error') {
            return (
              <div key={log.id} className="text-rose-400 font-semibold bg-rose-950/40 border border-rose-900/40 p-2 rounded-lg flex items-center gap-2 my-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{log.text}</span>
              </div>
            );
          }
          if (log.type === 'success') {
            return (
              <div key={log.id} className="text-emerald-300 font-bold bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg flex items-center gap-2 my-1 shadow-sm">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{log.text}</span>
              </div>
            );
          }
          return (
            <div key={log.id} className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {log.text}
            </div>
          );
        })}

        {/* Active Input Line */}
        {step !== 'idle' && step !== 'finished' && (
          <form onSubmit={handleSubmit} className="pt-2 flex items-center gap-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={
                step === 'waiting_option'
                  ? 'Digite 1, 2, 3 ou 4 e pressione Enter'
                  : 'Digite o número e pressione Enter'
              }
              className="flex-1 bg-transparent border-b border-blue-500/50 focus:border-blue-400 text-white outline-none font-mono text-xs sm:text-sm py-1 placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="p-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded text-xs transition-colors cursor-pointer"
              title="Confirmar entrada"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div ref={logsEndRef} />
      </div>

      {/* Quick Interactive Shortcut Buttons */}
      {step !== 'idle' && (
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          {step === 'waiting_option' && (
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[11px] font-sans text-slate-400 mr-1">Atalho de Opção:</span>
              <button
                onClick={() => handleOptionSelect('1')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-md text-xs font-mono transition-colors cursor-pointer"
              >
                1: Adição (+)
              </button>
              <button
                onClick={() => handleOptionSelect('2')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-md text-xs font-mono transition-colors cursor-pointer"
              >
                2: Subtração (-)
              </button>
              <button
                onClick={() => handleOptionSelect('3')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-md text-xs font-mono transition-colors cursor-pointer"
              >
                3: Multiplicação (*)
              </button>
              <button
                onClick={() => handleOptionSelect('4')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-md text-xs font-mono transition-colors cursor-pointer"
              >
                4: Divisão (/)
              </button>
            </div>
          )}

          {step === 'waiting_num1' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-sans text-slate-400 mr-1">Valores Rápidos:</span>
              {['10', '25', '100', '7.5'].map((v) => (
                <button
                  key={v}
                  onClick={() => handleNum1Submit(v)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition-colors cursor-pointer"
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {step === 'waiting_num2' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-sans text-slate-400 mr-1">Valores Rápidos:</span>
              {['2', '5', '10'].map((v) => (
                <button
                  key={v}
                  onClick={() => handleNum2Submit(v)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition-colors cursor-pointer"
                >
                  {v}
                </button>
              ))}
              {stateVariables.opcao === '4' && (
                <button
                  onClick={() => handleNum2Submit('0')}
                  className="px-2.5 py-0.5 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1"
                  title="Testar como o código lida com divisão por zero"
                >
                  0 (Testar Divisão por Zero)
                </button>
              )}
            </div>
          )}

          {step === 'finished' && (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Cálculo concluído no interpretador Python!
              </span>
              <button
                onClick={startProgram}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Fazer Outra Conta
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Python Memory Inspector (Variables State) */}
      <div className="bg-slate-950/90 px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
        <span className="text-slate-500 font-sans text-[11px] uppercase tracking-wider font-semibold">
          Memória Python:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            opcao: <strong className="text-amber-400">{stateVariables.opcao ? `"${stateVariables.opcao}"` : 'None'}</strong>
          </span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            num1: <strong className="text-blue-400">{stateVariables.num1 !== null ? stateVariables.num1 : 'None'}</strong>
          </span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            num2: <strong className="text-purple-400">{stateVariables.num2 !== null ? stateVariables.num2 : 'None'}</strong>
          </span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            funcao: <strong className="text-emerald-400">{stateVariables.activeFunction || 'None'}</strong>
          </span>
          {stateVariables.resultado !== null && (
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
              resultado: <strong className="text-emerald-300">{stateVariables.resultado}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
