export enum ResultCategory {
  PROCESS = 'Process Bottleneck',
  ROLE = 'Role & Ownership Bottleneck',
  VISIBILITY = 'Performance Visibility Bottleneck',
}

export interface Option {
  id: string;
  text: string;
  category: ResultCategory;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface DiagnosticState {
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestionIndex: number;
  answers: Record<number, ResultCategory>;
  result: ResultCategory | null;
}

export const LEAD_MAGNET_TITLE = "Manager’s Bottleneck Diagnostic";
