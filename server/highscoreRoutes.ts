import express, { type Request, type Response } from "express";
import Highscore from "./highscoreModel.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, time, guesses, wordLength, uniqueOnly } = req.body;

  try {
    const entry = new Highscore({ name, time, guesses, wordLength, uniqueOnly });
    await entry.save();
    res.status(201).json({ message: "Score saved!" });
  } catch (error) {
    res.status(500).json({ error: "Could not save score" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { wordLength, uniqueOnly } = req.query;

    const filter: Record<string, unknown> = {};
    if (wordLength) filter.wordLength = Number(wordLength);
    if (uniqueOnly !== undefined) filter.uniqueOnly = uniqueOnly === "true";

    const scores = await Highscore.aggregate([
      { $match: filter },
      { $addFields: { guessCount: { $size: "$guesses" } } },
      { $sort: { guessCount: 1, time: 1 } },
    ]);

    res.render("highscore", { scores, filter, query: req.query });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch scores" });
  }
});

export default router;
