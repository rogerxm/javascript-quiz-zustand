export interface Question {
  id: number;
  question: string;
  code: string;
  answers: string[];
  correctAnswer: number;
  userSelecterAnswer?: number;
  isCorrectUserAnswer?: boolean;
}
