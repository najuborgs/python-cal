import { CodeVersion, CodeAnnotation } from '../types';

export const CODE_VERSIONS: Record<string, CodeVersion> = {
  funcoes: {
    id: 'funcoes',
    title: 'Com Funções (Recomendado)',
    badge: 'Boas Práticas',
    filename: 'calculadora_funcoes.py',
    description: 'Código modular e limpo utilizando funções com "def". É a forma profissional recomendada pela comunidade Python.',
    code: `# ============================================================
# CALCULADORA BÁSICA EM PYTHON
# Operações: Adição, Subtração, Multiplicação e Divisão
# ============================================================

# 1. DEFINIÇÃO DAS FUNÇÕES MATEMÁTICAS
def adicao(a, b):
    """Retorna a soma de dois números."""
    return a + b

def subtracao(a, b):
    """Retorna a diferença entre dois números."""
    return a - b

def multiplicacao(a, b):
    """Retorna o produto de dois números."""
    return a * b

def divisao(a, b):
    """Retorna o quociente de dois números e evita divisão por zero."""
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b

# 2. PROGRAMA PRINCIPAL
def main():
    print("=" * 35)
    print("       CALCULADORA EM PYTHON       ")
    print("=" * 35)
    print("1 - Adição (+)")
    print("2 - Subtração (-)")
    print("3 - Multiplicação (*)")
    print("4 - Divisão (/)")
    print("-" * 35)

    # 3. ENTRADA DO USUÁRIO
    opcao = input("Escolha uma operação (1/2/3/4): ").strip()

    # Valida se a opção é válida antes de pedir os números
    if opcao not in ['1', '2', '3', '4']:
        print("Opção inválida! Reinicie o programa e escolha entre 1 e 4.")
        return

    # Entrada e conversão dos números para float (permite decimais)
    try:
        num1 = float(input("Digite o primeiro número: "))
        num2 = float(input("Digite o segundo número: "))
    except ValueError:
        print("Erro: Por favor, digite apenas números válidos!")
        return

    print("-" * 35)

    # 4. PROCESSAMENTO E RESULTADO
    if opcao == '1':
        resultado = adicao(num1, num2)
        print(f"Resultado: {num1} + {num2} = {resultado}")
    elif opcao == '2':
        resultado = subtracao(num1, num2)
        print(f"Resultado: {num1} - {num2} = {resultado}")
    elif opcao == '3':
        resultado = multiplicacao(num1, num2)
        print(f"Resultado: {num1} * {num2} = {resultado}")
    elif opcao == '4':
        resultado = divisao(num1, num2)
        if isinstance(resultado, str):
            print(resultado)
        else:
            print(f"Resultado: {num1} / {num2} = {resultado}")

# Executa o programa
if __name__ == "__main__":
    main()`
  },
  basico: {
    id: 'basico',
    title: 'Super Básico (Linear)',
    badge: 'Iniciante 1º Dia',
    filename: 'calculadora_simples.py',
    description: 'A versão mais direta possível para quem está escrevendo as primeiras linhas de código. Sem funções complexas.',
    code: `# CALCULADORA SIMPLES - 4 OPERAÇÕES BÁSICAS

print("--- CALCULADORA BÁSICA ---")

# 1. Pede os dois números ao usuário
# float() converte o texto digitado em número com ponto flutuante
numero1 = float(input("Digite o primeiro número: "))
numero2 = float(input("Digite o segundo número: "))

# 2. Pede qual operação deseja fazer
print("Operações disponíveis: +, -, *, /")
operacao = input("Digite o símbolo da operação: ")

# 3. Verifica a operação com if/elif/else e calcula
if operacao == "+":
    resultado = numero1 + numero2
    print(f"Resultado da soma: {numero1} + {numero2} = {resultado}")

elif operacao == "-":
    resultado = numero1 - numero2
    print(f"Resultado da subtração: {numero1} - {numero2} = {resultado}")

elif operacao == "*":
    resultado = numero1 * numero2
    print(f"Resultado da multiplicação: {numero1} * {numero2} = {resultado}")

elif operacao == "/":
    if numero2 == 0:
        print("Erro: Divisão por zero não é permitida na matemática!")
    else:
        resultado = numero1 / numero2
        print(f"Resultado da divisão: {numero1} / {numero2} = {resultado}")

else:
    print("Operação inválida! Use apenas +, -, * ou /.")`
  },
  completo: {
    id: 'completo',
    title: 'Interativa com Loop (while)',
    badge: 'Avançado',
    filename: 'calculadora_continua.py',
    description: 'Funciona continuamente até o usuário escolher sair (opção 0), com tratamento de erros robusto.',
    code: `# CALCULADORA EM LOOP CONTÍNUO COM WHILE TRUE

def calcular():
    while True:
        print("\n" + "=" * 32)
        print("    CALCULADORA INTERATIVA    ")
        print("=" * 32)
        print("1. Somar (+)")
        print("2. Subtrair (-)")
        print("3. Multiplicar (*)")
        print("4. Dividir (/)")
        print("0. Sair do programa")
        print("-" * 32)
        
        escolha = input("Escolha uma opção (0 a 4): ").strip()
        
        if escolha == '0':
            print("Obrigado por usar a calculadora! Até logo.")
            break
            
        if escolha not in ['1', '2', '3', '4']:
            print("Opção inválida! Tente novamente.")
            continue
            
        try:
            n1 = float(input("Digite o 1º número: "))
            n2 = float(input("Digite o 2º número: "))
        except ValueError:
            print("Valor inválido! Digite apenas números.")
            continue
            
        if escolha == '1':
            print(f">>> Resposta: {n1} + {n2} = {n1 + n2}")
        elif escolha == '2':
            print(f">>> Resposta: {n1} - {n2} = {n1 - n2}")
        elif escolha == '3':
            print(f">>> Resposta: {n1} * {n2} = {n1 * n2}")
        elif escolha == '4':
            if n2 == 0:
                print(">>> Erro: Não é possível dividir por zero!")
            else:
                print(f">>> Resposta: {n1} / {n2} = {n1 / n2}")

calcular()`
  }
};

export const CODE_ANNOTATIONS: CodeAnnotation[] = [
  {
    id: 'functions',
    title: 'Funções com def',
    description: 'A palavra-chave "def" cria blocos de código reutilizáveis. Em vez de repetir contas, criamos uma função para cada operação matemática.',
    codeSnippet: 'def adicao(a, b):\n    return a + b',
    tip: 'Vantagem: Facilita testes e deixa o código limpo e organizado!'
  },
  {
    id: 'input_float',
    title: 'input() e float()',
    description: 'O comando input() lê o que você digita no teclado sempre como TEXTO (string). Usamos float() para convertê-lo em número decimal.',
    codeSnippet: 'num1 = float(input("Digite o número: "))',
    tip: 'Se não usar float(), "5" + "5" resultaria em "55" (texto grudado) em vez de 10!'
  },
  {
    id: 'if_elif_else',
    title: 'Condicionais if, elif e else',
    description: 'Controlam o fluxo de decisão do programa. O computador avalia qual opção foi escolhida e executa exclusivamente o bloco correspondente.',
    codeSnippet: 'if opcao == "1":\n    ...\nelif opcao == "2":\n    ...\nelse:\n    print("Opção inválida")',
    tip: 'O "elif" é a abreviação de "else if" (senão se).'
  },
  {
    id: 'div_zero',
    title: 'Proteção contra Divisão por Zero',
    description: 'Na matemática, dividir qualquer número por 0 é indefinido. Em programação, se tentarmos fazer isso sem verificar, o Python trava gerando um ZeroDivisionError.',
    codeSnippet: 'if b == 0:\n    return "Erro: divisão por zero"\nreturn a / b',
    tip: 'Sempre confira se o segundo número (divisor) é diferente de zero antes da barra "/".'
  },
  {
    id: 'fstrings',
    title: 'F-Strings (Formatação Moderna)',
    description: 'Colocar a letra f antes das aspas permite injetar variáveis e expressões diretamente dentro da mensagem usando chaves {}.',
    codeSnippet: 'print(f"Resultado: {num1} + {num2} = {resultado}")',
    tip: 'Muito mais legível do que usar concatenações com o sinal de mais ("Texto " + str(num)).'
  }
];
