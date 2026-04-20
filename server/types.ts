export type LetterResult = "correct" | "misplaced" | "incorrect";

export interface LetterFeedback {
  letter: string;
  result: LetterResult;
}

export interface GameData {
  word: string;
  startTime: number;
  guesses: string[];
  wordLength: number;
  uniqueOnly: boolean;
}
