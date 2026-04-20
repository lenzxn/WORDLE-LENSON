import express, { type Request, type Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { saveGame, getGame, deleteGame } from "./gameStore.js";
import chooseWord from "./chooseWord.js";
import guessWord from "./guessWord.js";

const router = express.Router();

let words: string[] = [];
let wordsLoaded = false;

async function loadWords(): Promise<void> {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt"
    );
    const text = await response.text();
    words = text.split("\n").map((w) => w.trim());
    wordsLoaded = true;
    console.log(`Loaded ${words.length} words!`);
  } catch (error) {
    console.error("Failed to load word list:", error);
  }
}

loadWords();

router.post("/start", async (req: Request, res: Response) => {
  const { wordLength = 5, uniqueOnly = false } = req.body;

  const parsedLength = Number(wordLength);
  if (!Number.isInteger(parsedLength) || parsedLength < 3 || parsedLength > 10) {
    return res.status(400).json({ error: "wordLength must be an integer between 3 and 10" });
  }

  if (!wordsLoaded) {
    return res.status(503).json({ error: "Word list not ready yet, please try again" });
  }

  const word = chooseWord(words, parsedLength, uniqueOnly);

  if (!word) {
    return res.status(400).json({ error: "No words found with those settings" });
  }

  const gameId = uuidv4();

  saveGame(gameId, {
    word,
    startTime: Date.now(),
    guesses: [],
    wordLength: parsedLength,
    uniqueOnly,
  });

  res.json({ gameId, wordLength: parsedLength });
});

router.post("/guess", (req: Request, res: Response) => {
  const { gameId, guess } = req.body;

  const game = getGame(gameId);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  if (!guess || typeof guess !== "string" || !/^[a-zA-Z]+$/.test(guess)) {
    return res.status(400).json({ error: "Guess must contain only letters" });
  }

  if (guess.length !== game.word.length) {
    return res.status(400).json({ error: "Wrong word length" });
  }

  const feedback = guessWord(guess.toLowerCase(), game.word.toLowerCase());

  game.guesses.push(guess);

  const won = guess.toLowerCase() === game.word.toLowerCase();
  const time = Date.now() - game.startTime;

  if (won) {
    deleteGame(gameId);
  }

  res.json({ feedback, won, time, guesses: game.guesses });
});

export default router;
