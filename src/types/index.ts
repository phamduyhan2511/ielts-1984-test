// src/types/dataTypes.ts

export interface Blank {
  id: number;
  position: string;
  correctAnswer: string;
  type: string;
}

export interface DragWord {
  word: string;
  color: string;
  id: number;
}

export interface Question {
  paragraph: string;
  blanks: Blank[];
  dragWords: DragWord[];
}

export interface Data {
  question: Question;
}
