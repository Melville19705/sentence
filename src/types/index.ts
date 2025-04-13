export interface Question {
    id: number;
    sentence: string;
    options: string[];
    correctAnswers: string[];
  }
  
  export interface UserAnswer {
    questionId: number;
    userAnswers: string[];
    isCorrect: boolean;
  }