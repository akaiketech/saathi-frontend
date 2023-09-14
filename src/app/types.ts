export interface Question {
  hindiText: string;
  englishText: string;
  audio: string;
}

export interface Answer {
  hindiText: string;
  englishText: string;
  audio: string;
}

export interface Message {
  question: Question;
  answer: Answer;
  isLoading: boolean;
}
