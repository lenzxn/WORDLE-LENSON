import type { LetterFeedback } from "./types.js";

export default function guessWord(guess: string, correctWord: string): LetterFeedback[] {
  if (guess.length !== correctWord.length) {
    throw new Error("Words must have the same length");
  }

  const result: (LetterFeedback | undefined)[] = new Array(guess.length);
  const remainingLetters: string[] = [];

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correctWord[i]) {
      result[i] = { letter: guess[i], result: "correct" };
    } else {
      remainingLetters.push(correctWord[i]);
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i]) continue;

    const letterIndex = remainingLetters.indexOf(guess[i]);

    if (letterIndex !== -1) {
      result[i] = { letter: guess[i], result: "misplaced" };
      remainingLetters.splice(letterIndex, 1);
    } else {
      result[i] = { letter: guess[i], result: "incorrect" };
    }
  }

  return result as LetterFeedback[];
}
