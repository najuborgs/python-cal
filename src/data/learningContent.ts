import { QuizQuestion } from '../types';

export const PILLARS_OF_CODE = [
  {
    step: '01',
    title: 'Funções Reutilizáveis (def)',
    description: 'Em vez de espalhar contas matemáticas pelo código, criamos blocos organizados com o comando def. Cada função recebe entradas (parâmetros a e b) e devolve a resposta com return.',
    icon: 'Layers',
    pythonCode: 'def adicao(a, b):\n    return a + b',
    detail: 'Funções deixam o código modular, legível e muito mais fácil de testar.'
  },
  {
    step: '02',
    title: 'Entrada de Dados (input & float)',
    description: 'A função input() aguarda o usuário digitar algo no teclado. Porém, ela SEMPRE retorna uma string (texto). Para realizar cálculos matemáticos, precisamos converter esse texto para número decimal usando float().',
    icon: 'Terminal',
    pythonCode: 'numero = float(input("Digite um valor: "))',
    detail: 'Dica: Use int() se quiser apenas números inteiros sem vírgula, ou float() para permitir valores como 3.14 ou 2.5.'
  },
  {
    step: '03',
    title: 'Tomada de Decisão (if / elif / else)',
    description: 'O Python precisa saber qual cálculo realizar com base no que você escolheu no menu. As estruturas condicionais analisam expressões lógicas e executam o caminho correspondente.',
    icon: 'GitBranch',
    pythonCode: 'if opcao == "1":\n    ...\nelif opcao == "2":\n    ...\nelse:\n    print("Opção inválida")',
    detail: 'O Python usa indentação (espaços à esquerda) para saber quais linhas pertencem a cada bloco.'
  },
  {
    step: '04',
    title: 'Prevenção de Erros (ZeroDivisionError)',
    description: 'Dividir qualquer número por zero resulta em um erro fatal que encerra o programa bruscamente no Python. Para evitar isso, checamos se o divisor é 0 antes de realizar a divisão.',
    icon: 'ShieldAlert',
    pythonCode: 'if b == 0:\n    return "Erro: Impossível dividir por zero"\nreturn a / b',
    detail: 'Sempre planeje casos extremos para que seu programa seja seguro e agradável para quem usa.'
  }
];

export const HOW_TO_RUN_STEPS = [
  {
    step: 1,
    title: 'Instale o Python no seu Computador',
    content: 'Acesse o site oficial https://python.org e baixe a versão mais recente para Windows, Mac ou Linux. Durante a instalação no Windows, marque a caixinha "Add Python to PATH"!'
  },
  {
    step: 2,
    title: 'Crie o Arquivo de Código',
    content: 'Abra um editor de texto (como o VS Code, PyCharm ou o próprio Bloco de Notas) e salve o código com o nome calculadora.py'
  },
  {
    step: 3,
    title: 'Abra o Terminal ou Prompt de Comando',
    content: 'Navegue até a pasta onde salvou o arquivo e digite:'
  },
  {
    step: 4,
    title: 'Dica Extra: Google Colab',
    content: 'Se preferir não instalar nada agora, abra https://colab.research.google.com no navegador, cole o código em uma célula e aperte o botão "Play".'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Por que precisamos usar float() ao redor da função input()?',
    options: [
      'Porque o input() lê os dados como texto (string), e precisamos de números para fazer cálculos.',
      'Porque o Python não aceita letras na tela sem a função float.',
      'Porque float() faz o programa executar mais rápido.',
      'Porque sem float() a tela do computador fica preta.'
    ],
    correctIndex: 0,
    explanation: 'Exato! O input() sempre devolve o que o usuário digita como String (texto). Se digitarmos 5 e 5 e somarmos sem converter, teríamos "5" + "5" = "55" (concatenação) em vez de 10.'
  },
  {
    id: 2,
    question: 'O que acontece no Python se tentarmos calcular 10 / 0 diretamente?',
    options: [
      'O Python retorna o símbolo de infinito (∞).',
      'O Python trava com o erro fatal "ZeroDivisionError".',
      'O Python arredonda para zero.',
      'O Python reinicia o computador.'
    ],
    correctIndex: 1,
    explanation: 'Correto! Em Python, a divisão por zero gera a exceção ZeroDivisionError. Por isso colocamos a verificação "if b == 0" para proteger nosso programa!'
  },
  {
    id: 3,
    question: 'Para que serve o comando "return" dentro de uma função def?',
    options: [
      'Para desligar o computador após a conta.',
      'Para devolver o resultado calculado de volta para quem chamou a função.',
      'Para apagar as variáveis da memória.',
      'Para imprimir o texto colorido na tela.'
    ],
    correctIndex: 1,
    explanation: 'Muito bem! O "return" encerra a execução da função e devolve o valor resultante para que possamos guardá-lo numa variável ou mostrá-lo na tela.'
  },
  {
    id: 4,
    question: 'Qual a vantagem de usar f-strings como f"Resultado: {a + b}"?',
    options: [
      'Facilita inserir variáveis e contas diretamente dentro de um texto de forma legível e moderna.',
      'Transforma o código em inteligência artificial.',
      'É obrigatório, o Python não aceita print normal.',
      'Serve apenas para mudar a cor da fonte.'
    ],
    correctIndex: 0,
    explanation: 'Perfeito! As f-strings (format strings, introduzidas no Python 3.6) tornam o código muito mais limpo do que juntar textos com "+ str(x)".'
  }
];
