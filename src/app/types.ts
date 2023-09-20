export interface Question {
  hindiText: string;
  englishText: string;
  audio: string;
}

export interface Answer {
  hindiText: string;
  englishText: string;
  audio: string;
  vote?: 0 | 1;
}

export interface Message {
  id: string;
  question: Question;
  answer: Answer;
  isLoading: boolean;
}
