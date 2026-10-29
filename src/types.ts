export type CodeVersionKey = 'funcoes' | 'basico' | 'completo';

export interface CodeVersion {
  id: CodeVersionKey;
  title: string;
  badge: string;
  description: string;
  code: string;
  filename: string;
}

export interface CodeAnnotation {
  id: string;
  title: string;
  description: string;
  codeSnippet: string;
  tip: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TerminalLog {
  id: string;
  type: 'system' | 'output' | 'input' | 'error' | 'success';
  text: string;
}
