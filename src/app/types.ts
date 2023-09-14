export interface Question {
  hindiText: string;
  englishText: string;
  audio: ArrayBuffer;
}

export interface Answer {
  hindiText: string;
  englishText: string;
  audio: ArrayBuffer;
}

export interface Message {
  question: Question;
  answer: Answer;
  isLoading: boolean;
}
