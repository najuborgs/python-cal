import React from 'react';
import { BookOpen, Cpu, ShieldAlert, GitBranch, Binary, Layers } from 'lucide-react';

export const ConceptsGuide: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Hero dos Conceitos */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Conceitos de Programação & Arquitetura Python
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Guia didático explicando as funções, estruturas de controle e execução WebAssembly.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Conceitos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conceito 1: Funções def */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
              def
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">1. Funções em Python (def)</h3>
              <p className="text-xs text-slate-400">Modularidade e encapsulamento de código</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Em Python, blocos de código reutilizáveis são definidos com a palavra-chave{' '}
            <code className="text-blue-400 font-mono font-semibold">def</code>, seguida pelo nome da
            função e seus parâmetros entre parênteses.
          </p>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
            <p className="text-blue-400">def <span className="text-cyan-300">somar</span>(a, b):</p>
            <p className="pl-4 text-emerald-400/80 italic"># Converte os argumentos para números reais</p>
            <p className="pl-4">num1 = <span className="text-cyan-300">float</span>(a)</p>
            <p className="pl-4">num2 = <span className="text-cyan-300">float</span>(b)</p>
            <p className="pl-4 text-blue-400">return <span className="text-slate-100">num1 + num2</span></p>
          </div>

          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
            <li>Cada operação possui sua função própria (<code className="text-blue-300 font-mono">somar</code>, <code className="text-blue-300 font-mono">subtrair</code>, <code className="text-blue-300 font-mono">multiplicar</code>, <code className="text-blue-300 font-mono">dividir</code>).</li>
            <li>O comando <code className="text-blue-300 font-mono">return</code> devolve o resultado para quem chamou.</li>
          </ul>
        </div>

        {/* Conceito 2: Uso de float() */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">2. Números Decimais com float()</h3>
              <p className="text-xs text-slate-400">Precisão aritmética e conversão de tipos</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ao receber números digitados pelo usuário, eles podem chegar inicialmente como texto
            (<code className="text-blue-400 font-mono">str</code>). A conversão com{' '}
            <code className="text-cyan-300 font-mono font-semibold">float()</code> é essencial para
            garantir que cálculos como <code className="text-slate-200 font-mono">0.1 + 0.2</code> sejam
            calculados como valores de ponto flutuante IEEE 754 de 64 bits.
          </p>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
            <p className="text-slate-400"># Diferença entre texto e float:</p>
            <p className="text-rose-400">"10" + "5" = "105" <span className="text-slate-400">(concatenação de texto)</span></p>
            <p className="text-emerald-400">float("10") + float("5") = 15.0 <span className="text-slate-400">(soma real)</span></p>
          </div>

          <p className="text-xs text-slate-400">
            Utilizamos também uma função de formatação para remover zeros desnecessários (ex: 5.0 torna-se 5).
          </p>
        </div>

        {/* Conceito 3: Tratamento de Divisão por Zero */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">3. Tratamento de Divisão por Zero</h3>
              <p className="text-xs text-slate-400">ZeroDivisionError e tratamento de exceções</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Na matemática e em computação, a divisão por zero é uma operação indefinida. Se um
            programa tentar calcular <code className="text-slate-200 font-mono">10 / 0</code> sem
            tratamento, o Python interrompe o programa com uma exceção{' '}
            <code className="text-rose-400 font-mono font-semibold">ZeroDivisionError</code>.
          </p>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
            <p className="text-blue-400">if <span className="text-slate-100">num2 == 0.0:</span></p>
            <p className="pl-4 text-rose-400">raise ZeroDivisionError<span className="text-slate-200">("Não é possível dividir por zero!")</span></p>
            <p className="text-blue-400">try:</p>
            <p className="pl-4">resultado = num1 / num2</p>
            <p className="text-blue-400">except <span className="text-rose-400">ZeroDivisionError:</span></p>
            <p className="pl-4 text-emerald-400"># Captura o erro e retorna mensagem amigável no visor</p>
          </div>
        </div>

        {/* Conceito 4: Estruturas Condicionais */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">4. Estruturas Condicionais</h3>
              <p className="text-xs text-slate-400">Controle de fluxo com if, elif e else</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            As estruturas condicionais direcionam qual bloco de código deve ser executado com base em
            uma condição lógica booleana (<code className="text-amber-300 font-mono">True</code> ou{' '}
            <code className="text-amber-300 font-mono">False</code>).
          </p>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200">
            <p className="text-blue-400">if <span className="text-slate-200">tipo_operacao == 'somar':</span></p>
            <p className="pl-4">res = somar(a, b)</p>
            <p className="text-blue-400">elif <span className="text-slate-200">tipo_operacao == 'dividir':</span></p>
            <p className="pl-4">res = dividir(a, b)</p>
            <p className="text-blue-400">else:</p>
            <p className="pl-4 text-rose-400">raise ValueError("Operação desconhecida")</p>
          </div>
        </div>
      </div>

      {/* Seção de Arquitetura: Como o Python roda no Navegador */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Arquitetura do Projeto: React (Interface) + Pyodide (Python WebAssembly)
            </h3>
            <p className="text-xs text-slate-400">
              Separação estrita entre a camada de apresentação visual e a lógica matemática
            </p>
          </div>
        </div>

        {/* Diagrama de Fluxo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Etapa 1: UI</span>
            <div className="text-white font-semibold">1. Entrada Visual</div>
            <p className="text-slate-400 text-[11px] font-sans">
              O usuário clica nos botões visuais da calculadora ou digita pelo teclado físico.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 border border-blue-500/30 p-4 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Etapa 2: Ponte</span>
            <div className="text-blue-300 font-semibold">2. Serialização JSON</div>
            <p className="text-slate-400 text-[11px] font-sans">
              A interface empacota a expressão e argumentos em JSON e invoca a ponte WebAssembly.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 border border-emerald-500/30 p-4 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Etapa 3: Python</span>
            <div className="text-emerald-300 font-semibold">3. Execução CPython</div>
            <p className="text-slate-400 text-[11px] font-sans">
              O Pyodide executa o arquivo <code className="text-blue-400">calculadora.py</code> na CPU via WASM.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Etapa 4: Exibição</span>
            <div className="text-white font-semibold">4. Visor Atualizado</div>
            <p className="text-slate-400 text-[11px] font-sans">
              O visor da calculadora recebe o float formatado e a telemetria de milissegundos.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-white">Identificação dos Arquivos no Projeto:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-blue-400 font-semibold">Lógica Matemática (Python Puro):</span>
              <p className="text-slate-400 mt-1">/public/calculadora.py e /src/python/calculadora.py</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-semibold">Interface Visual (React / TSX):</span>
              <p className="text-slate-400 mt-1">/src/components/Calculator.tsx e Header.tsx</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
