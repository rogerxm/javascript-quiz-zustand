import { create } from "zustand";
import { type Question } from "../types";
import { persist } from "zustand/middleware";
import confetti from "canvas-confetti";

interface State {
  questions: Question[];
  currentQuestion: number;
  fetchQuestions: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  reset: () => void;
}

export const useQuestionsStore = create<State>()(
  persist(
    (set, get) => {
      return {
        questions: [],
        currentQuestion: 0,
        fetchQuestions: async (limit: number) => {
          const res = await fetch("/data.json");
          const json = await res.json();

          const questions = json
            .sort(() => Math.random() - 0.5)
            .slice(0, limit);
          set({ questions });
        },
        selectAnswer: (questionId: number, answerIndex: number) => {
          const { questions } = get();
          // usar el structuredClone para clonar el objeto
          const newQuestions = structuredClone(questions);
          // encontramos el indice de la pregunta
          const questionIndex = newQuestions.findIndex(
            (q) => q.id === questionId
          );
          // obtenemos la informacion de la pregunta
          const questionInfo = newQuestions[questionIndex];
          // averiguamos si el usuario ha seleccionado la respuesta correcta
          const isCorrectUserAnswer =
            questionInfo.correctAnswer === answerIndex;
          // cambiar esta informacion en la copia de la pregunta
          newQuestions[questionIndex] = {
            ...questionInfo,
            isCorrectUserAnswer,
            userSelecterAnswer: answerIndex,
          };

          if (isCorrectUserAnswer) confetti();

          // actualizar el estado
          set({ questions: newQuestions });
        },
        goNextQuestion: () => {
          const { currentQuestion, questions } = get();
          const nextQuestion = currentQuestion + 1;

          if (nextQuestion < questions.length) {
            set({ currentQuestion: nextQuestion });
          }
        },
        goPreviousQuestion: () => {
          const { currentQuestion } = get();
          const previousQuestion = currentQuestion - 1;

          if (previousQuestion >= 0) {
            set({ currentQuestion: previousQuestion });
          }
        },
        reset: () => {
          set({
            currentQuestion: 0,
            questions: [],
          });
        },
      };
    },
    {
      name: "questions",
    }
  )
);
