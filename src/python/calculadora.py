"""
====================================================================
Projeto: Calculadora Visual e Científica Interativa
Arquivo: calculadora.py
Linguagem: Python 3.12 (Executado via Pyodide / WebAssembly no Navegador)
Descrição: Módulo com a lógica matemática de todas as operações,
           utilizando funções (def), estruturas condicionais (if/elif/else),
           conversão explícita com float(), tratamento robusto de
           divisão por zero e bateria de testes automatizados.
====================================================================
"""

import math
import json
import re

# ====================================================================
# 1. FUNÇÕES ARITMÉTICAS BÁSICAS (Com float() e tratamento de erros)
# ====================================================================

def somar(a, b):
    """
    Realiza a adição de dois números.
    Converte explicitamente os argumentos para float.
    """
    num1 = float(a)
    num2 = float(b)
    return num1 + num2


def subtrair(a, b):
    """
    Realiza a subtração do segundo número em relação ao primeiro.
    """
    num1 = float(a)
    num2 = float(b)
    return num1 - num2


def multiplicar(a, b):
    """
    Realiza a multiplicação de dois números reais.
    """
    num1 = float(a)
    num2 = float(b)
    return num1 * num2


def dividir(a, b):
    """
    Realiza a divisão de a por b.
    Implementa estrutura condicional e tratamento explícito
    de divisão por zero (ZeroDivisionError).
    """
    num1 = float(a)
    num2 = float(b)

    # Verificação com estrutura condicional
    if num2 == 0.0:
        raise ZeroDivisionError("Erro: Não é possível dividir por zero!")

    try:
        resultado = num1 / num2
        return resultado
    except ZeroDivisionError as erro:
        # Tratamento de exceção de divisão por zero
        raise ZeroDivisionError("Erro: Divisão por zero detectada!") from erro


# ====================================================================
# 2. FUNÇÕES CIENTÍFICAS E AVANÇADAS
# ====================================================================

def potencia(base, expoente):
    """
    Calcula a base elevada ao expoente (base ^ expoente).
    """
    b = float(base)
    exp = float(expoente)
    return math.pow(b, exp)


def raiz_quadrada(numero):
    """
    Calcula a raiz quadrada de um número.
    Valida se o número é negativo com estrutura condicional.
    """
    num = float(numero)
    if num < 0:
        raise ValueError("Erro: Raiz quadrada de número negativo não é um número real!")
    return math.sqrt(num)


def porcentagem(valor, base=None):
    """
    Calcula a porcentagem.
    - Se a base for fornecida (ex: 20% de 150 -> valor=20, base=150):
      Calcula a parte proporcional: (valor * base) / 100.0 = 30.0
    - Se a base for omitida ou None (ex: 20%):
      Converte o percentual para sua fração decimal: 20.0 / 100.0 = 0.2
    """
    v = float(valor)
    if base is None or float(base) == 100.0:
        return v / 100.0
    b = float(base)
    return (v * b) / 100.0


def fatorial(n):
    """
    Calcula o fatorial de um número inteiro não negativo.
    """
    num = int(float(n))
    if num < 0:
        raise ValueError("Erro: Fatorial não é definido para números negativos!")
    if num > 170:
        raise OverflowError("Erro: Valor muito alto para cálculo de fatorial (máx: 170)!")
    return math.factorial(num)


def seno(x, em_graus=True):
    """
    Calcula o seno de um ângulo.
    Converte graus para radianos se em_graus for True.
    """
    val = float(x)
    if em_graus:
        val = math.radians(val)
    return math.sin(val)


def cosseno(x, em_graus=True):
    """
    Calcula o cosseno de um ângulo.
    """
    val = float(x)
    if em_graus:
        val = math.radians(val)
    return math.cos(val)


def tangente(x, em_graus=True):
    """
    Calcula a tangente de um ângulo.
    Trata assíntotas como 90°, 270°, etc.
    """
    val = float(x)
    if em_graus:
        if (val - 90) % 180 == 0:
            raise ValueError("Erro: Tangente indefinida para este ângulo!")
        val = math.radians(val)
    return math.tan(val)


def logaritmo_base10(x):
    """
    Calcula o logaritmo na base 10 (log10).
    Verifica se o número é maior que zero.
    """
    val = float(x)
    if val <= 0:
        raise ValueError("Erro: Logaritmo indefinido para valores menores ou iguais a zero!")
    return math.log10(val)


def logaritmo_natural(x):
    """
    Calcula o logaritmo natural (ln / base e).
    """
    val = float(x)
    if val <= 0:
        raise ValueError("Erro: Ln indefinido para valores menores ou iguais a zero!")
    return math.log(val)


def inverter_sinal(x):
    """
    Inverte o sinal de um número (+ / -).
    """
    val = float(x)
    return -val


# ====================================================================
# 3. DISPACHADOR CONDICIONAL DE OPERAÇÕES BÁSICAS
# ====================================================================

def executar_operacao(tipo_operacao, a, b=None):
    """
    Executa a operação solicitada utilizando estruturas condicionais
    (if / elif / else), demonstrando o fluxo de controle em Python.
    Retorna um dicionário com status, resultado e metadados.
    """
    try:
        # Condicionais para identificar a operação
        if tipo_operacao in ('soma', 'somar', '+'):
            res = somar(a, b)
            simbolo = "+"
        elif tipo_operacao in ('subtracao', 'subtrair', '-'):
            res = subtrair(a, b)
            simbolo = "-"
        elif tipo_operacao in ('multiplicacao', 'multiplicar', '*', '×'):
            res = multiplicar(a, b)
            simbolo = "×"
        elif tipo_operacao in ('divisao', 'dividir', '/', '÷'):
            res = dividir(a, b)
            simbolo = "÷"
        elif tipo_operacao in ('potencia', '^', '**'):
            res = potencia(a, b)
            simbolo = "^"
        elif tipo_operacao in ('raiz', 'sqrt', '√'):
            res = raiz_quadrada(a)
            simbolo = "√"
        elif tipo_operacao in ('porcento', '%', 'porcentagem'):
            res = porcentagem(a, b)
            simbolo = "%"
        elif tipo_operacao == 'fatorial':
            res = fatorial(a)
            simbolo = "!"
        elif tipo_operacao == 'inverter':
            res = inverter_sinal(a)
            simbolo = "±"
        else:
            return {
                "sucesso": False,
                "erro": f"Operação desconhecida: '{tipo_operacao}'",
                "resultado": None
            }

        return {
            "sucesso": True,
            "resultado": formatar_resultado(res),
            "valor_bruto": float(res) if isinstance(res, (int, float)) else res,
            "operacao": simbolo,
            "mensagem": "Cálculo realizado com sucesso em Python."
        }

    except ZeroDivisionError as err:
        return {
            "sucesso": False,
            "erro": str(err),
            "tipo_erro": "ZeroDivisionError",
            "resultado": None
        }
    except ValueError as err:
        return {
            "sucesso": False,
            "erro": str(err),
            "tipo_erro": "ValueError",
            "resultado": None
        }
    except Exception as err:
        return {
            "sucesso": False,
            "erro": f"Erro inesperado: {str(err)}",
            "tipo_erro": "Exception",
            "resultado": None
        }


# ====================================================================
# 4. AVALIADOR SEGURO DE EXPRESSÕES MATEMÁTICAS COMPLETAS
# ====================================================================

# Constantes matemáticas disponibilizadas para as expressões
CONSTANTES = {
    'pi': math.pi,
    'π': math.pi,
    'e': math.e,
}

# Funções matemáticas permitidas no avaliador de expressões
FUNCOES_PERMITIDAS = {
    'sin': math.sin,
    'cos': math.cos,
    'tan': math.tan,
    'asin': math.asin,
    'acos': math.acos,
    'atan': math.atan,
    'sqrt': math.sqrt,
    'log': math.log10,
    'ln': math.log,
    'exp': math.exp,
    'abs': abs,
    'round': round,
    'fact': fatorial,
}

def calcular_expressao(expressao_str, em_graus=True):
    """
    Avalia uma expressão matemática completa digitada na calculadora.
    Suporta operadores +, -, *, /, ^, parênteses (), constantes (π, e)
    e funções científicas (sin, cos, tan, sqrt, log, ln).
    
    Toda a execução ocorre em Python real, garantindo segurança
    e captura precisa de ZeroDivisionError e ValueError.
    """
    if not expressao_str or not expressao_str.strip():
        return {
            "sucesso": True,
            "resultado": "0",
            "valor_bruto": 0.0,
            "expressao": ""
        }

    expr_original = expressao_str.strip()
    expr = expr_original

    # Normalização de símbolos visuais para sintaxe Python
    expr = expr.replace('×', '*').replace('÷', '/').replace('^', '**')
    expr = expr.replace('π', 'pi')
    expr = expr.replace(',', '.')

    # Verificação de segurança: caracteres permitidos apenas
    # Números, operadores, parênteses, pontos e nomes de funções
    caracteres_validos = re.compile(r'^[0-9+\-*/().%\s\^a-zA-Z_]+$')
    if not caracteres_validos.match(expr):
        return {
            "sucesso": False,
            "erro": "Expressão contém caracteres inválidos!",
            "tipo_erro": "SecurityError"
        }

    # Normalização inteligente de porcentagens
    # 1. Trata 'de' ou 'of' como multiplicação (ex: 20% de 150 -> 20% * 150)
    expr = re.sub(r'(\d+(?:\.\d+)?%)\s*(?:de|of)\s*(\d+(?:\.\d+)?)', r'\1 * \2', expr, flags=re.IGNORECASE)

    # 2. Trata multiplicação implícita após % (ex: 20% 150 -> 20% * 150)
    expr = re.sub(r'(\d+(?:\.\d+)?%)\s*([0-9(])', r'\1 * \2', expr)

    # 3. Trata adição e subtração percentual sobre uma base (ex: 150 + 20% -> 150 + (150 * (20/100.0)) = 180)
    expr = re.sub(
        r'(\b\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)%',
        r'(\1 \2 (\1 * (\3 / 100.0)))',
        expr
    )

    # 4. Trata 'A % B' como porcentagem direta (ex: 20 % 150 -> (20 * 150 / 100.0) = 30)
    expr = re.sub(
        r'(\b\d+(?:\.\d+)?)\s*%\s*(\d+(?:\.\d+)?\b)',
        r'((\1 * \2) / 100.0)',
        expr
    )

    # 5. Tratamento para porcentagem direta/multiplicação (ex: 150 * 20% -> 150 * (20/100.0) = 30)
    expr = re.sub(r'(\d+(\.\d+)?)%', r'(\1/100.0)', expr)

    # Se estiver em modo graus, ajusta chamadas de sin, cos, tan
    contexto = {}
    contexto.update(CONSTANTES)

    if em_graus:
        contexto['sin'] = lambda x: math.sin(math.radians(float(x)))
        contexto['cos'] = lambda x: math.cos(math.radians(float(x)))
        contexto['tan'] = lambda x: tangente(x, em_graus=True)
    else:
        contexto['sin'] = lambda x: math.sin(float(x))
        contexto['cos'] = lambda x: math.cos(float(x))
        contexto['tan'] = lambda x: math.tan(float(x))

    contexto['sqrt'] = raiz_quadrada
    contexto['log'] = logaritmo_base10
    contexto['ln'] = logaritmo_natural
    contexto['fact'] = fatorial
    contexto['abs'] = abs

    # Avaliação em ambiente Python isolado
    try:
        # __builtins__ vazio impede qualquer comando perigoso
        resultado = eval(expr, {"__builtins__": None}, contexto)

        # Conversão explícita para float
        res_float = float(resultado)

        # Trata números especiais como NaN ou infinito
        if math.isnan(res_float):
            return {
                "sucesso": False,
                "erro": "Resultado não é um número real (NaN)",
                "tipo_erro": "ArithmeticError"
            }
        if math.isinf(res_float):
            return {
                "sucesso": False,
                "erro": "Erro: Divisão por zero ou estouro numérico (Infinito)",
                "tipo_erro": "ZeroDivisionError"
            }

        return {
            "sucesso": True,
            "resultado": formatar_resultado(res_float),
            "valor_bruto": res_float,
            "expressao": expr_original,
            "tipo_dado": type(resultado).__name__
        }

    except ZeroDivisionError:
        return {
            "sucesso": False,
            "erro": "Erro: Não é possível dividir por zero!",
            "tipo_erro": "ZeroDivisionError"
        }
    except ValueError as val_err:
        return {
            "sucesso": False,
            "erro": str(val_err),
            "tipo_erro": "ValueError"
        }
    except SyntaxError:
        return {
            "sucesso": False,
            "erro": "Expressão com sintaxe incorreta ou parênteses abertos!",
            "tipo_erro": "SyntaxError"
        }
    except Exception as exc:
        return {
            "sucesso": False,
            "erro": f"Erro matemático: {str(exc)}",
            "tipo_erro": "EvaluationError"
        }


# ====================================================================
# 5. FORMATAÇÃO E UTILITÁRIOS
# ====================================================================

def formatar_resultado(valor):
    """
    Formata o número para exibição agradável no visor da calculadora.
    Remove zeros desnecessários após o ponto decimal e evita erros
    de precisão binária IEEE 754 (como 0.1 + 0.2 = 0.30000000000000004).
    """
    if isinstance(valor, bool):
        return str(valor)

    val = float(valor)

    # Se for inteiro exato (ex: 5.0), exibe apenas 5
    if val.is_integer() and abs(val) < 1e15:
        return str(int(val))

    # Para valores muito grandes ou muito pequenos, usa notação científica
    if (abs(val) >= 1e12 or (abs(val) < 1e-6 and val != 0)):
        return f"{val:.6e}"

    # Arredonda para até 10 casas decimais para limpar resíduos de ponto flutuante
    arredondado = round(val, 10)
    if arredondado.is_integer():
        return str(int(arredondado))
    
    # Converte e remove zeros finais
    texto = f"{arredondado:.10f}".rstrip('0').rstrip('.')
    return texto


# ====================================================================
# 6. BATERIA DE TESTES AUTOMATIZADOS (Validação Requerida)
# ====================================================================

def executar_testes_unitarios():
    """
    Executa uma bateria completa de testes de software diretamente em Python,
    validando todas as quatro operações, inteiros, decimais float,
    divisão por zero e funções científicas.
    Retorna uma lista estruturada de resultados para a interface.
    """
    testes = []

    def registrar_teste(nome, descricao, entrada, esperado, resultado_obtido, passou, detalhe=""):
        testes.append({
            "nome": nome,
            "descricao": descricao,
            "entrada": entrada,
            "esperado": str(esperado),
            "obtido": str(resultado_obtido),
            "passou": passou,
            "detalhe": detalhe
        })

    # Teste 1: Adição com inteiros
    try:
        r = somar(12, 8)
        passou = (r == 20.0)
        registrar_teste("Adição de Inteiros", "Soma básica 12 + 8", "12, 8", 20.0, r, passou, "Tipo retornado: float")
    except Exception as e:
        registrar_teste("Adição de Inteiros", "Soma básica 12 + 8", "12, 8", 20.0, str(e), False, "Exceção disparada")

    # Teste 2: Adição com decimais (float)
    try:
        r = somar(0.1, 0.2)
        # Comparação com tolerância float
        passou = math.isclose(r, 0.3, rel_tol=1e-9)
        registrar_teste("Adição com Decimais (float)", "Soma de números com vírgula 0.1 + 0.2", "0.1, 0.2", 0.3, formatar_resultado(r), passou, "Uso explícito de float()")
    except Exception as e:
        registrar_teste("Adição com Decimais (float)", "Soma com float", "0.1, 0.2", 0.3, str(e), False)

    # Teste 3: Subtração
    try:
        r = subtrair(45.75, 15.25)
        passou = math.isclose(r, 30.5, rel_tol=1e-9)
        registrar_teste("Subtração", "Subtração decimal 45.75 - 15.25", "45.75, 15.25", 30.5, r, passou)
    except Exception as e:
        registrar_teste("Subtração", "Subtração decimal", "45.75, 15.25", 30.5, str(e), False)

    # Teste 4: Multiplicação
    try:
        r = multiplicar(7.5, 4)
        passou = (r == 30.0)
        registrar_teste("Multiplicação", "Multiplicação mista 7.5 × 4", "7.5, 4", 30.0, r, passou)
    except Exception as e:
        registrar_teste("Multiplicação", "Multiplicação", "7.5, 4", 30.0, str(e), False)

    # Teste 5: Divisão comum
    try:
        r = dividir(100, 4)
        passou = (r == 25.0)
        registrar_teste("Divisão Comum", "Divisão exata 100 ÷ 4", "100, 4", 25.0, r, passou)
    except Exception as e:
        registrar_teste("Divisão Comum", "Divisão", "100, 4", 25.0, str(e), False)

    # Teste 6: Divisão por Zero (Tratamento de Exceção)
    try:
        dividir(42, 0)
        # Se não disparar exceção, falhou
        registrar_teste("Divisão por Zero", "Divisão 42 ÷ 0 (deve capturar ZeroDivisionError)", "42, 0", "ZeroDivisionError", "Não lançou erro", False)
    except ZeroDivisionError as err:
        registrar_teste("Divisão por Zero", "Divisão 42 ÷ 0 capturada com sucesso", "42, 0", "ZeroDivisionError", str(err), True, "Exceção capturada com sucesso!")
    except Exception as e:
        registrar_teste("Divisão por Zero", "Divisão 42 ÷ 0", "42, 0", "ZeroDivisionError", f"Tipo errado: {type(e).__name__}", False)

    # Teste 7: Potência e Raiz Quadrada
    try:
        p = potencia(2, 8)
        rq = raiz_quadrada(81)
        passou = (p == 256.0 and rq == 9.0)
        registrar_teste("Potência e Raiz", "Cálculo de 2^8 e √81", "2^8 e √81", "256 e 9", f"{p} e {rq}", passou)
    except Exception as e:
        registrar_teste("Potência e Raiz", "Potência e Raiz", "2^8 e √81", "256 e 9", str(e), False)

    # Teste 8: Avaliação de Expressão Complexa com Parênteses
    try:
        res = calcular_expressao("(10 + 5) * 2 - (18 / 3)")
        # (15)*2 - 6 = 30 - 6 = 24
        passou = res["sucesso"] and (res["valor_bruto"] == 24.0)
        registrar_teste("Expressão com Parênteses", "Expressão (10 + 5) × 2 - (18 ÷ 3)", "(10 + 5) * 2 - (18 / 3)", "24", res.get("resultado"), passou, "Ordem de precedência matemática")
    except Exception as e:
        registrar_teste("Expressão com Parênteses", "Expressão", "(10 + 5) * 2 - (18 / 3)", "24", str(e), False)

    # Teste 9: Expressão com Divisão por Zero em Cadeia
    try:
        res_zero = calcular_expressao("10 + (5 / 0)")
        passou = (not res_zero["sucesso"]) and ("zero" in res_zero.get("erro", "").lower())
        registrar_teste("Zero em Expressão", "Captura de 10 + (5 ÷ 0) na expressão", "10 + (5 / 0)", "Erro de divisão por zero", res_zero.get("erro"), passou)
    except Exception as e:
        registrar_teste("Zero em Expressão", "Zero na expressão", "10 + (5 / 0)", "Erro", str(e), False)

    # Teste 10: Funções Trigonométricas em Graus
    try:
        s90 = seno(90, em_graus=True)
        c0 = cosseno(0, em_graus=True)
        passou = math.isclose(s90, 1.0, rel_tol=1e-9) and math.isclose(c0, 1.0, rel_tol=1e-9)
        registrar_teste("Trigonometria (Graus)", "sen(90°) e cos(0°)", "sen(90°), cos(0°)", "1.0 e 1.0", f"{s90:.1f} e {c0:.1f}", passou)
    except Exception as e:
        registrar_teste("Trigonometria (Graus)", "Trig", "sen(90°), cos(0°)", "1.0 e 1.0", str(e), False)

    # Teste 11: Cálculo de Porcentagem Direta
    try:
        p1 = porcentagem(20, 150)
        p2 = porcentagem(20)
        passou = (p1 == 30.0 and math.isclose(p2, 0.2, rel_tol=1e-9))
        registrar_teste("Porcentagem Direta", "Cálculo de 20% de 150 e 20% decimal", "porcentagem(20, 150)", 30.0, p1, passou, "20% de 150 = 30")
    except Exception as e:
        registrar_teste("Porcentagem Direta", "Cálculo de 20% de 150", "20, 150", 30.0, str(e), False)

    # Teste 12: Expressão com Porcentagem
    try:
        res_mult = calcular_expressao("150 * 20%")
        res_soma = calcular_expressao("150 + 20%")
        passou = (res_mult["sucesso"] and res_mult["valor_bruto"] == 30.0 and
                  res_soma["sucesso"] and res_soma["valor_bruto"] == 180.0)
        registrar_teste("Expressão com Porcentagem", "Avaliação de 150 × 20% e acréscimo 150 + 20%", "150 * 20% e 150 + 20%", "30 e 180", f"{res_mult.get('resultado')} e {res_soma.get('resultado')}", passou, "Acréscimo e proporção")
    except Exception as e:
        registrar_teste("Expressão com Porcentagem", "150 * 20%", "150 * 20%", "30", str(e), False)

    total_passou = sum(1 for t in testes if t["passou"])
    return {
        "total": len(testes),
        "passou": total_passou,
        "falhou": len(testes) - total_passou,
        "todos_passaram": total_passou == len(testes),
        "detalhes": testes
    }


# ====================================================================
# 7. INTERFACE JSON PARA COMUNICAÇÃO COM O WEB WORKER / PYODIDE
# ====================================================================

def processar_requisicao_json(payload_str):
    """
    Função facilitadora que recebe uma string JSON da interface JavaScript,
    processa o cálculo em Python puro e retorna a resposta formatada em JSON.
    Garante isolamento limpo entre o mundo JS e o mundo Python.
    """
    try:
        dados = json.loads(payload_str)
        comando = dados.get("comando", "calcular_expressao")

        if comando == "calcular_expressao":
            expr = dados.get("expressao", "")
            em_graus = dados.get("em_graus", True)
            res = calcular_expressao(expr, em_graus=em_graus)
            return json.dumps(res)

        elif comando == "operar":
            tipo = dados.get("operacao")
            a = dados.get("a")
            b = dados.get("b", None)
            res = executar_operacao(tipo, a, b)
            return json.dumps(res)

        elif comando == "executar_testes":
            res = executar_testes_unitarios()
            return json.dumps(res)

        elif comando == "avaliar_codigo_livre":
            # Usado pelo Console / Sandbox interativo em Python
            codigo = dados.get("codigo", "")
            local_vars = {
                "somar": somar,
                "subtrair": subtrair,
                "multiplicar": multiplicar,
                "dividir": dividir,
                "potencia": potencia,
                "raiz_quadrada": raiz_quadrada,
                "porcentagem": porcentagem,
                "fatorial": fatorial,
                "seno": seno,
                "cosseno": cosseno,
                "tangente": tangente,
                "math": math
            }
            try:
                resultado_eval = eval(codigo, {"__builtins__": __builtins__}, local_vars)
                return json.dumps({
                    "sucesso": True,
                    "saida": repr(resultado_eval),
                    "tipo": type(resultado_eval).__name__
                })
            except SyntaxError:
                import io
                import sys
                buffer = io.StringIO()
                sys.stdout = buffer
                try:
                    exec(codigo, {"__builtins__": __builtins__}, local_vars)
                    sys.stdout = sys.__stdout__
                    return json.dumps({
                        "sucesso": True,
                        "saida": buffer.getvalue() or "Código executado com sucesso (sem retorno direto).",
                        "tipo": "Execução de Bloco"
                    })
                except Exception as inner_err:
                    sys.stdout = sys.__stdout__
                    return json.dumps({
                        "sucesso": False,
                        "erro": str(inner_err),
                        "tipo": type(inner_err).__name__
                    })
        else:
            return json.dumps({
                "sucesso": False,
                "erro": f"Comando '{comando}' não reconhecido."
            })

    except Exception as global_err:
        return json.dumps({
            "sucesso": False,
            "erro": f"Erro interno ao processar requisição: {str(global_err)}"
        })


if __name__ == "__main__":
    print("Módulo calculadora.py carregado com sucesso!")
    print("Executando bateria preliminar de testes...")
    resultado_testes = executar_testes_unitarios()
    print(f"Testes finalizados: {resultado_testes['passou']}/{resultado_testes['total']} passaram.")
