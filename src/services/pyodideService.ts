/**
 * Pyodide Service - Conexão WebAssembly com o CPython 3.12
 * Executa código Python real no navegador do usuário.
 */

// Importa o código bruto de calculadora.py
// @ts-ignore
import CALCULADORA_PY_CODE from '../python/calculadora.py?raw';

export interface PythonCalculationResponse {
  sucesso: boolean;
  resultado?: string;
  valor_bruto?: number;
  expressao?: string;
  operacao?: string;
  erro?: string;
  tipo_erro?: string;
  tempo_execucao_ms?: number;
  tipo_dado?: string;
}

export interface UnitTestDetail {
  nome: string;
  descricao: string;
  entrada: string;
  esperado: string;
  obtido: string;
  passou: boolean;
  detalhe?: string;
}

export interface UnitTestsResponse {
  total: number;
  passou: number;
  falhou: number;
  todos_passaram: boolean;
  detalhes: UnitTestDetail[];
  tempo_execucao_ms: number;
}

export interface PythonFreeExecutionResponse {
  sucesso: boolean;
  saida?: string;
  erro?: string;
  tipo?: string;
  tempo_execucao_ms: number;
}

type Listener = (state: PyodideState) => void;

export interface PyodideState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  mensagem: string;
  versaoPython: string;
  tempoCarregamentoMs: number;
}

class PyodideBridge {
  private pyodideInstance: any = null;
  private state: PyodideState = {
    status: 'idle',
    mensagem: 'Aguardando inicialização do Python...',
    versaoPython: 'Python 3.12 (Pyodide WASM)',
    tempoCarregamentoMs: 0,
  };
  private listeners: Set<Listener> = new Set();
  private initPromise: Promise<any> | null = null;

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<PyodideState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((fn) => fn(this.state));
  }

  public getState(): PyodideState {
    return this.state;
  }

  /**
   * Garante que o script do Pyodide foi injetado e carregado
   */
  private async ensurePyodideScript(): Promise<void> {
    if ((window as any).loadPyodide) {
      return;
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="pyodide.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', (e) => reject(e));
        // Se já carregou antes do listener
        if ((window as any).loadPyodide) {
          resolve();
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  /**
   * Inicializa o interpretador WebAssembly do Python
   */
  public async init(): Promise<any> {
    if (this.pyodideInstance) {
      return this.pyodideInstance;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const inicio = performance.now();
      try {
        this.updateState({
          status: 'loading',
          mensagem: 'Carregando binário WebAssembly do CPython 3.12...',
        });

        await this.ensurePyodideScript();

        this.updateState({
          mensagem: 'Instanciando interpretador Pyodide WebAssembly...',
        });

        const pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });

        this.updateState({
          mensagem: 'Compilando e registrando módulo calculadora.py...',
        });

        // Carrega o código Python contido em calculadora.py
        await pyodide.runPythonAsync(CALCULADORA_PY_CODE);

        const tempoTotal = Math.round(performance.now() - inicio);
        this.pyodideInstance = pyodide;

        // Pega versão real do Python
        const pyVer = pyodide.runPython("import sys; f'Python {sys.version.split()[0]}'");

        this.updateState({
          status: 'ready',
          mensagem: 'Ambiente CPython WebAssembly pronto e operando.',
          versaoPython: `${pyVer} (Pyodide WASM)`,
          tempoCarregamentoMs: tempoTotal,
        });

        return pyodide;
      } catch (err: any) {
        console.error('Falha ao inicializar Pyodide:', err);
        this.updateState({
          status: 'error',
          mensagem: `Erro ao iniciar Python WASM: ${err.message || 'Falha de rede ou compatibilidade'}`,
        });
        throw err;
      }
    })();

    return this.initPromise;
  }

  /**
   * Avalia uma expressão matemática chamando Python de verdade
   */
  public async calcularExpressao(
    expressao: string,
    emGraus: boolean = true
  ): Promise<PythonCalculationResponse> {
    const pyodide = await this.init();
    const t0 = performance.now();

    try {
      const payload = JSON.stringify({
        comando: 'calcular_expressao',
        expressao,
        em_graus: emGraus,
      });

      // Passa como string escapada para a função Python processar_requisicao_json
      const func = pyodide.globals.get('processar_requisicao_json');
      const resultadoJsonStr = func(payload);
      const t1 = performance.now();

      const parsed: PythonCalculationResponse = JSON.parse(resultadoJsonStr);
      parsed.tempo_execucao_ms = Math.round((t1 - t0) * 100) / 100;

      return parsed;
    } catch (err: any) {
      const t1 = performance.now();
      return {
        sucesso: false,
        erro: `Erro na execução Python: ${err.message || String(err)}`,
        tipo_erro: 'PyodideExecutionError',
        tempo_execucao_ms: Math.round((t1 - t0) * 100) / 100,
      };
    }
  }

  /**
   * Executa uma operação direta (a, b) usando as funções def somar, dividir, etc.
   */
  public async executarOperacao(
    operacao: string,
    a: number | string,
    b?: number | string
  ): Promise<PythonCalculationResponse> {
    const pyodide = await this.init();
    const t0 = performance.now();

    try {
      const payload = JSON.stringify({
        comando: 'operar',
        operacao,
        a,
        b,
      });

      const func = pyodide.globals.get('processar_requisicao_json');
      const resultadoJsonStr = func(payload);
      const t1 = performance.now();

      const parsed: PythonCalculationResponse = JSON.parse(resultadoJsonStr);
      parsed.tempo_execucao_ms = Math.round((t1 - t0) * 100) / 100;

      return parsed;
    } catch (err: any) {
      const t1 = performance.now();
      return {
        sucesso: false,
        erro: `Erro no cálculo Python: ${err.message || String(err)}`,
        tipo_erro: 'PyodideExecutionError',
        tempo_execucao_ms: Math.round((t1 - t0) * 100) / 100,
      };
    }
  }

  /**
   * Executa a bateria de testes unitários diretamente em Python
   */
  public async executarTestesUnitarios(): Promise<UnitTestsResponse> {
    const pyodide = await this.init();
    const t0 = performance.now();

    const payload = JSON.stringify({
      comando: 'executar_testes',
    });

    const func = pyodide.globals.get('processar_requisicao_json');
    const resultadoJsonStr = func(payload);
    const t1 = performance.now();

    const parsed = JSON.parse(resultadoJsonStr);
    parsed.tempo_execucao_ms = Math.round((t1 - t0) * 100) / 100;
    return parsed;
  }

  /**
   * Executa código arbitrário de Python pelo console/sandbox didático
   */
  public async executarCodigoLivre(codigo: string): Promise<PythonFreeExecutionResponse> {
    const pyodide = await this.init();
    const t0 = performance.now();

    const payload = JSON.stringify({
      comando: 'avaliar_codigo_livre',
      codigo,
    });

    const func = pyodide.globals.get('processar_requisicao_json');
    const resultadoJsonStr = func(payload);
    const t1 = performance.now();

    const parsed = JSON.parse(resultadoJsonStr);
    parsed.tempo_execucao_ms = Math.round((t1 - t0) * 100) / 100;
    return parsed;
  }

  /**
   * Obtém o código-fonte puro de calculadora.py
   */
  public getCodigoFontePython(): string {
    return CALCULADORA_PY_CODE;
  }
}

export const pyodideService = new PyodideBridge();
